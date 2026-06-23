import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { mapPublicPost, stripHtmlToPlain } from '../services/blog.js';
import { safeError } from '../utils.js';
import { getPublishedPostBySlug, enrichPostWithAvatar, getPrevNextSlugs } from './blogEngagement.js';

const blog = new Hono();

blog.get('/', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ posts: [] });

  const { data, error } = await admin
    .from('blog_posts')
    .select(
      'id,title,slug,excerpt,published_at,updated_at,cover_image_url,cover_image_alt,post_type,author_name,author_member_id,reading_time_minutes,like_count,comment_count,tags,category,meta_description',
    )
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(100);
  if (error) return safeError(c, 500, error.message);

  const memberIds = [...new Set((data || []).map((p) => p.author_member_id).filter(Boolean))];
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
  return c.json({ posts });
});

blog.get('/:slug', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ post: null }, 404);

  try {
    const data = await getPublishedPostBySlug(admin, c.req.param('slug'));
    if (!data) return c.json({ post: null }, 404);

    const [avatarExtra, neighbors] = await Promise.all([
      enrichPostWithAvatar(admin, data),
      getPrevNextSlugs(admin, data),
    ]);

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

    return c.json({
      post: mapPublicPost(data, { ...avatarExtra, ...neighbors, related_posts: relatedPosts }),
    });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

export default blog;
