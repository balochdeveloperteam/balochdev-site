const sanitizeHtml = require('sanitize-html');

const ALLOWED_TAGS = [
  'h2', 'h3', 'p', 'br', 'strong', 'em', 'b', 'i',
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
};

function sanitizeBlogHtml(html) {
  const raw = typeof html === 'string' ? html : '';
  return sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
}

function computeReadingTimeMinutes(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function slugifyTitle(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function mapPublicPost(row) {
  if (!row) return row;
  return {
    ...row,
    body_html: row.content_html || row.body_html || '',
  };
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))].slice(0, 20);
}

function normalizeRelatedSlugs(slugs) {
  if (!Array.isArray(slugs)) return [];
  return [...new Set(slugs.map((s) => String(s).trim()).filter(Boolean))].slice(0, 8);
}

module.exports = {
  sanitizeBlogHtml,
  computeReadingTimeMinutes,
  slugifyTitle,
  mapPublicPost,
  normalizeTags,
  normalizeRelatedSlugs,
};
