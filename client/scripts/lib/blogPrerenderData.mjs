/**
 * Bulk-load published blog_posts for Playwright prerender (Node only).
 * Reason: sanitize-html is optimized for stripping HTML strings on the server without a JSDOM window.
 */

import sanitizeHtml from 'sanitize-html';

import { tryCreateSupabaseBuildClient } from './supabaseBuildClient.mjs';

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

/**
 * @returns {Promise<{ bySlug: Map<string, { title: string, body_html: string, excerpt?: string }>, querySucceeded: boolean }>}
 */
export async function loadSanitizedBlogPostsMap() {
  const bySlug = new Map();

  const client = tryCreateSupabaseBuildClient(() => {});
  if (!client) {
    console.warn('[prerender] Blog load skipped — Supabase build client unavailable (blogEnumerated-style).');
    return { bySlug, querySucceeded: false };
  }

  try {
    const { data, error } = await client
      .from('blog_posts')
      .select('slug, title, body_html, excerpt, published')
      .eq('published', true);

    if (error) {
      console.warn(`[prerender] blog_posts query failed (${error.message}) — skipping blog snapshots.`);
      return { bySlug, querySucceeded: false };
    }

    const rows = Array.isArray(data) ? data : [];
    for (const row of rows) {
      const slug = typeof row?.slug === 'string' ? row.slug.trim() : '';
      if (!slug) continue;
      const titleRaw = typeof row?.title === 'string' ? row.title : '';
      const title = sanitizeBlogPlainLine(titleRaw).trim();
      if (!title) continue;

      const body_html = sanitizeBlogBodyHtml(row.body_html);
      let excerptOut;
      if (typeof row.excerpt === 'string' && row.excerpt.trim()) {
        const plain = sanitizeBlogPlainLine(row.excerpt).trim();
        if (plain) excerptOut = plain;
      }

      /** @type {{ title: string, body_html: string, excerpt?: string }} */
      const post = excerptOut ? { title, body_html, excerpt: excerptOut } : { title, body_html };
      bySlug.set(slug, post);
    }

    return { bySlug, querySucceeded: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[prerender] blog_posts threw (${msg}) — skipping blog snapshots.`);
    return { bySlug, querySucceeded: false };
  }
}
