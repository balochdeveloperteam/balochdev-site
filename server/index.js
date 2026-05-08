require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const {
  sendTelegramHtml,
  appendGoogleSheetRow,
  formatTelegramMessage,
  sheetRowFromPayload,
} = require('./notify');

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

// CORS: fail-closed in production (must explicitly set CORS_ORIGIN);
// allow all in dev so the Vite dev proxy + curl tests work.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean)
  : null;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (!allowedOrigins) return cb(null, !isProd);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
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
