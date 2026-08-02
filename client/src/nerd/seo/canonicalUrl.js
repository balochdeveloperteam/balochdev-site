import { SITE_URL } from './siteSeo.js';

/** Paths that must not receive a trailing slash (files / feeds). */
const FILE_EXT_RE = /\.[a-z0-9]{1,12}$/i;

/**
 * True when pathname looks like a static file (sitemap.xml, brand-kit.json, images).
 * @param {string} pathname
 */
export function isFilePathname(pathname) {
  const p = String(pathname || '');
  const last = p.split('/').filter(Boolean).pop() || '';
  return FILE_EXT_RE.test(last);
}

/**
 * Normalize a site path for the public canonical form:
 * - leading slash
 * - query string + hash stripped
 * - trailing slash on pages (Cloudflare Pages `…/index.html` form)
 * - no trailing slash on file-like paths
 * - home stays `/`
 *
 * @param {string} pathOrUrl — `/about`, `/blog/?x=1`, full URL, etc.
 * @returns {string} pathname only, e.g. `/about/`
 */
export function normalizeCanonicalPath(pathOrUrl) {
  let pathname = '/';
  try {
    if (/^https?:\/\//i.test(String(pathOrUrl || ''))) {
      pathname = new URL(String(pathOrUrl)).pathname || '/';
    } else {
      const raw = String(pathOrUrl || '/').split('#')[0].split('?')[0];
      pathname = raw.startsWith('/') ? raw : `/${raw}`;
    }
  } catch {
    pathname = '/';
  }

  pathname = pathname.replace(/\/{2,}/g, '/');
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.replace(/\/+$/, '');
  }
  if (!pathname || pathname === '/') return '/';

  if (isFilePathname(pathname)) return pathname;
  return `${pathname}/`;
}

/**
 * Absolute canonical / og:url on apex https://balochdev.com (never www).
 * @param {string} pathOrUrl
 * @returns {string}
 */
export function absoluteCanonicalUrl(pathOrUrl) {
  const path = normalizeCanonicalPath(pathOrUrl);
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

/**
 * Router `to` / href helper: trailing-slash page paths; preserve hash; drop query for SEO links
 * unless `keepSearch` is true.
 * @param {string} to
 * @param {{ keepSearch?: boolean }} [opts]
 */
export function toTrailingSlashHref(to, opts = {}) {
  if (to == null || to === '') return '/';
  const s = String(to);
  if (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('mailto:') ||
    s.startsWith('tel:') ||
    s.startsWith('//')
  ) {
    return s;
  }
  if (s.startsWith('#')) return s;

  const hashIdx = s.indexOf('#');
  const hash = hashIdx >= 0 ? s.slice(hashIdx) : '';
  const withoutHash = hashIdx >= 0 ? s.slice(0, hashIdx) : s;
  const qIdx = withoutHash.indexOf('?');
  const search = qIdx >= 0 ? withoutHash.slice(qIdx) : '';
  const pathPart = qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash;

  const path = normalizeCanonicalPath(pathPart || '/');
  const q = opts.keepSearch ? search : '';
  return `${path}${q}${hash}`;
}
