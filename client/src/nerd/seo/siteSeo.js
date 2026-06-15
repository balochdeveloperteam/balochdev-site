/** Canonical origin (no www): canonical link, og:url, and JSON-LD base URLs. */
export const SITE_URL = 'https://balochdev.com';

/**
 * Non-public routes: no sitemap entries; disallow in robots.txt when generation is added.
 *
 * Non-indexed surfaces must remain private:
 * - `/admin`, `/admin/login`, `/admin/*`
 * - `/team`, `/team/*` (internal team workspace)
 *
 * Consumers: omit matching URLs from sitemap builders; robots Disallow for each root.
 */
export const PRIVATE_ROUTES = Object.freeze({
  ADMIN_ROOT: '/admin',
  ADMIN_LOGIN: '/admin/login',
  TEAM_ROOT: '/team',
});

function isUnderRoot(pathname, root) {
  return pathname === root || pathname.startsWith(`${root}/`);
}

/** `true` when `pathname` must never appear in a public crawl/sitemap listing. */
export function isPrivateSitePath(pathname) {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return isUnderRoot(p, PRIVATE_ROUTES.ADMIN_ROOT) || isUnderRoot(p, PRIVATE_ROUTES.TEAM_ROOT);
}

/** Stable graph id referenced by nested JSON-LD (AboutPage, CollectionPage authors, etc.). */
export const ORGANIZATION_GRAPH_ID = `${SITE_URL}#organization`;

/** Default Open Graph / Twitter share image (`client/public/og/balochdev_og.png`). */
export const DEFAULT_OG_IMAGE_PATH = '/og/balochdev_og.png';

/** Absolute OG/Twitter image URL. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/balochdev_og.png`;

/** Organization snippet for JSON-LD (distinct from social share raster). */
const SITE_META_DESCRIPTION =
  'BalochDev — AI-first web & mobile, Supabase backends, Balochi language tech. Fast, SEO-aware, Cloudflare-ready.';

/** Structured-data logo uses SVG (`client/public/brand/logo-orange.svg`); OG uses PNG above. */
const LOGO_ABSOLUTE = `${SITE_URL}/brand/logo-orange.svg`;

// TODO: Add Google Play URL after the next app release links back to the site (append to sameAs).

/** JSON-LD Organization for BalochDev. */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_GRAPH_ID,
  name: 'BalochDev',
  url: SITE_URL,
  logo: LOGO_ABSOLUTE,
  description: SITE_META_DESCRIPTION,
  sameAs: [
    'https://github.com/balochdeveloperteam',
    'https://www.linkedin.com/company/balochdev/',
    'https://x.com/BalochDev404',
    'https://www.instagram.com/balochdev_',
    'https://medium.com/@balochdev',
    'https://www.facebook.com/share/18QuFjdbMm/',
  ],
};

/** About page markup: references Organization by @id instead of repeating the full home node. */
export function aboutPageJsonLd({ headline, description }) {
  const pageUrl = `${SITE_URL}/about`;
  const pageId = `${pageUrl}#aboutpage`;
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': pageId,
    name: headline,
    description,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', url: SITE_URL, name: 'BalochDev' },
    publisher: { '@id': ORGANIZATION_GRAPH_ID },
    about: { '@id': ORGANIZATION_GRAPH_ID },
    mainEntity: { '@id': ORGANIZATION_GRAPH_ID },
  };
}
