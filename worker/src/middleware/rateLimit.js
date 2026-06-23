/**
 * Lightweight in-memory rate limiter scoped to the current Worker isolate.
 * Workers isolates are pooled per region and stay warm long enough to
 * enforce limits for normal-traffic sites. For a fully durable limiter,
 * swap the Map for a KV namespace.
 */

const buckets = new Map();

function take(key, max, windowMs) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  if (entry.count >= max) {
    return { allowed: false, remaining: 0, reset: entry.reset };
  }
  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

export function rateLimit({ windowMs, max, scope = 'global', message }) {
  return async (c, next) => {
    const ip =
      c.req.header('cf-connecting-ip') ||
      (c.req.header('x-forwarded-for') || '').split(',')[0].trim() ||
      'unknown';
    const key = `${scope}:${ip}`;
    const result = take(key, max, windowMs);
    if (!result.allowed) {
      return c.json(
        message || { error: 'Too many requests. Please try again later.' },
        429,
      );
    }
    await next();
  };
}
