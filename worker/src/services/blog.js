import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'h2', 'h3', 'p', 'br', 'strong', 'em', 'b', 'i', 'span',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'hr', 'figure', 'figcaption', 'img', 'div',
];

const ALLOWED_ATTR = {
  a: ['href', 'title', 'rel', 'target'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  figure: ['class'],
  div: ['class', 'data-raw-html'],
  pre: ['class'],
  code: ['class'],
  p: ['style'],
  h2: ['style'],
  h3: ['style'],
  span: ['style'],
  blockquote: ['style'],
};

const ALLOWED_STYLES = {
  '*': {
    'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
    color: [
      /^#[0-9a-f]{3,8}$/i,
      /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
      /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/i,
    ],
    'font-size': [/^(0\.\d+|[1-9]\d*)(\.\d+)?(px|rem|em|%)$/],
  },
};

export function sanitizeBlogHtml(html) {
  const raw = typeof html === 'string' ? html : '';
  return sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
}

export function computeReadingTimeMinutes(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function slugifyTitle(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function mapPublicPost(row, extras = {}) {
  if (!row) return row;
  const bodyHtml = row.content_html || row.body_html || '';
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
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
    published_at: row.published_at,
    updated_at: row.updated_at,
    like_count: row.like_count || 0,
    comment_count: row.comment_count || 0,
    related_slugs: Array.isArray(row.related_slugs) ? row.related_slugs : [],
    view_count: row.view_count || 0,
    ...extras,
  };
}

export function stripHtmlToPlain(html, maxLen = 320) {
  const plain = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLen ? `${plain.slice(0, maxLen - 1)}…` : plain;
}

export function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))].slice(0, 20);
}

export function normalizeRelatedSlugs(slugs) {
  if (!Array.isArray(slugs)) return [];
  return [...new Set(slugs.map((s) => String(s).trim()).filter(Boolean))].slice(0, 8);
}
