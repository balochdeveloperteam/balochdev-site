/** Canonical www origin for OG URLs, canonical links, and JSON-LD IDs. */
export const SITE_URL = 'https://www.balochdev.com';

/** Default share image — public brand logo (SVG; only raster assets available under client/public/). */
export const DEFAULT_OG_IMAGE_PATH = '/brand/logo-orange.svg';

/** Absolute OG/Twitter image URL resolved from SITE_URL + public path. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;

/** Mirrors client/index.html default meta description (single source intent for crawl snippets). */
const SITE_META_DESCRIPTION =
  'BalochDev — AI-first web & mobile, Supabase backends, Balochi language tech. Fast, SEO-aware, Cloudflare-ready.';

/** Logo for structured data — same file as social default (`client/public/brand/logo-orange.svg`). */
const LOGO_ABSOLUTE = `${SITE_URL}/brand/logo-orange.svg`;

/** JSON-LD Organization for BalochDev (extend sameAs later). */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BalochDev',
  url: SITE_URL,
  logo: LOGO_ABSOLUTE,
  description: SITE_META_DESCRIPTION,
  /** @todo Add verified profiles (GitHub, LinkedIn, X, etc.). */
  sameAs: [],
};
