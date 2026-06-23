import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { requireBlogAdmin } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import {
  sanitizeCommentPlainText,
  mapPublicComment,
} from '../services/blogEngagement.js';
import {
  hashClientIp,
  isValidVisitorKey,
  isValidEmail,
  isValidAuthorName,
  safeError,
} from '../utils.js';

export async function getPublishedPostBySlug(admin, slug) {
  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function enrichPostWithAvatar(admin, postRow) {
  if (!postRow?.author_member_id) return { author_avatar_url: null };
  const { data } = await admin
    .from('team_members')
    .select('avatar_url')
    .eq('id', postRow.author_member_id)
    .maybeSingle();
  return { author_avatar_url: data?.avatar_url || null };
}

export async function getPrevNextSlugs(admin, postRow) {
  if (!postRow?.published_at) return { prev_slug: null, next_slug: null };
  const ts = postRow.published_at;

  const [{ data: prevRow }, { data: nextRow }] = await Promise.all([
    admin
      .from('blog_posts')
      .select('slug')
      .eq('published', true)
      .lt('published_at', ts)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin
      .from('blog_posts')
      .select('slug')
      .eq('published', true)
      .gt('published_at', ts)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return { prev_slug: prevRow?.slug || null, next_slug: nextRow?.slug || null };
}

async function fetchVisibleComments(admin, postId) {
  const { data, error } = await admin
    .from('blog_comments')
    .select('id, post_id, parent_id, author_name, content, is_pinned, like_count, created_at, status')
    .eq('post_id', postId)
    .eq('status', 'visible')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapPublicComment);
}

async function attachVisitorLikeFlags(admin, postId, visitorKey, comments) {
  if (!isValidVisitorKey(visitorKey)) {
    return { postLiked: false, comments: comments.map((c) => ({ ...c, liked: false })) };
  }
  const { data: likes } = await admin
    .from('blog_likes')
    .select('target_type, target_id')
    .eq('post_id', postId)
    .eq('visitor_key', visitorKey);

  const likedCommentIds = new Set(
    (likes || []).filter((l) => l.target_type === 'comment').map((l) => l.target_id),
  );
  const postLiked = (likes || []).some((l) => l.target_type === 'post' && l.target_id === postId);

  return {
    postLiked,
    comments: comments.map((c) => ({ ...c, liked: likedCommentIds.has(c.id) })),
  };
}

// =====================================================================
// Public routes (mounted under /api/blog)
// =====================================================================

const publicEngagement = new Hono();

publicEngagement.get('/:slug/comments', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ comments: [] });
  try {
    const post = await getPublishedPostBySlug(admin, c.req.param('slug'));
    if (!post) return c.json({ error: 'Post not found' }, 404);

    const comments = await fetchVisibleComments(admin, post.id);
    const visitorKey = String(c.req.query('visitor_key') || '').trim();
    const { postLiked, comments: withLikes } = await attachVisitorLikeFlags(
      admin,
      post.id,
      visitorKey,
      comments,
    );
    return c.json({ comments: withLikes, post_liked: postLiked, like_count: post.like_count || 0 });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

publicEngagement.post(
  '/:slug/comments',
  rateLimit({ windowMs: 60 * 1000, max: 5, scope: 'comment', message: { error: 'Too many comments. Please wait a minute and try again.' } }),
  async (c) => {
    const admin = getAdmin(c);
    if (!admin) return c.json({ error: 'Database not configured' }, 503);
    const body = await c.req.json().catch(() => ({}));
    const { author_name, author_email, content, parent_id, website } = body;

    if (website) return c.json({ ok: true, comment: null });

    if (!isValidAuthorName(author_name)) {
      return c.json({ error: 'Please enter your name (2–80 characters).' }, 400);
    }
    if (!isValidEmail(author_email)) {
      return c.json({ error: 'A valid email is required (not shown publicly).' }, 400);
    }
    const plain = sanitizeCommentPlainText(content);
    if (plain.length < 2) {
      return c.json({ error: 'Comment is too short.' }, 400);
    }

    try {
      const post = await getPublishedPostBySlug(admin, c.req.param('slug'));
      if (!post) return c.json({ error: 'Post not found' }, 404);

      let parentId = parent_id || null;
      if (parentId) {
        const { data: parentRow } = await admin
          .from('blog_comments')
          .select('id, post_id, parent_id')
          .eq('id', parentId)
          .eq('post_id', post.id)
          .eq('status', 'visible')
          .maybeSingle();
        if (!parentRow || parentRow.parent_id) {
          return c.json({ error: 'Invalid reply target.' }, 400);
        }
      }

      const ipHash = await hashClientIp(c);
      const { data: recent } = await admin
        .from('blog_comments')
        .select('id')
        .eq('ip_hash', ipHash)
        .gte('created_at', new Date(Date.now() - 60_000).toISOString())
        .limit(6);
      if ((recent || []).length >= 5) {
        return c.json({ error: 'Too many comments from your network. Please wait.' }, 429);
      }

      const { data: inserted, error } = await admin
        .from('blog_comments')
        .insert({
          post_id: post.id,
          parent_id: parentId,
          author_name: author_name.trim(),
          author_email: author_email.trim().toLowerCase(),
          content: plain,
          status: 'visible',
          ip_hash: ipHash,
        })
        .select('id, post_id, parent_id, author_name, content, is_pinned, like_count, created_at')
        .single();
      if (error) return safeError(c, 500, error.message);

      await admin
        .from('blog_posts')
        .update({ comment_count: (post.comment_count || 0) + 1 })
        .eq('id', post.id);

      return c.json({ comment: mapPublicComment(inserted) }, 201);
    } catch (err) {
      return safeError(c, 500, err.message);
    }
  },
);

// =====================================================================
// Like toggle (POST = like, DELETE = unlike)
// =====================================================================

async function handleLikeToggle(c, isDelete) {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'Database not configured' }, 503);

  const body = await c.req.json().catch(() => ({}));
  const { target_type, target_id, visitor_key } = body;

  if (!isValidVisitorKey(visitor_key)) {
    return c.json({ error: 'Invalid visitor key.' }, 400);
  }
  if (target_type !== 'post' && target_type !== 'comment') {
    return c.json({ error: 'Invalid target_type.' }, 400);
  }
  if (!target_id) return c.json({ error: 'target_id required.' }, 400);

  try {
    if (target_type === 'post') {
      const { data: postRow } = await admin
        .from('blog_posts')
        .select('id, like_count')
        .eq('id', target_id)
        .eq('published', true)
        .maybeSingle();
      if (!postRow) return c.json({ error: 'Post not found.' }, 404);
      const postId = postRow.id;

      if (isDelete) {
        const { data: removed } = await admin
          .from('blog_likes')
          .delete()
          .eq('target_type', 'post')
          .eq('target_id', target_id)
          .eq('visitor_key', visitor_key)
          .select('id');
        if ((removed || []).length) {
          await admin
            .from('blog_posts')
            .update({ like_count: Math.max(0, (postRow.like_count || 0) - 1) })
            .eq('id', postId);
        }
        const { data: fresh } = await admin.from('blog_posts').select('like_count').eq('id', postId).single();
        return c.json({ liked: false, like_count: fresh?.like_count || 0 });
      }

      const { error: insErr } = await admin.from('blog_likes').insert({
        post_id: postId,
        target_type: 'post',
        target_id,
        visitor_key,
      });
      if (insErr?.code === '23505') {
        const { data: fresh } = await admin.from('blog_posts').select('like_count').eq('id', postId).single();
        return c.json({ liked: true, like_count: fresh?.like_count || 0 });
      }
      if (insErr) return safeError(c, 500, insErr.message);

      await admin
        .from('blog_posts')
        .update({ like_count: (postRow.like_count || 0) + 1 })
        .eq('id', postId);
      const { data: fresh } = await admin.from('blog_posts').select('like_count').eq('id', postId).single();
      return c.json({ liked: true, like_count: fresh?.like_count || 0 });
    }

    const { data: commentRow } = await admin
      .from('blog_comments')
      .select('id, post_id, like_count, status')
      .eq('id', target_id)
      .eq('status', 'visible')
      .maybeSingle();
    if (!commentRow) return c.json({ error: 'Comment not found.' }, 404);
    const postId = commentRow.post_id;

    if (isDelete) {
      const { data: removed } = await admin
        .from('blog_likes')
        .delete()
        .eq('target_type', 'comment')
        .eq('target_id', target_id)
        .eq('visitor_key', visitor_key)
        .select('id');
      if ((removed || []).length) {
        await admin
          .from('blog_comments')
          .update({ like_count: Math.max(0, (commentRow.like_count || 0) - 1) })
          .eq('id', target_id);
      }
      const { data: fresh } = await admin.from('blog_comments').select('like_count').eq('id', target_id).single();
      return c.json({ liked: false, like_count: fresh?.like_count || 0 });
    }

    const { error: insErr } = await admin.from('blog_likes').insert({
      post_id: postId,
      target_type: 'comment',
      target_id,
      visitor_key,
    });
    if (insErr?.code === '23505') {
      const { data: fresh } = await admin.from('blog_comments').select('like_count').eq('id', target_id).single();
      return c.json({ liked: true, like_count: fresh?.like_count || 0 });
    }
    if (insErr) return safeError(c, 500, insErr.message);

    await admin
      .from('blog_comments')
      .update({ like_count: (commentRow.like_count || 0) + 1 })
      .eq('id', target_id);
    const { data: fresh } = await admin.from('blog_comments').select('like_count').eq('id', target_id).single();
    return c.json({ liked: true, like_count: fresh?.like_count || 0 });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
}

const likeLimiterMw = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  scope: 'like',
  message: { error: 'Too many like actions. Please slow down.' },
});

publicEngagement.post('/like', likeLimiterMw, (c) => handleLikeToggle(c, false));
publicEngagement.delete('/like', likeLimiterMw, (c) => handleLikeToggle(c, true));

// =====================================================================
// Admin moderation routes (mounted under /api/blog/admin)
// =====================================================================

const adminEngagement = new Hono();
adminEngagement.use('*', requireBlogAdmin());

adminEngagement.get('/posts/:postId/comments', async (c) => {
  const admin = getAdmin(c);
  const { data, error } = await admin
    .from('blog_comments')
    .select('*')
    .eq('post_id', c.req.param('postId'))
    .order('created_at', { ascending: false });
  if (error) return safeError(c, 500, error.message);
  return c.json({ comments: data || [] });
});

adminEngagement.patch('/comments/:id', async (c) => {
  const admin = getAdmin(c);
  const body = await c.req.json().catch(() => ({}));
  const { status, is_pinned } = body;
  const patch = {};

  if (status !== undefined) {
    if (!['visible', 'hidden', 'deleted'].includes(status)) {
      return c.json({ error: 'Invalid status.' }, 400);
    }
    patch.status = status;
  }
  if (is_pinned !== undefined) patch.is_pinned = !!is_pinned;
  if (!Object.keys(patch).length) return c.json({ error: 'Nothing to update.' }, 400);

  const { data: existing } = await admin
    .from('blog_comments')
    .select('id, post_id, status')
    .eq('id', c.req.param('id'))
    .maybeSingle();
  if (!existing) return c.json({ error: 'Comment not found.' }, 404);

  const { data, error } = await admin
    .from('blog_comments')
    .update(patch)
    .eq('id', c.req.param('id'))
    .select('*')
    .single();
  if (error) return safeError(c, 500, error.message);

  if (status && status !== 'visible' && existing.status === 'visible') {
    const { data: postRow } = await admin.from('blog_posts').select('comment_count').eq('id', existing.post_id).single();
    if (postRow) {
      await admin
        .from('blog_posts')
        .update({ comment_count: Math.max(0, (postRow.comment_count || 0) - 1) })
        .eq('id', existing.post_id);
    }
  } else if (status === 'visible' && existing.status !== 'visible') {
    const { data: postRow } = await admin.from('blog_posts').select('comment_count').eq('id', existing.post_id).single();
    if (postRow) {
      await admin
        .from('blog_posts')
        .update({ comment_count: (postRow.comment_count || 0) + 1 })
        .eq('id', existing.post_id);
    }
  }

  return c.json({ comment: data });
});

export { publicEngagement, adminEngagement };
