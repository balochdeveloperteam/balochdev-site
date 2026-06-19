import { apiUrl } from './api';
import { supabase } from './supabase';

/** Mirrors client/scripts/lib/blogPrerenderData.mjs — keep list/full selects aligned with prerender. */
const BLOG_POST_SELECT_WITH_SUMMARY =
  'id, slug, title, body_html, content_html, excerpt, summary, published, post_type, cover_image_url, cover_image_alt, meta_title, meta_description, og_image_url, reading_time_minutes, author_name, author_member_id, published_at, updated_at, like_count, comment_count, tags, category, related_slugs, view_count';

const BLOG_POST_SELECT_LEGACY = BLOG_POST_SELECT_WITH_SUMMARY.replace(', summary', '');

const BLOG_LIST_SELECT =
  'id, slug, title, excerpt, summary, cover_image_url, cover_image_alt, category, tags, reading_time_minutes, published_at, updated_at, author_name, author_member_id, post_type, like_count, comment_count, view_count, meta_description';

function isMissingSummaryColumnError(message) {
  return /summary.*does not exist|column.*summary/i.test(String(message || ''));
}

/** Shared with NBlogPost — normalizes body_html from content_html or body_html. */
export function normalizePost(p) {
  if (!p || typeof p.title !== 'string' || !p.title.trim()) return null;
  const bodyHtml =
    typeof p.body_html === 'string'
      ? p.body_html
      : typeof p.content_html === 'string'
        ? p.content_html
        : '';
  return { ...p, title: p.title.trim(), body_html: bodyHtml };
}

function stripHtmlToPlain(html, maxLen = 200) {
  const plain = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLen ? `${plain.slice(0, maxLen - 1)}…` : plain;
}

function mapListPost(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title || '',
    excerpt: row.excerpt || '',
    summary: row.summary || '',
    body_html: '',
    content_html: '',
    post_type: row.post_type || 'article',
    cover_image_url: row.cover_image_url || null,
    cover_image_alt: row.cover_image_alt || '',
    meta_title: '',
    meta_description: row.meta_description || '',
    focus_keyword: '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    category: row.category || '',
    og_image_url: row.cover_image_url || null,
    reading_time_minutes: row.reading_time_minutes || 1,
    author_name: row.author_name || 'BalochDev',
    author_member_id: row.author_member_id || null,
    author_avatar_url: null,
    published_at: row.published_at,
    updated_at: row.updated_at,
    like_count: row.like_count || 0,
    comment_count: row.comment_count || 0,
    related_slugs: [],
    view_count: row.view_count || 0,
    excerpt_plain: stripHtmlToPlain(row.excerpt || row.meta_description || '', 200),
  };
}

function mapFullPost(row, extras = {}) {
  const bodyHtml = row.content_html || row.body_html || '';
  return {
    id: row.id,
    slug: row.slug,
    title: row.title || '',
    excerpt: row.excerpt || '',
    summary: row.summary || '',
    body_html: bodyHtml,
    content_html: bodyHtml,
    post_type: row.post_type || 'article',
    cover_image_url: row.cover_image_url || null,
    cover_image_alt: row.cover_image_alt || '',
    meta_title: row.meta_title || '',
    meta_description: row.meta_description || '',
    focus_keyword: row.focus_keyword || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    category: row.category || '',
    og_image_url: row.og_image_url || row.cover_image_url || null,
    reading_time_minutes: row.reading_time_minutes || 1,
    author_name: row.author_name || 'BalochDev',
    author_member_id: row.author_member_id || null,
    author_avatar_url: null,
    published_at: row.published_at,
    updated_at: row.updated_at,
    like_count: row.like_count || 0,
    comment_count: row.comment_count || 0,
    related_slugs: Array.isArray(row.related_slugs) ? row.related_slugs : [],
    view_count: row.view_count || 0,
    prev_slug: null,
    next_slug: null,
    related_posts: [],
    ...extras,
  };
}

async function fetchPublishedPostsFromApi() {
  const r = await fetch(apiUrl('/api/blog'));
  const data = await r.json().catch(() => ({}));
  return data.posts || [];
}

async function fetchPublishedPostBySlugFromApi(slug) {
  const response = await fetch(apiUrl(`/api/blog/${slug}`));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`API blog post fetch failed (${response.status})`);
  const data = await response.json().catch(() => null);
  return normalizePost(data?.post);
}

async function fetchPrevNextSlugs(publishedAt) {
  if (!publishedAt) return { prev_slug: null, next_slug: null };

  const [{ data: prevRow }, { data: nextRow }] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true)
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true)
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return { prev_slug: prevRow?.slug || null, next_slug: nextRow?.slug || null };
}

async function fetchRelatedPosts(postRow) {
  const relatedSlugs = Array.isArray(postRow.related_slugs)
    ? postRow.related_slugs.filter(Boolean)
    : [];

  if (relatedSlugs.length) {
    const { data: relatedRows } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, reading_time_minutes, published_at')
      .eq('published', true)
      .in('slug', relatedSlugs.slice(0, 8));

    const order = new Map(relatedSlugs.map((s, i) => [s, i]));
    return (relatedRows || [])
      .sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99))
      .map((r) => mapListPost(r));
  }

  if (!postRow.category) return [];

  const { data: catRows } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, reading_time_minutes, published_at, meta_description, post_type, author_name, like_count, comment_count, tags, category, cover_image_alt, summary, updated_at, author_member_id, view_count')
    .eq('published', true)
    .eq('category', postRow.category)
    .neq('id', postRow.id)
    .order('published_at', { ascending: false })
    .limit(4);

  return (catRows || []).map((r) => mapListPost(r));
}

async function queryPublishedPostBySlug(slug) {
  let selectFields = BLOG_POST_SELECT_WITH_SUMMARY;
  let { data, error } = await supabase
    .from('blog_posts')
    .select(selectFields)
    .eq('published', true)
    .eq('slug', slug)
    .maybeSingle();

  if (error && isMissingSummaryColumnError(error.message)) {
    selectFields = BLOG_POST_SELECT_LEGACY;
    ({ data, error } = await supabase
      .from('blog_posts')
      .select(selectFields)
      .eq('published', true)
      .eq('slug', slug)
      .maybeSingle());
  }

  if (error) throw error;
  return data;
}

/**
 * Published blog feed — Supabase direct read; falls back to Render API when client unavailable.
 * @returns {Promise<object[]>}
 */
export async function fetchPublishedPosts() {
  if (!supabase) return fetchPublishedPostsFromApi();

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(BLOG_LIST_SELECT)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data || []).map(mapListPost);
  } catch {
    return fetchPublishedPostsFromApi();
  }
}

/**
 * Single published post by slug — Supabase direct read; falls back to Render API when client unavailable.
 * @returns {Promise<object|null>}
 */
export async function fetchPublishedPostBySlug(slug) {
  if (!slug) return null;
  if (!supabase) return fetchPublishedPostBySlugFromApi(slug);

  try {
    const data = await queryPublishedPostBySlug(slug);
    if (!data) return null;

    const [neighbors, relatedPosts] = await Promise.all([
      fetchPrevNextSlugs(data.published_at),
      fetchRelatedPosts(data),
    ]);

    return normalizePost(mapFullPost(data, { ...neighbors, related_posts: relatedPosts }));
  } catch {
    return fetchPublishedPostBySlugFromApi(slug);
  }
}
