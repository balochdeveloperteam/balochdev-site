import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';

import { corsMiddleware } from './middleware/cors.js';
import { rateLimit } from './middleware/rateLimit.js';
import { getAdmin } from './db.js';

import blog from './routes/blog.js';
import blogAdmin from './routes/blogAdmin.js';
import { publicEngagement, adminEngagement } from './routes/blogEngagement.js';
import { publicAds, adminAds } from './routes/ads.js';
import estimate from './routes/estimate.js';
import forms, { formLimiter, legacyContactHandler } from './routes/forms.js';
import uploads from './routes/uploads.js';
import media from './routes/media.js';
import projects from './routes/projects.js';
import { analytics, adminAnalytics } from './routes/analytics.js';

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  secureHeaders({
    // Mirror the Express setup: helmet had CSP disabled and CORP set to
    // 'cross-origin' so the Pages site can call this Worker from balochdev.com.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: 'cross-origin',
  }),
);
app.use('*', corsMiddleware());

// Global safety net — mirrors the Express setup (300 req / IP / 15 min)
app.use(
  '/api/*',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    scope: 'global',
  }),
);

// Health check — used by uptime monitors and CI smoke tests.
// Reports secret PRESENCE only (boolean) — never the secret value itself.
app.get('/api/health', (c) => {
  const admin = getAdmin(c);
  const has = (key) => !!String(c.env[key] || '').trim();
  return c.json({
    ok: true,
    db: !!admin,
    cloudinary: {
      cloud_name: has('CLOUDINARY_CLOUD_NAME'),
      api_key: has('CLOUDINARY_API_KEY'),
      api_secret: has('CLOUDINARY_API_SECRET'),
    },
    gemini: has('GEMINI_API_KEY'),
  });
});

// Public + admin routes
app.route('/api/blog/admin', blogAdmin);
app.route('/api/blog/admin', adminEngagement);
app.route('/api/blog', blog);
app.route('/api/blog', publicEngagement);

app.route('/api/ads', publicAds);
app.route('/api/ads/admin', adminAds);

app.route('/api/projects', projects);
app.route('/api/estimate', estimate);
app.route('/api/forms', forms);
app.route('/api/uploads', uploads);
app.route('/api/media', media);
app.route('/api/analytics', analytics);
app.route('/api/analytics', adminAnalytics);

// Backward-compatible alias: POST /api/contact
app.post('/api/contact', formLimiter, legacyContactHandler);

// Catch-all 404
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Top-level error handler — never leak stack traces
app.onError((err, c) => {
  console.error('[unhandled]', err);
  const isProd = c.env.NODE_ENV === 'production';
  return c.json({ error: isProd ? 'Server error' : err?.message || 'Server error' }, 500);
});

export default app;
