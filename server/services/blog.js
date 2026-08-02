const sanitizeHtml = require('sanitize-html');

const ALLOWED_TAGS = [
  'h2', 'h3', 'p', 'br', 'strong', 'em', 'b', 'i', 'span',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'hr', 'figure', 'figcaption', 'img', 'div', 'section', 'style',
];

const ALLOWED_ATTR = {
  a: ['href', 'title', 'rel', 'target', 'style', 'class', 'id'],
  img: ['src', 'alt', 'width', 'height', 'loading', 'style', 'class'],
  figure: ['class', 'style', 'id'],
  figcaption: ['class', 'style'],
  div: ['class', 'data-raw-html', 'style', 'id'],
  section: ['class', 'style', 'id'],
  pre: ['class', 'style'],
  code: ['class', 'style'],
  p: ['style', 'class', 'id'],
  h2: ['style', 'class', 'id'],
  h3: ['style', 'class', 'id'],
  span: ['style', 'class', 'id'],
  blockquote: ['style', 'class', 'id'],
  ul: ['style', 'class', 'id'],
  ol: ['style', 'class', 'id'],
  li: ['style', 'class'],
  style: ['type'],
};

const LENGTH = /^-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%|vh|vw)?$/;
const COLOR = [
  /^#[0-9a-f]{3,8}$/i,
  /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
  /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/i,
  /^[a-z]{3,20}$/i,
];

const ALLOWED_STYLES = {
  '*': {
    'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
    color: COLOR,
    'background-color': COLOR,
    background: [
      /^transparent$/,
      /^none$/,
      /^#[0-9a-f]{3,8}$/i,
      /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,
      /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/i,
      /^[a-z]{3,20}$/i,
    ],
    'font-size': [LENGTH],
    'font-weight': [/^(normal|bold|[1-9]00)$/],
    'line-height': [/^(normal|-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?)$/],
    'letter-spacing': [LENGTH],
    padding: [/^(-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?\s*){1,4}$/],
    margin: [/^(auto|-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?\s*){1,4}$/],
    'padding-top': [LENGTH],
    'padding-right': [LENGTH],
    'padding-bottom': [LENGTH],
    'padding-left': [LENGTH],
    'margin-top': [LENGTH],
    'margin-right': [LENGTH],
    'margin-bottom': [LENGTH],
    'margin-left': [LENGTH],
    border: [/^(none|(-?(0|[1-9]\d*)(\.\d+)?(px|rem|em)?\s+)?(none|solid|dashed|dotted|double)\s+.+)$/i],
    'border-radius': [/^(-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?\s*){1,4}$/],
    'border-color': COLOR,
    'border-width': [LENGTH],
    'border-style': [/^(none|solid|dashed|dotted|double)$/],
    width: [LENGTH],
    'max-width': [LENGTH],
    'min-width': [LENGTH],
    height: [LENGTH],
    'max-height': [LENGTH],
    'min-height': [LENGTH],
    display: [/^(block|inline|inline-block|flex|grid|none)$/],
    'flex-direction': [/^(row|column|row-reverse|column-reverse)$/],
    'flex-wrap': [/^(nowrap|wrap|wrap-reverse)$/],
    'align-items': [/^(stretch|flex-start|flex-end|center|baseline)$/],
    'justify-content': [/^(flex-start|flex-end|center|space-between|space-around|space-evenly)$/],
    gap: [LENGTH],
    'row-gap': [LENGTH],
    'column-gap': [LENGTH],
    'grid-template-columns': [/^(none|repeat\([^)]+\)|[^;{}]{1,80})$/],
    opacity: [/^(0|1|0?\.\d+)$/],
    'box-sizing': [/^(border-box|content-box)$/],
    overflow: [/^(visible|hidden|auto|scroll)$/],
    'overflow-x': [/^(visible|hidden|auto|scroll)$/],
    'overflow-y': [/^(visible|hidden|auto|scroll)$/],
  },
};

function sanitizeEmbeddedCss(css) {
  let s = String(css || '');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  if (/@import|@charset|expression\s*\(|javascript:|behavior\s*:|-moz-binding|@font-face/i.test(s)) {
    return '';
  }
  s = s.replace(/url\s*\([^)]*\)/gi, 'none');
  s = s.replace(/position\s*:\s*(fixed|sticky)/gi, 'position: relative');
  return s.slice(0, 20000).trim();
}

function sanitizeBlogHtml(html) {
  const raw = typeof html === 'string' ? html : '';
  let cleaned = sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowVulnerableTags: true,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });

  cleaned = cleaned.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs, css) => {
    const safe = sanitizeEmbeddedCss(css);
    if (!safe) return '';
    const typeOk = /type\s*=\s*["']?text\/css["']?/i.test(attrs) || !/type\s*=/i.test(attrs);
    if (!typeOk) return '';
    return `<style type="text/css">${safe}</style>`;
  });

  return cleaned;
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

function mapPublicPost(row, extras = {}) {
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

function stripHtmlToPlain(html, maxLen = 320) {
  const plain = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLen ? `${plain.slice(0, maxLen - 1)}…` : plain;
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
  stripHtmlToPlain,
  normalizeTags,
  normalizeRelatedSlugs,
};
