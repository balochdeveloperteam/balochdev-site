/**
 * Renders a single sponsored ad slot (client-loaded only — returns null if no ad).
 * @param {{ ad?: { image_url: string, image_alt?: string, link_url?: string }|null, variant?: 'hero'|'sidebar' }} props
 */
export default function BlogAdSlot({ ad, variant = 'sidebar' }) {
  if (!ad?.image_url) return null;

  const label = 'Sponsored';
  const img = (
    <img
      src={ad.image_url}
      alt={ad.image_alt || 'Advertisement'}
      loading="lazy"
      decoding="async"
    />
  );

  const inner = ad.link_url ? (
    <a
      href={ad.link_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="ndx-ad-slot__link"
    >
      {img}
    </a>
  ) : (
    img
  );

  return (
    <div
      className={`ndx-ad-slot ndx-ad-slot--${variant}`}
      role="complementary"
      aria-label="Sponsored advertisement"
    >
      <span className="ndx-ad-slot__label">{label}</span>
      <div className="ndx-ad-slot__frame">{inner}</div>
    </div>
  );
}
