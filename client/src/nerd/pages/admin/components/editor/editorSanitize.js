import DOMPurify from 'dompurify';

/**
 * Browser-safe sanitizer for live HTML-embed preview in the blog editor.
 * Mirrors the server allowlist in worker/server blog services (no Node/postcss).
 */

const ALLOWED_TAGS = [
  'h2',
  'h3',
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'span',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'a',
  'hr',
  'figure',
  'figcaption',
  'img',
  'div',
];

const ALLOWED_ATTR = [
  'href',
  'title',
  'rel',
  'target',
  'src',
  'alt',
  'width',
  'height',
  'loading',
  'class',
  'style',
  'data-raw-html',
];

const STYLE_RULES = {
  'text-align': /^(left|right|center|justify)$/,
  color: /^(#[0-9a-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\))$/i,
  'font-size': /^(0\.\d+|[1-9]\d*)(\.\d+)?(px|rem|em|%)$/,
};

const STYLE_ALLOWED_TAGS = new Set(['p', 'h2', 'h3', 'span', 'blockquote']);

function sanitizeInlineStyle(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const kept = [];
  for (const part of raw.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const value = part.slice(idx + 1).trim();
    const rule = STYLE_RULES[prop];
    if (rule && rule.test(value)) kept.push(`${prop}: ${value}`);
  }
  return kept.join('; ');
}

function isSafeUri(value) {
  if (!value) return false;
  const v = String(value).trim().toLowerCase();
  if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('mailto:')) return true;
  if (v.startsWith('/') || v.startsWith('#') || v.startsWith('./') || v.startsWith('../')) return true;
  return false;
}

let hooksInstalled = false;

function ensureHooks() {
  if (hooksInstalled || typeof window === 'undefined') return;
  hooksInstalled = true;

  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    const name = data.attrName;
    const tag = (node.nodeName || '').toLowerCase();

    if (name === 'style') {
      if (!STYLE_ALLOWED_TAGS.has(tag)) {
        data.keepAttr = false;
        return;
      }
      const cleaned = sanitizeInlineStyle(data.attrValue);
      if (!cleaned) {
        data.keepAttr = false;
        return;
      }
      data.attrValue = cleaned;
      return;
    }

    if (name === 'href' || name === 'src') {
      if (!isSafeUri(data.attrValue)) data.keepAttr = false;
    }

    if (name === 'data-raw-html' && tag !== 'div') {
      data.keepAttr = false;
    }
  });
}

export function sanitizeBlogEditorHtml(html) {
  if (typeof window === 'undefined') return '';
  ensureHooks();
  return DOMPurify.sanitize(String(html ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}
