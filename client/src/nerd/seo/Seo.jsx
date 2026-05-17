import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE, SITE_URL } from './siteSeo';

/**
 * Canonical and og:url always use SITE_URL + path (currently https://balochdev.com).
 * OG/Twitter images: absolute DEFAULT_OG_IMAGE unless ogImage overrides (full URL or site-relative path).
 *
 * Builds absolute OG image URLs from SITE_URL + path or preserves absolute http(s) URLs.
 */
function resolveOgImage(img) {
  if (!img) return DEFAULT_OG_IMAGE;
  if (img.startsWith('https://') || img.startsWith('http://')) return img;
  return `${SITE_URL}${img.startsWith('/') ? img : `/${img}`}`;
}

/**
 * Per-route SEO head tags via react-helmet-async (title, canonical, OG, Twitter, robots, optional JSON-LD).
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.canonicalPath — path only, e.g. `/` or `/blog/my-slug`
 * @param {string} [props.ogImage]
 * @param {string} [props.type='website'] — forwarded to og:type
 * @param {boolean} [props.noindex=false]
 * @param {object | object[]} [props.jsonLd] — serialized into one application/ld+json script
 */
export default function Seo({
  title,
  description,
  canonicalPath,
  ogImage,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonical = `${SITE_URL}${path}`;
  const imageAbsolute = resolveOgImage(ogImage);
  const ldPayload =
    jsonLd !== undefined && jsonLd !== null ? jsonLd : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageAbsolute} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageAbsolute} />

      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />

      {ldPayload !== null ? (
        <script type="application/ld+json">{JSON.stringify(ldPayload)}</script>
      ) : null}
    </Helmet>
  );
}
