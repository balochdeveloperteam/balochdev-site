import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { requireBlogAdmin } from '../middleware/auth.js';
import {
  sanitizeBlogHtml,
  computeReadingTimeMinutes,
  slugifyTitle,
  normalizeTags,
  normalizeRelatedSlugs,
} from '../services/blog.js';
import { safeError } from '../utils.js';

const blogAdmin = new Hono();

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
    summary: String(body.summary || '').trim(),
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

async function isSlugTaken(admin, slug, excludeId) {
  let q = admin.from('blog_posts').select('id').eq('slug', slug);
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return !!data;
}

blogAdmin.use('*', requireBlogAdmin());

blogAdmin.get('/me', async (c) => {
  const admin = getAdmin(c);
  const user = c.get('user');
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
  return c.json({ ok: true, name, role: role || 'admin' });
});

blogAdmin.get('/stats', async (c) => {
  const admin = getAdmin(c);
  const { data: posts, error: postsErr } = await admin.from('blog_posts').select('status, view_count');
  if (postsErr) return safeError(c, 500, postsErr.message);

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

  return c.json(stats);
});

blogAdmin.get('/posts', async (c) => {
  const admin = getAdmin(c);
  const { data, error } = await admin
    .from('blog_posts')
    .select('id,title,slug,status,post_type,published_at,view_count,created_at,updated_at')
    .order('updated_at', { ascending: false });
  if (error) return safeError(c, 500, error.message);
  return c.json({ posts: data || [] });
});

blogAdmin.get('/posts/:id', async (c) => {
  const admin = getAdmin(c);
  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('id', c.req.param('id'))
    .maybeSingle();
  if (error) return safeError(c, 500, error.message);
  if (!data) return c.json({ error: 'Post not found' }, 404);
  return c.json({ post: data });
});

blogAdmin.get('/slug-check', async (c) => {
  const admin = getAdmin(c);
  const slug = String(c.req.query('slug') || '').trim();
  const excludeId = c.req.query('excludeId') || null;
  if (!slug) return c.json({ error: 'slug required' }, 400);
  try {
    const taken = await isSlugTaken(admin, slug, excludeId);
    return c.json({ slug, available: !taken });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

blogAdmin.get('/published-options', async (c) => {
  const admin = getAdmin(c);
  const excludeId = c.req.query('excludeId') || null;
  let q = admin
    .from('blog_posts')
    .select('id,title,slug')
    .eq('status', 'published')
    .order('title');
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q;
  if (error) return safeError(c, 500, error.message);
  return c.json({ posts: data || [] });
});

blogAdmin.get('/authors', async (c) => {
  const admin = getAdmin(c);
  const { data, error } = await admin
    .from('team_members')
    .select('id,full_name,access_role')
    .in('access_role', ['admin', 'manager', 'member'])
    .order('full_name');
  if (error) return safeError(c, 500, error.message);
  return c.json({ members: data || [] });
});

blogAdmin.post('/posts', async (c) => {
  const admin = getAdmin(c);
  const user = c.get('user');
  try {
    const body = await c.req.json();
    const row = buildBlogPostRow(body || {}, user);
    if (await isSlugTaken(admin, row.slug)) {
      return c.json({ error: 'Slug already in use' }, 409);
    }
    const { data, error } = await admin.from('blog_posts').insert(row).select().single();
    if (error) return safeError(c, 500, error.message);
    return c.json({ post: data }, 201);
  } catch (err) {
    if (err.status === 400) return c.json({ error: err.message }, 400);
    return safeError(c, 500, err.message);
  }
});

blogAdmin.put('/posts/:id', async (c) => {
  const admin = getAdmin(c);
  const user = c.get('user');
  try {
    const body = await c.req.json();
    const row = buildBlogPostRow(body || {}, user);
    if (await isSlugTaken(admin, row.slug, c.req.param('id'))) {
      return c.json({ error: 'Slug already in use' }, 409);
    }
    const { data, error } = await admin
      .from('blog_posts')
      .update(row)
      .eq('id', c.req.param('id'))
      .select()
      .single();
    if (error) return safeError(c, 500, error.message);
    if (!data) return c.json({ error: 'Post not found' }, 404);
    return c.json({ post: data });
  } catch (err) {
    if (err.status === 400) return c.json({ error: err.message }, 400);
    return safeError(c, 500, err.message);
  }
});

blogAdmin.delete('/posts/:id', async (c) => {
  const admin = getAdmin(c);
  const { error } = await admin.from('blog_posts').delete().eq('id', c.req.param('id'));
  if (error) return safeError(c, 500, error.message);
  return c.json({ ok: true });
});

export default blogAdmin;
