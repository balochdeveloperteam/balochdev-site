/**
 * CORS middleware that mirrors the Express setup:
 * - allows explicit production origins
 * - allows any *.<project>.pages.dev preview
 * - allows localhost in dev
 */

const DEFAULT_CORS_ORIGINS = [
  'https://balochdev.com',
  'https://www.balochdev.com',
  'https://balochdev-site.pages.dev',
  'http://localhost:5173',
  'http://localhost:5174',
];

function parseList(value) {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function isPagesPreview(origin, project) {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:') return false;
    const host = `${project}.pages.dev`;
    return hostname === host || hostname.endsWith(`.${host}`);
  } catch {
    return false;
  }
}

function isAllowed(origin, env) {
  const isProd = env.NODE_ENV === 'production';
  if (!origin) return true;

  const allowList = parseList(env.CORS_ALLOWED_ORIGINS || env.CORS_ORIGIN);
  const list = allowList.length ? allowList : DEFAULT_CORS_ORIGINS;
  if (list.includes(origin)) return true;

  const project = env.CLOUDFLARE_PAGES_PROJECT_NAME || 'balochdev-site';
  if (isPagesPreview(origin, project)) return true;

  if (!isProd && !env.CORS_ALLOWED_ORIGINS && !env.CORS_ORIGIN) {
    return true;
  }
  return false;
}

export function corsMiddleware() {
  return async (c, next) => {
    const origin = c.req.header('origin') || '';
    const allowed = isAllowed(origin, c.env);

    if (c.req.method === 'OPTIONS') {
      if (allowed && origin) {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
            Vary: 'Origin',
          },
        });
      }
      return new Response(null, { status: 204 });
    }

    await next();

    if (allowed && origin) {
      c.res.headers.set('Access-Control-Allow-Origin', origin);
      c.res.headers.set('Access-Control-Allow-Credentials', 'true');
      c.res.headers.append('Vary', 'Origin');
    }
  };
}
