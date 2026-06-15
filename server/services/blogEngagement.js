const crypto = require('crypto');
const sanitizeHtml = require('sanitize-html');

const IP_HASH_SECRET = process.env.IP_HASH_SECRET || 'balochdev-dev-ip-salt-change-in-prod';

function hashClientIp(req) {
  const raw =
    req.ip ||
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : '') ||
    'unknown';
  return crypto.createHash('sha256').update(`${IP_HASH_SECRET}:${raw}`).digest('hex');
}

/** Plain text only — line breaks preserved as newlines in storage, rendered as <br> client-side or in prerender. */
function sanitizeCommentPlainText(content) {
  const stripped = sanitizeHtml(String(content || ''), { allowedTags: [], allowedAttributes: {} });
  return stripped.replace(/\r\n/g, '\n').trim().slice(0, 4000);
}

function mapPublicComment(row) {
  if (!row) return row;
  return {
    id: row.id,
    post_id: row.post_id,
    parent_id: row.parent_id,
    author_name: row.author_name,
    content: row.content,
    is_pinned: !!row.is_pinned,
    like_count: row.like_count || 0,
    created_at: row.created_at,
  };
}

function isValidVisitorKey(key) {
  return typeof key === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(key);
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim();
  return e.length >= 3 && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function isValidAuthorName(name) {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 80;
}

module.exports = {
  hashClientIp,
  sanitizeCommentPlainText,
  mapPublicComment,
  isValidVisitorKey,
  isValidEmail,
  isValidAuthorName,
};
