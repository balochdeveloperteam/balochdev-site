require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const {
  sendTelegramHtml,
  appendGoogleSheetRow,
  formatTelegramMessage,
  sheetRowFromPayload,
} = require('./notify');
const { uploadImage, ALLOWED_FOLDERS } = require('./services/cloudinary');
const {
  sanitizeBlogHtml,
  computeReadingTimeMinutes,
  slugifyTitle,
  mapPublicPost,
  stripHtmlToPlain,
  normalizeTags,
  normalizeRelatedSlugs,
} = require('./services/blog');
const {
  registerBlogEngagementRoutes,
  getPublishedPostBySlug,
  enrichPostWithAvatar,
  getPrevNextSlugs,
} = require('./routes/blogEngagement');

const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === 'production';

// Trust proxy headers when behind Vercel/Cloudflare/etc so rate-limit gets the real client IP
app.set('trust proxy', 1);
app.disable('x-powered-by');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// CORS: fail-closed in production unless origin is allowed.
// Set CORS_ALLOWED_ORIGINS (comma-separated) on Render; CORS_ORIGIN is still read as a fallback.
const DEFAULT_CORS_ORIGINS = [
  'https://balochdev.com',
  'https://www.balochdev.com',
  'https://balochdev-site.pages.dev',
  'http://localhost:5173',
  'http://localhost:5174',
];

/** Cloudflare Pages project slug — preview URLs are https://<hash>.<project>.pages.dev */
const CF_PAGES_PROJECT = process.env.CLOUDFLARE_PAGES_PROJECT_NAME || 'balochdev-site';

function parseCorsOrigins() {
  const raw = process.env.CORS_ALLOWED_ORIGINS || process.env.CORS_ORIGIN || '';
  const fromEnv = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_CORS_ORIGINS;
}

function isCloudflarePagesOrigin(origin) {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:') return false;
    const projectHost = `${CF_PAGES_PROJECT}.pages.dev`;
    return hostname === projectHost || hostname.endsWith(`.${projectHost}`);
  } catch {
    return false;
  }
}

function isCorsOriginAllowed(origin, allowedList) {
  if (allowedList.includes(origin)) return true;
  return isCloudflarePagesOrigin(origin);
}

const allowedOrigins = parseCorsOrigins();

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (!isProd && !process.env.CORS_ALLOWED_ORIGINS && !process.env.CORS_ORIGIN) {
      return cb(null, true);
    }
    if (isCorsOriginAllowed(origin, allowedOrigins)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '512kb' }));

// Generic safety net: max 300 requests / IP / 15 minutes across the whole API
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Forms: max 5 submissions per IP per 10 minutes (prevents flooding Telegram + DB)
const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

// Returns a generic message in production but the real one in dev for debugging.
function safeError(res, status, devMessage, prodMessage = 'Internal server error') {
  if (isProd) return res.status(status).json({ error: prodMessage });
  return res.status(status).json({ error: devMessage });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: !!admin });
});

/** Optional: track page view for analytics dashboard */
app.post('/api/analytics/track', async (req, res) => {
  if (!admin) return res.status(503).json({ error: 'Database not configured' });
  const { path, referrer } = req.body || {};
  const { error } = await admin.from('analytics_events').insert({
    path: path || '/',
    referrer: referrer || null,
    user_agent: req.headers['user-agent'] || null,
  });
  if (error) return safeError(res, 500, error.message);
  res.json({ ok: true });
});

app.get('/api/blog', async (_req, res) => {
  if (!admin) return res.json({ posts: [] });
  const { data, error } = await admin
    .from('blog_posts')
    .select(
      'id,title,slug,excerpt,published_at,updated_at,cover_image_url,cover_image_alt,post_type,author_name,author_member_id,reading_time_minutes,like_count,comment_count,tags,category,meta_description',
    )
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(100);
  if (error) return safeError(res, 500, error.message);

  const memberIds = [...new Set((data || []).map((p) => p.author_member_id).filter(Boolean))];
  /** @type {Map<string, string>} */
  const avatarByMember = new Map();
  if (memberIds.length) {
    const { data: members } = await admin
      .from('team_members')
      .select('id, avatar_url')
      .in('id', memberIds);
    for (const m of members || []) {
      if (m.avatar_url) avatarByMember.set(m.id, m.avatar_url);
    }
  }

  const posts = (data || []).map((row) =>
    mapPublicPost(row, {
      author_avatar_url: row.author_member_id ? avatarByMember.get(row.author_member_id) || null : null,
      excerpt_plain: stripHtmlToPlain(row.excerpt || row.meta_description || '', 200),
    }),
  );
  res.json({ posts });
});

async function requireAdmin(req, res, next) {
  if (!admin) return res.status(503).json({ error: 'Server misconfigured' });
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid session' });
  // Enforce admin role from app_metadata. Set with:
  //   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = '...';
  const role = data.user.app_metadata?.role;
  if (role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  req.user = data.user;
  next();
}

async function canUploadImages(user) {
  if (user.app_metadata?.role === 'admin') return true;
  const { data, error } = await admin
    .from('team_members')
    .select('access_role')
    .eq('auth_user_id', user.id)
    .maybeSingle();
  if (error || !data) return false;
  return data.access_role === 'admin' || data.access_role === 'manager';
}

/** Blog CMS + uploads: app_metadata admin OR team admin/manager. */
async function requireBlogAdmin(req, res, next) {
  if (!admin) return res.status(503).json({ error: 'Server misconfigured' });
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid session' });
  const allowed = await canUploadImages(data.user);
  if (!allowed) return res.status(403).json({ error: 'Upload not permitted' });
  req.user = data.user;
  next();
}

const requireUploadAuth = requireBlogAdmin;

function buildBlogPostRow(body, user) {
  const title = String(body?.title || '').trim();
  const slug = String(body?.slug || '').trim() || slugifyTitle(title);
  if (!title || !slug) {
    const err = new Error('title and slug required');
    err.status = 400;
    throw err;
  }

  const contentHtml = sanitizeBlogHtml(body.content_html || body.body_html || '');
  const status = ['draft', 'published', 'archived'].includes(body.status) ? body.status : 'draft';
  const postType = body.post_type === 'image_caption' ? 'image_caption' : 'article';
  let publishedAt = body.published_at || null;
  if (status === 'published') {
    publishedAt = publishedAt || new Date().toISOString();
  } else if (status === 'draft') {
    publishedAt = null;
  }

  return {
    title,
    slug,
    excerpt: String(body.excerpt || '').trim(),
    content_html: contentHtml,
    cover_image_url: body.cover_image_url || null,
    cover_image_alt: String(body.cover_image_alt || '').trim(),
    meta_title: String(body.meta_title || '').trim(),
    meta_description: String(body.meta_description || '').trim(),
    focus_keyword: String(body.focus_keyword || '').trim(),
    tags: normalizeTags(body.tags),
    category: String(body.category || '').trim(),
    og_image_url: body.og_image_url || body.cover_image_url || null,
    reading_time_minutes: computeReadingTimeMinutes(contentHtml),
    status,
    post_type: postType,
    author_name: String(body.author_name || 'BalochDev').trim() || 'BalochDev',
    author_member_id: body.author_member_id || null,
    related_slugs: normalizeRelatedSlugs(body.related_slugs),
    published_at: publishedAt,
    author_id: user.id,
  };
}

async function isSlugTaken(slug, excludeId) {
  let q = admin.from('blog_posts').select('id').eq('slug', slug);
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return !!data;
}

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
  },
});

function handleImageUpload(req, res, next) {
  imageUpload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image must be 10MB or smaller' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}

/** @deprecated Use POST /api/blog/admin/posts */
app.post('/api/blog', requireBlogAdmin, async (req, res) => {
  try {
    const row = buildBlogPostRow(
      { ...req.body, status: req.body?.published === false ? 'draft' : 'published' },
      req.user,
    );
    if (await isSlugTaken(row.slug)) {
      return res.status(409).json({ error: 'Slug already in use' });
    }
    const { data, error } = await admin.from('blog_posts').insert(row).select().single();
    if (error) return safeError(res, 500, error.message);
    return res.json({ post: data });
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    return safeError(res, 500, err.message);
  }
});

app.get('/api/blog/admin/me', requireBlogAdmin, async (req, res) => {
  const user = req.user;
  let name = user.user_metadata?.full_name || user.email || 'Admin';
  let role = user.app_metadata?.role === 'admin' ? 'admin' : null;

  if (!role) {
    const { data } = await admin
      .from('team_members')
      .select('full_name, access_role')
      .eq('auth_user_id', user.id)
      .maybeSingle();
    if (data) {
      name = data.full_name || name;
      role = data.access_role;
    }
  }

  res.json({ ok: true, name, role: role || 'admin' });
});

app.get('/api/blog/admin/stats', requireBlogAdmin, async (_req, res) => {
  const { data: posts, error: postsErr } = await admin
    .from('blog_posts')
    .select('status, view_count');
  if (postsErr) return safeError(res, 500, postsErr.message);

  const rows = posts || [];
  const stats = {
    total: rows.length,
    published: rows.filter((r) => r.status === 'published').length,
    drafts: rows.filter((r) => r.status === 'draft').length,
    archived: rows.filter((r) => r.status === 'archived').length,
    totalViews: rows.reduce((sum, r) => sum + (r.view_count || 0), 0),
    pageviews30d: null,
  };

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { count, error: pvErr } = await admin
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since.toISOString());
  if (!pvErr) stats.pageviews30d = count || 0;

  res.json(stats);
});

app.get('/api/blog/admin/posts', requireBlogAdmin, async (_req, res) => {
  const { data, error } = await admin
    .from('blog_posts')
    .select('id,title,slug,status,post_type,published_at,view_count,created_at,updated_at')
    .order('updated_at', { ascending: false });
  if (error) return safeError(res, 500, error.message);
  res.json({ posts: data || [] });
});

app.get('/api/blog/admin/posts/:id', requireBlogAdmin, async (req, res) => {
  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) return safeError(res, 500, error.message);
  if (!data) return res.status(404).json({ error: 'Post not found' });
  res.json({ post: data });
});

app.get('/api/blog/admin/slug-check', requireBlogAdmin, async (req, res) => {
  const slug = String(req.query.slug || '').trim();
  const excludeId = req.query.excludeId || null;
  if (!slug) return res.status(400).json({ error: 'slug required' });
  try {
    const taken = await isSlugTaken(slug, excludeId);
    res.json({ slug, available: !taken });
  } catch (err) {
    safeError(res, 500, err.message);
  }
});

app.get('/api/blog/admin/published-options', requireBlogAdmin, async (req, res) => {
  const excludeId = req.query.excludeId || null;
  let q = admin
    .from('blog_posts')
    .select('id,title,slug')
    .eq('status', 'published')
    .order('title');
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q;
  if (error) return safeError(res, 500, error.message);
  res.json({ posts: data || [] });
});

app.get('/api/blog/admin/authors', requireBlogAdmin, async (_req, res) => {
  const { data, error } = await admin
    .from('team_members')
    .select('id,full_name,access_role')
    .in('access_role', ['admin', 'manager', 'member'])
    .order('full_name');
  if (error) return safeError(res, 500, error.message);
  res.json({ members: data || [] });
});

app.post('/api/blog/admin/posts', requireBlogAdmin, async (req, res) => {
  try {
    const row = buildBlogPostRow(req.body || {}, req.user);
    if (await isSlugTaken(row.slug)) {
      return res.status(409).json({ error: 'Slug already in use' });
    }
    const { data, error } = await admin.from('blog_posts').insert(row).select().single();
    if (error) return safeError(res, 500, error.message);
    res.status(201).json({ post: data });
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    return safeError(res, 500, err.message);
  }
});

app.put('/api/blog/admin/posts/:id', requireBlogAdmin, async (req, res) => {
  try {
    const row = buildBlogPostRow(req.body || {}, req.user);
    if (await isSlugTaken(row.slug, req.params.id)) {
      return res.status(409).json({ error: 'Slug already in use' });
    }
    const { data, error } = await admin
      .from('blog_posts')
      .update(row)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return safeError(res, 500, error.message);
    if (!data) return res.status(404).json({ error: 'Post not found' });
    res.json({ post: data });
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    return safeError(res, 500, err.message);
  }
});

app.delete('/api/blog/admin/posts/:id', requireBlogAdmin, async (req, res) => {
  const { error } = await admin.from('blog_posts').delete().eq('id', req.params.id);
  if (error) return safeError(res, 500, error.message);
  res.json({ ok: true });
});

app.get('/api/blog/:slug', async (req, res) => {
  if (!admin) return res.status(404).json({ post: null });
  try {
    const data = await getPublishedPostBySlug(admin, req.params.slug);
    if (!data) return res.status(404).json({ post: null });

    const [avatarExtra, neighbors] = await Promise.all([
      enrichPostWithAvatar(admin, data),
      getPrevNextSlugs(admin, data),
    ]);

    /** @type {object[]} */
    let relatedPosts = [];
    const relatedSlugs = Array.isArray(data.related_slugs) ? data.related_slugs.filter(Boolean) : [];
    if (relatedSlugs.length) {
      const { data: relatedRows } = await admin
        .from('blog_posts')
        .select('id,title,slug,excerpt,cover_image_url,reading_time_minutes,published_at')
        .eq('published', true)
        .in('slug', relatedSlugs.slice(0, 8));
      const order = new Map(relatedSlugs.map((s, i) => [s, i]));
      relatedPosts = (relatedRows || [])
        .sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99))
        .map((r) => mapPublicPost(r));
    } else if (data.category) {
      const { data: catRows } = await admin
        .from('blog_posts')
        .select('id,title,slug,excerpt,cover_image_url,reading_time_minutes,published_at')
        .eq('published', true)
        .eq('category', data.category)
        .neq('id', data.id)
        .order('published_at', { ascending: false })
        .limit(4);
      relatedPosts = (catRows || []).map((r) => mapPublicPost(r));
    }

    res.json({
      post: mapPublicPost(data, { ...avatarExtra, ...neighbors, related_posts: relatedPosts }),
    });
  } catch (err) {
    safeError(res, 500, err.message);
  }
});

registerBlogEngagementRoutes(app, { admin, safeError, requireBlogAdmin });

app.post('/api/uploads/image', requireUploadAuth, handleImageUpload, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided. Use multipart field name "image".' });

  const folder = String(req.body?.folder || '').trim();
  if (!ALLOWED_FOLDERS.has(folder)) {
    return res.status(400).json({
      error: 'Invalid folder. Use balochdev/blog, balochdev/members, or balochdev/site.',
    });
  }

  const publicId = String(req.body?.publicId || '').trim() || undefined;

  try {
    const result = await uploadImage(req.file.buffer, { folder, publicId });
    return res.json({
      secureUrl: result.secureUrl,
      publicId: result.publicId,
    });
  } catch (err) {
    return safeError(res, 500, err.message, 'Upload failed');
  }
});

app.get('/api/analytics/summary', requireAdmin, async (_req, res) => {
  if (!admin) return res.status(503).json({ error: 'No DB' });
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { count, error } = await admin
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since.toISOString());
  if (error) return safeError(res, 500, error.message);
  res.json({ pageviews: count || 0 });
});

async function handleFormPayload(req, res, form_type, body) {
  const {
    name,
    email,
    phone,
    company,
    message,
    budget,
    timeline,
    details,
    form_type: _formTypeIgnored,
    website, // honeypot — real users never see this field
    ...rest
  } = body || {};

  // Silent reject: pretend success so bots don't retry, but skip DB/Telegram/Sheets
  if (website) {
    return res.json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const meta = { ...rest };
  if (budget) meta.budget = budget;
  if (timeline) meta.timeline = timeline;
  if (details) meta.details = details;

  const payload = {
    form_type,
    name: String(name).slice(0, 500),
    email: String(email).slice(0, 500),
    phone: phone ? String(phone).slice(0, 100) : null,
    company: company ? String(company).slice(0, 300) : null,
    message: String(message).slice(0, 15000),
    meta,
    client_ip: req.ip || req.headers['x-forwarded-for'] || null,
  };

  if (admin) {
    const { error } = await admin.from('form_submissions').insert(payload);
    if (error) return safeError(res, 500, error.message, 'Could not save submission');
  }

  const tg = await sendTelegramHtml(formatTelegramMessage(payload));
  const sheet = await appendGoogleSheetRow(sheetRowFromPayload(payload));

  return res.json({
    ok: true,
    telegram: tg.skipped ? 'disabled' : tg.ok ? 'sent' : 'failed',
    sheets: sheet.skipped ? 'disabled' : sheet.ok ? 'appended' : 'failed',
  });
}

/** Contact, proposal, and AI estimate — stores in Supabase + Telegram + Google Sheet (optional) */
app.post('/api/forms/submit', formLimiter, async (req, res) => {
  const form_type = req.body?.form_type || 'contact';
  if (!['contact', 'proposal', 'estimate'].includes(form_type)) {
    return res.status(400).json({ error: 'Invalid form_type' });
  }
  return handleFormPayload(req, res, form_type, req.body);
});

/** Backward-compatible alias */
app.post('/api/contact', formLimiter, async (req, res) => {
  return handleFormPayload(req, res, 'contact', req.body);
});

app.get('/api/projects', async (_req, res) => {
  if (!admin) return res.json({ projects: [] });
  const { data, error } = await admin
    .from('projects')
    .select('id,title,slug,summary,image_path,category,sort_order,created_at')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) return safeError(res, 500, error.message);
  res.json({ projects: data || [] });
});

app.get('/api/projects/:slug', async (req, res) => {
  if (!admin) return res.status(404).json({ project: null });
  const { data, error } = await admin
    .from('projects')
    .select('*')
    .eq('slug', req.params.slug)
    .eq('published', true)
    .maybeSingle();
  if (error) return safeError(res, 500, error.message);
  if (!data) return res.status(404).json({ project: null });
  res.json({ project: data });
});

// Catch-all error handler — never leaks stack traces to the client
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  if (res.headersSent) return;
  return safeError(res, 500, err?.message || 'Server error');
});

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
