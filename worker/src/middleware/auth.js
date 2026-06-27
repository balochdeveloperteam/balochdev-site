/**
 * Auth middleware — verifies Supabase session token from the
 * Authorization header and enforces admin role.
 */

import { getAdmin } from '../db.js';

async function loadUser(c) {
  const admin = getAdmin(c);
  if (!admin) return { error: 'Server misconfigured', status: 503 };

  const auth = c.req.header('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return { error: 'Missing token', status: 401 };

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return { error: 'Invalid session', status: 401 };
  return { user: data.user };
}

async function canUploadImages(admin, user) {
  if (user.app_metadata?.role === 'admin') return true;
  const { data } = await admin
    .from('team_members')
    .select('access_role')
    .eq('auth_user_id', user.id)
    .maybeSingle();
  if (!data) return false;
  return data.access_role === 'admin' || data.access_role === 'manager';
}

export function requireAdmin() {
  return async (c, next) => {
    const r = await loadUser(c);
    if (r.error) return c.json({ error: r.error }, r.status);
    if (r.user.app_metadata?.role !== 'admin') {
      return c.json({ error: 'Admin only' }, 403);
    }
    c.set('user', r.user);
    await next();
  };
}

export function requireBlogAdmin() {
  return async (c, next) => {
    const r = await loadUser(c);
    if (r.error) return c.json({ error: r.error }, r.status);
    const admin = getAdmin(c);
    const allowed = await canUploadImages(admin, r.user);
    if (!allowed) return c.json({ error: 'Upload not permitted' }, 403);
    c.set('user', r.user);
    await next();
  };
}
