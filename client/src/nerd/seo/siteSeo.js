/** Canonical origin (no www): canonical link, og:url, and JSON-LD base URLs. */
export const SITE_URL = 'https://balochdev.com';

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
  name: 'BalochDev',
  url: SITE_URL,
  logo: LOGO_ABSOLUTE,
  description: SITE_META_DESCRIPTION,
  sameAs: [
    'https://github.com/balochdeveloperteam',
    'https://www.instagram.com/ba1ochdev',
    'https://www.tiktok.com/@baloch.dev',
    'https://www.facebook.com/share/18QuFjdbMm/',
  ],
};
