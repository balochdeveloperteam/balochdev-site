import sanitizeHtml from 'sanitize-html';

/** Mirrors server/services/blog.js allowlist for live HTML-embed preview in the editor. */
export const BLOG_EDITOR_SANITIZE = {
  allowedTags: [
    'h2', 'h3', 'p', 'br', 'strong', 'em', 'b', 'i', 'span',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'a', 'hr', 'figure', 'figcaption', 'img', 'div',
  ],
  allowedAttributes: {
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
};

export function sanitizeBlogEditorHtml(html) {
  return sanitizeHtml(String(html ?? ''), BLOG_EDITOR_SANITIZE);
}
