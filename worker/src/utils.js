/**
 * Shared helpers used across routes.
 */

export function safeError(c, status, devMessage, prodMessage = 'Internal server error') {
  const isProd = c.env.NODE_ENV === 'production';
  return c.json({ error: isProd ? prodMessage : devMessage }, status);
}

export function clientIp(c) {
  return (
    c.req.header('cf-connecting-ip') ||
    (c.req.header('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}

export async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashClientIp(c) {
  const raw = clientIp(c);
  const secret = c.env.IP_HASH_SECRET || 'balochdev-dev-ip-salt-change-in-prod';
  return sha256Hex(`${secret}:${raw}`);
}

export function isValidVisitorKey(key) {
  return typeof key === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(key);
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim();
  return e.length >= 3 && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function isValidAuthorName(name) {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 80;
}
