import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { requireBlogAdmin } from '../middleware/auth.js';
import {
  buildAdsByPlacement,
  latestAdPerPlacement,
  normalizeAdBody,
} from '../services/ads.js';
import { safeError } from '../utils.js';

async function resolveTeamMemberId(adminClient, authUserId) {
  const { data } = await adminClient
    .from('team_members')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  return data?.id || null;
}

const publicAds = new Hono();

publicAds.get('/', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ ads: {} });
  try {
    const { data, error } = await admin.from('ads').select('*');
    if (error) {
      if (/relation.*ads.*does not exist|ads.*does not exist/i.test(error.message || '')) {
        return c.json({ ads: {} });
      }
      return safeError(c, 500, error.message);
    }
    return c.json({ ads: buildAdsByPlacement(data || []) });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

const adminAds = new Hono();
adminAds.use('*', requireBlogAdmin());

adminAds.get('/', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  try {
    const { data, error } = await admin
      .from('ads')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) return safeError(c, 500, error.message);
    return c.json({ placements: latestAdPerPlacement(data || []), all: data || [] });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

adminAds.post('/', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  try {
    const body = await c.req.json();
    const row = normalizeAdBody(body || {});
    const createdBy = await resolveTeamMemberId(admin, c.get('user').id);
    const { data, error } = await admin
      .from('ads')
      .insert({ ...row, created_by: createdBy })
      .select()
      .single();
    if (error) return safeError(c, 500, error.message);
    return c.json({ ad: data }, 201);
  } catch (err) {
    if (err.status === 400) return c.json({ error: err.message }, 400);
    return safeError(c, 500, err.message);
  }
});

adminAds.put('/:id', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  try {
    const body = await c.req.json();
    const row = normalizeAdBody(body || {});
    const { data, error } = await admin
      .from('ads')
      .update(row)
      .eq('id', c.req.param('id'))
      .select()
      .single();
    if (error) return safeError(c, 500, error.message);
    if (!data) return c.json({ error: 'Ad not found' }, 404);
    return c.json({ ad: data });
  } catch (err) {
    if (err.status === 400) return c.json({ error: err.message }, 400);
    return safeError(c, 500, err.message);
  }
});

adminAds.delete('/:id', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  const { error } = await admin.from('ads').delete().eq('id', c.req.param('id'));
  if (error) return safeError(c, 500, error.message);
  return c.json({ ok: true });
});

export { publicAds, adminAds };
