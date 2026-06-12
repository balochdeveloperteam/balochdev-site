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
    .select('id,title,slug,excerpt,published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(50);
  if (error) return safeError(res, 500, error.message);
  res.json({ posts: data || [] });
});

app.get('/api/blog/:slug', async (req, res) => {
  if (!admin) return res.status(404).json({ post: null });
  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('slug', req.params.slug)
    .eq('published', true)
    .maybeSingle();
  if (error) return safeError(res, 500, error.message);
  if (!data) return res.status(404).json({ post: null });
  res.json({ post: data });
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

/** Blog admin (app_metadata) OR team workspace admin/manager (team_members.access_role). */
async function requireUploadAuth(req, res, next) {
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

app.post('/api/blog', requireAdmin, async (req, res) => {
  const { title, slug, excerpt, body_html, published = true } = req.body || {};
  if (!title || !slug) return res.status(400).json({ error: 'title and slug required' });
  const { data, error } = await admin
    .from('blog_posts')
    .insert({
      title,
      slug,
      excerpt: excerpt || '',
      body_html: body_html || '',
      published,
      published_at: published ? new Date().toISOString() : null,
      author_id: req.user.id,
    })
    .select()
    .single();
  if (error) return safeError(res, 500, error.message);
  res.json({ post: data });
});

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
