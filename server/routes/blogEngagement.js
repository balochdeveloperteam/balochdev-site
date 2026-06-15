const rateLimit = require('express-rate-limit');
const {
  hashClientIp,
  sanitizeCommentPlainText,
  mapPublicComment,
  isValidVisitorKey,
  isValidEmail,
  isValidAuthorName,
} = require('../services/blogEngagement');
const { mapPublicPost } = require('../services/blog');

const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many comments. Please wait a minute and try again.' },
});

const likeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many like actions. Please slow down.' },
});

async function getPublishedPostBySlug(admin, slug) {
  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function enrichPostWithAvatar(admin, postRow) {
  if (!postRow?.author_member_id) return { author_avatar_url: null };
  const { data } = await admin
    .from('team_members')
    .select('avatar_url')
    .eq('id', postRow.author_member_id)
    .maybeSingle();
  return { author_avatar_url: data?.avatar_url || null };
}

async function getPrevNextSlugs(admin, postRow) {
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

function registerBlogEngagementRoutes(app, { admin, safeError, requireBlogAdmin }) {
  app.get('/api/blog/:slug/comments', async (req, res) => {
    if (!admin) return res.json({ comments: [] });
    try {
      const post = await getPublishedPostBySlug(admin, req.params.slug);
      if (!post) return res.status(404).json({ error: 'Post not found' });

      const comments = await fetchVisibleComments(admin, post.id);
      const visitorKey = String(req.query.visitor_key || '').trim();
      const { postLiked, comments: withLikes } = await attachVisitorLikeFlags(
        admin,
        post.id,
        visitorKey,
        comments,
      );

      res.json({ comments: withLikes, post_liked: postLiked, like_count: post.like_count || 0 });
    } catch (err) {
      safeError(res, 500, err.message);
    }
  });

  app.post('/api/blog/:slug/comments', commentLimiter, async (req, res) => {
    if (!admin) return res.status(503).json({ error: 'Database not configured' });

    const { author_name, author_email, content, parent_id, website } = req.body || {};

    if (website) return res.json({ ok: true, comment: null });

    if (!isValidAuthorName(author_name)) {
      return res.status(400).json({ error: 'Please enter your name (2–80 characters).' });
    }
    if (!isValidEmail(author_email)) {
      return res.status(400).json({ error: 'A valid email is required (not shown publicly).' });
    }

    const plain = sanitizeCommentPlainText(content);
    if (plain.length < 2) {
      return res.status(400).json({ error: 'Comment is too short.' });
    }

    try {
      const post = await getPublishedPostBySlug(admin, req.params.slug);
      if (!post) return res.status(404).json({ error: 'Post not found' });

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
          return res.status(400).json({ error: 'Invalid reply target.' });
        }
      }

      const ipHash = hashClientIp(req);
      const { data: recent } = await admin
        .from('blog_comments')
        .select('id')
        .eq('ip_hash', ipHash)
        .gte('created_at', new Date(Date.now() - 60_000).toISOString())
        .limit(6);
      if ((recent || []).length >= 5) {
        return res.status(429).json({ error: 'Too many comments from your network. Please wait.' });
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

      if (error) return safeError(res, 500, error.message);

      await admin
        .from('blog_posts')
        .update({ comment_count: (post.comment_count || 0) + 1 })
        .eq('id', post.id);

      res.status(201).json({ comment: mapPublicComment(inserted) });
    } catch (err) {
      safeError(res, 500, err.message);
    }
  });

  async function handleLikeToggle(req, res, isDelete) {
    if (!admin) return res.status(503).json({ error: 'Database not configured' });

    const { target_type, target_id, visitor_key } = req.body || {};
    if (!isValidVisitorKey(visitor_key)) {
      return res.status(400).json({ error: 'Invalid visitor key.' });
    }
    if (target_type !== 'post' && target_type !== 'comment') {
      return res.status(400).json({ error: 'Invalid target_type.' });
    }
    if (!target_id) return res.status(400).json({ error: 'target_id required.' });

    try {
      let postId;
      if (target_type === 'post') {
        const { data: postRow } = await admin
          .from('blog_posts')
          .select('id, like_count')
          .eq('id', target_id)
          .eq('published', true)
          .maybeSingle();
        if (!postRow) return res.status(404).json({ error: 'Post not found.' });
        postId = postRow.id;

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
          return res.json({ liked: false, like_count: fresh?.like_count || 0 });
        }

        const { error: insErr } = await admin.from('blog_likes').insert({
          post_id: postId,
          target_type: 'post',
          target_id,
          visitor_key,
        });
        if (insErr?.code === '23505') {
          const { data: fresh } = await admin.from('blog_posts').select('like_count').eq('id', postId).single();
          return res.json({ liked: true, like_count: fresh?.like_count || 0 });
        }
        if (insErr) return safeError(res, 500, insErr.message);

        await admin
          .from('blog_posts')
          .update({ like_count: (postRow.like_count || 0) + 1 })
          .eq('id', postId);
        const { data: fresh } = await admin.from('blog_posts').select('like_count').eq('id', postId).single();
        return res.json({ liked: true, like_count: fresh?.like_count || 0 });
      }

      const { data: commentRow } = await admin
        .from('blog_comments')
        .select('id, post_id, like_count, status')
        .eq('id', target_id)
        .eq('status', 'visible')
        .maybeSingle();
      if (!commentRow) return res.status(404).json({ error: 'Comment not found.' });
      postId = commentRow.post_id;

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
        return res.json({ liked: false, like_count: fresh?.like_count || 0 });
      }

      const { error: insErr } = await admin.from('blog_likes').insert({
        post_id: postId,
        target_type: 'comment',
        target_id,
        visitor_key,
      });
      if (insErr?.code === '23505') {
        const { data: fresh } = await admin.from('blog_comments').select('like_count').eq('id', target_id).single();
        return res.json({ liked: true, like_count: fresh?.like_count || 0 });
      }
      if (insErr) return safeError(res, 500, insErr.message);

      await admin
        .from('blog_comments')
        .update({ like_count: (commentRow.like_count || 0) + 1 })
        .eq('id', target_id);
      const { data: fresh } = await admin.from('blog_comments').select('like_count').eq('id', target_id).single();
      return res.json({ liked: true, like_count: fresh?.like_count || 0 });
    } catch (err) {
      safeError(res, 500, err.message);
    }
  }

  app.post('/api/blog/like', likeLimiter, (req, res) => handleLikeToggle(req, res, false));
  app.delete('/api/blog/like', likeLimiter, (req, res) => handleLikeToggle(req, res, true));

  app.get('/api/blog/admin/posts/:postId/comments', requireBlogAdmin, async (req, res) => {
    const { data, error } = await admin
      .from('blog_comments')
      .select('*')
      .eq('post_id', req.params.postId)
      .order('created_at', { ascending: false });
    if (error) return safeError(res, 500, error.message);
    res.json({ comments: data || [] });
  });

  app.patch('/api/blog/admin/comments/:id', requireBlogAdmin, async (req, res) => {
    const { status, is_pinned } = req.body || {};
    /** @type {Record<string, unknown>} */
    const patch = {};

    if (status !== undefined) {
      if (!['visible', 'hidden', 'deleted'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
      }
      patch.status = status;
    }
    if (is_pinned !== undefined) patch.is_pinned = !!is_pinned;
    if (!Object.keys(patch).length) return res.status(400).json({ error: 'Nothing to update.' });

    const { data: existing } = await admin
      .from('blog_comments')
      .select('id, post_id, status')
      .eq('id', req.params.id)
      .maybeSingle();
    if (!existing) return res.status(404).json({ error: 'Comment not found.' });

    const { data, error } = await admin
      .from('blog_comments')
      .update(patch)
      .eq('id', req.params.id)
      .select('*')
      .single();
    if (error) return safeError(res, 500, error.message);

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

    res.json({ comment: data });
  });
}

module.exports = {
  registerBlogEngagementRoutes,
  getPublishedPostBySlug,
  enrichPostWithAvatar,
  getPrevNextSlugs,
  fetchVisibleComments,
};
