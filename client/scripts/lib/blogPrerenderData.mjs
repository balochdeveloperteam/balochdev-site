/**
 * Bulk-load published blog_posts (+ visible comments) for Playwright prerender (Node only).
 */

import sanitizeHtml from 'sanitize-html';

import { tryCreateSupabaseBuildClient } from './supabaseBuildClient.mjs';

const BLOG_POST_META_WITH_SUMMARY =
  'id, slug, title, excerpt, summary, published, post_type, cover_image_url, cover_image_alt, meta_title, meta_description, og_image_url, reading_time_minutes, author_name, author_member_id, published_at, updated_at, like_count, comment_count, tags, category, related_slugs';

const BLOG_POST_META_LEGACY = BLOG_POST_META_WITH_SUMMARY.replace(', summary', '');

const BLOG_POST_BODY_FIELDS = 'id, slug, body_html';

function isMissingSummaryColumnError(message) {
  return /summary.*does not exist|column.*summary/i.test(String(message || ''));
}

async function fetchPublishedBlogPosts(client, selectFields) {
  return client.from('blog_posts').select(selectFields).eq('published', true);
}

async function fetchBlogBodiesByIds(client, ids) {
  /** @type {Map<string, { body_html?: string, content_html?: string }>} */
  const byId = new Map();
  if (!ids.length) return byId;

  for (const id of ids) {
    for (let attempt = 1; attempt <= SUPABASE_FETCH_MAX_ATTEMPTS; attempt += 1) {
      try {
        const { data, error } = await client
          .from('blog_posts')
          .select(BLOG_POST_BODY_FIELDS)
          .eq('id', id)
          .maybeSingle();
        if (error) {
          const msg = error.message || String(error);
          if (attempt < SUPABASE_FETCH_MAX_ATTEMPTS && isRetryableSupabaseError(msg)) {
            await sleep(attempt * 500);
            continue;
          }
          console.warn(`[prerender] blog body fetch failed for ${id} (${msg})`);
          break;
        }
        if (data) byId.set(id, data);
        break;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (attempt < SUPABASE_FETCH_MAX_ATTEMPTS && isRetryableSupabaseError(msg)) {
          await sleep(attempt * 500);
          continue;
        }
        console.warn(`[prerender] blog body fetch threw for ${id} (${msg})`);
        break;
      }
    }
  }

  return byId;
}

const SUPABASE_FETCH_MAX_ATTEMPTS = 3;
const RETRYABLE_SUPABASE_ERROR = /terminated|ECONNRESET|ETIMEDOUT|fetch failed|network|socket hang up|aborted/i;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableSupabaseError(message) {
  return RETRYABLE_SUPABASE_ERROR.test(String(message || ''));
}

/** Rich HTML matching typical CMS posts — no iframe/event handlers/svg flash. */
const BLOG_HTML_SANITIZE = {
  allowedTags: [
    ...(sanitizeHtml.defaults?.allowedTags || []),
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'figure',
    'figcaption',
    'hr',
    'del',
    'ins',
    'sup',
    'sub',
    'mark',
    'span',
    'div',
    'section',
    'article',
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': [...(sanitizeHtml.defaults.allowedAttributes['*'] || []), 'class', 'id'].filter(Boolean),
    a: ['href', 'hreflang', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading'],
    figure: ['class'],
    div: ['class', 'data-raw-html'],
    p: ['style'],
    h2: ['style'],
    h3: ['style'],
    span: ['style'],
    blockquote: ['style'],
  },
  allowedStyles: {
    '*': {
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
      color: [
        /^#[0-9a-f]{3,8}$/i,
        /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/i,
      ],
      'font-size': [/^(0\.\d+|[1-9]\d*)(\.\d+)?(px|rem|em|%)$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
};

export function sanitizeBlogBodyHtml(html) {
  return sanitizeHtml(String(html ?? ''), BLOG_HTML_SANITIZE);
}

export function sanitizeBlogPlainLine(s) {
  return sanitizeHtml(String(s ?? ''), { allowedTags: [], allowedAttributes: {} });
}

function mapPrerenderPost(row) {
  const body_html = sanitizeBlogBodyHtml(row.content_html || row.body_html);
  const title = sanitizeBlogPlainLine(row.title).trim();
  let excerptOut;
  if (typeof row.excerpt === 'string' && row.excerpt.trim()) {
    const plain = sanitizeBlogPlainLine(row.excerpt).trim();
    if (plain) excerptOut = plain;
  }

  return {
    id: row.id,
    slug: row.slug,
    title,
    excerpt: excerptOut || '',
    summary: sanitizeBlogPlainLine(row.summary || ''),
    body_html,
    content_html: body_html,
    post_type: row.post_type || 'article',
    cover_image_url: row.cover_image_url || null,
    cover_image_alt: sanitizeBlogPlainLine(row.cover_image_alt || ''),
    meta_title: sanitizeBlogPlainLine(row.meta_title || ''),
    meta_description: sanitizeBlogPlainLine(row.meta_description || ''),
    og_image_url: row.og_image_url || row.cover_image_url || null,
    reading_time_minutes: row.reading_time_minutes || 1,
    author_name: sanitizeBlogPlainLine(row.author_name || 'BalochDev'),
    author_member_id: row.author_member_id || null,
    published_at: row.published_at,
    updated_at: row.updated_at,
    like_count: row.like_count || 0,
    comment_count: row.comment_count || 0,
    tags: Array.isArray(row.tags) ? row.tags : [],
    category: sanitizeBlogPlainLine(row.category || ''),
    related_slugs: Array.isArray(row.related_slugs) ? row.related_slugs : [],
  };
}

function mapPrerenderComment(row) {
  return {
    id: row.id,
    post_id: row.post_id,
    parent_id: row.parent_id,
    author_name: sanitizeBlogPlainLine(row.author_name),
    content: sanitizeBlogPlainLine(row.content),
    is_pinned: !!row.is_pinned,
    like_count: row.like_count || 0,
    created_at: row.created_at,
  };
}

async function loadCommentsByPostIds(client, postIds) {
  /** @type {Map<string, object[]>} */
  const byPost = new Map();
  if (!postIds.length) return byPost;

  try {
    const { data, error } = await client
      .from('blog_comments')
      .select('id, post_id, parent_id, author_name, content, is_pinned, like_count, created_at')
      .in('post_id', postIds)
      .eq('status', 'visible')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn(`[prerender] blog_comments query failed (${error.message}) — comments omitted from snapshots.`);
      return byPost;
    }

    for (const row of data || []) {
      const list = byPost.get(row.post_id) || [];
      list.push(mapPrerenderComment(row));
      byPost.set(row.post_id, list);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[prerender] blog_comments threw (${msg}) — comments omitted.`);
  }

  return byPost;
}

/**
 * @returns {Promise<{ bySlug: Map<string, { post: object, comments: object[] }>, querySucceeded: boolean }>}
 */
export async function loadSanitizedBlogPostsMap() {
  /** @type {Map<string, { post: object, comments: object[] }>} */
  const bySlug = new Map();

  const client = tryCreateSupabaseBuildClient(() => {});
  if (!client) {
    console.warn('[prerender] Blog load skipped — Supabase build client unavailable (blogEnumerated-style).');
    return { bySlug, querySucceeded: false };
  }

  for (let attempt = 1; attempt <= SUPABASE_FETCH_MAX_ATTEMPTS; attempt += 1) {
    try {
      let selectFields = BLOG_POST_META_WITH_SUMMARY;
      let { data, error } = await fetchPublishedBlogPosts(client, selectFields);

      if (error && isMissingSummaryColumnError(error.message)) {
        console.warn(
          '[prerender] blog_posts.summary column missing — retrying without summary (apply 007_blog_summary.sql).',
        );
        selectFields = BLOG_POST_META_LEGACY;
        ({ data, error } = await fetchPublishedBlogPosts(client, selectFields));
      }

      if (error) {
        const msg = error.message || String(error);
        if (attempt < SUPABASE_FETCH_MAX_ATTEMPTS && isRetryableSupabaseError(msg)) {
          console.warn(
            `[prerender] blog_posts query failed (${msg}) — retrying (${attempt}/${SUPABASE_FETCH_MAX_ATTEMPTS - 1})…`,
          );
          await sleep(attempt * 750);
          continue;
        }
        console.warn(`[prerender] blog_posts query failed (${msg}) — skipping blog snapshots.`);
        return { bySlug, querySucceeded: false };
      }

      const metaRows = Array.isArray(data) ? data : [];
      const postIds = metaRows.map((r) => r.id).filter(Boolean);
      const [bodiesById, commentsByPost] = await Promise.all([
        fetchBlogBodiesByIds(client, postIds),
        loadCommentsByPostIds(client, postIds),
      ]);

      for (const row of metaRows) {
        const slug = typeof row?.slug === 'string' ? row.slug.trim() : '';
        if (!slug) continue;
        const body = bodiesById.get(row.id) || {};
        const post = mapPrerenderPost({ ...row, ...body });
        if (!post.title) continue;
        const comments = commentsByPost.get(row.id) || [];
        bySlug.set(slug, { post, comments });
      }

      return { bySlug, querySucceeded: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt < SUPABASE_FETCH_MAX_ATTEMPTS && isRetryableSupabaseError(msg)) {
        console.warn(
          `[prerender] blog_posts threw (${msg}) — retrying (${attempt}/${SUPABASE_FETCH_MAX_ATTEMPTS - 1})…`,
        );
        await sleep(attempt * 750);
        continue;
      }
      console.warn(`[prerender] blog_posts threw (${msg}) — skipping blog snapshots.`);
      return { bySlug, querySucceeded: false };
    }
  }

  return { bySlug, querySucceeded: false };
}
