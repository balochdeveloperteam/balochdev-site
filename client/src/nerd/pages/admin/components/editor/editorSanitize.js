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
  'section',
  'style',
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
  'id',
  'type',
  'data-raw-html',
];

const LENGTH = /^-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%|vh|vw)?$/;
const COLOR =
  /^(#[0-9a-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)|[a-z]{3,20})$/i;

const STYLE_RULES = {
  'text-align': /^(left|right|center|justify)$/,
  color: COLOR,
  'background-color': COLOR,
  background: /^(transparent|none|#[0-9a-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)|[a-z]{3,20})$/i,
  'font-size': LENGTH,
  'font-weight': /^(normal|bold|[1-9]00)$/,
  'line-height': /^(normal|-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?)$/,
  'letter-spacing': LENGTH,
  padding: /^(-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?\s*){1,4}$/,
  margin: /^(auto|-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?\s*){1,4}$/,
  'padding-top': LENGTH,
  'padding-right': LENGTH,
  'padding-bottom': LENGTH,
  'padding-left': LENGTH,
  'margin-top': LENGTH,
  'margin-right': LENGTH,
  'margin-bottom': LENGTH,
  'margin-left': LENGTH,
  border: /^(none|(-?(0|[1-9]\d*)(\.\d+)?(px|rem|em)?\s+)?(none|solid|dashed|dotted|double)\s+.+)$/i,
  'border-radius': /^(-?(0|[1-9]\d*)(\.\d+)?(px|rem|em|%)?\s*){1,4}$/,
  'border-color': COLOR,
  'border-width': LENGTH,
  'border-style': /^(none|solid|dashed|dotted|double)$/,
  width: LENGTH,
  'max-width': LENGTH,
  'min-width': LENGTH,
  height: LENGTH,
  'max-height': LENGTH,
  'min-height': LENGTH,
  display: /^(block|inline|inline-block|flex|grid|none)$/,
  'flex-direction': /^(row|column|row-reverse|column-reverse)$/,
  'flex-wrap': /^(nowrap|wrap|wrap-reverse)$/,
  'align-items': /^(stretch|flex-start|flex-end|center|baseline)$/,
  'justify-content': /^(flex-start|flex-end|center|space-between|space-around|space-evenly)$/,
  gap: LENGTH,
  'row-gap': LENGTH,
  'column-gap': LENGTH,
  'grid-template-columns': /^(none|repeat\([^)]+\)|[^;{}]{1,80})$/,
  opacity: /^(0|1|0?\.\d+)$/,
  'box-sizing': /^(border-box|content-box)$/,
  overflow: /^(visible|hidden|auto|scroll)$/,
  'overflow-x': /^(visible|hidden|auto|scroll)$/,
  'overflow-y': /^(visible|hidden|auto|scroll)$/,
};

const STYLE_ALLOWED_TAGS = new Set([
  'p',
  'h2',
  'h3',
  'span',
  'blockquote',
  'div',
  'section',
  'ul',
  'ol',
  'li',
  'a',
  'figure',
  'figcaption',
  'img',
  'pre',
  'code',
]);

function sanitizeInlineStyle(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const kept = [];
  for (const part of raw.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const value = part.slice(idx + 1).trim();
    if (!value || /expression\s*\(|javascript:|url\s*\(/i.test(value)) continue;
    const rule = STYLE_RULES[prop];
    if (rule && rule.test(value)) kept.push(`${prop}: ${value}`);
  }
  return kept.join('; ');
}

/** Allow embedded <style> for custom sections, but strip dangerous CSS. */
export function sanitizeEmbeddedCss(css) {
  let s = String(css || '');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  if (/@import|@charset|expression\s*\(|javascript:|behavior\s*:|-moz-binding|@font-face/i.test(s)) {
    return '';
  }
  s = s.replace(/url\s*\([^)]*\)/gi, 'none');
  s = s.replace(/position\s*:\s*(fixed|sticky)/gi, 'position: relative');
  return s.slice(0, 20000).trim();
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

    if (name === 'id' && !/^[a-z][\w-]{0,40}$/i.test(String(data.attrValue || ''))) {
      data.keepAttr = false;
    }
  });

  DOMPurify.addHook('uponSanitizeElement', (node) => {
    if ((node.nodeName || '').toLowerCase() !== 'style') return;
    const clean = sanitizeEmbeddedCss(node.textContent || '');
    if (!clean) {
      node.textContent = '';
      return;
    }
    node.textContent = clean;
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
    FORCE_BODY: true,
  });
}
