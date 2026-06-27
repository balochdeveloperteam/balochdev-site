import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';
import { safeError } from '../utils.js';

const analytics = new Hono();

analytics.post('/track', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'Database not configured' }, 503);
  const body = await c.req.json().catch(() => ({}));
  const { path, referrer } = body || {};
  const { error } = await admin.from('analytics_events').insert({
    path: path || '/',
    referrer: referrer || null,
    user_agent: c.req.header('user-agent') || null,
  });
  if (error) return safeError(c, 500, error.message);
  return c.json({ ok: true });
});

const adminAnalytics = new Hono();
adminAnalytics.use('*', requireAdmin());

adminAnalytics.get('/summary', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { count, error } = await admin
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since.toISOString());
  if (error) return safeError(c, 500, error.message);
  return c.json({ pageviews: count || 0 });
});

export { analytics, adminAnalytics };
