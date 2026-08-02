import { PARTNER_BRANDS } from "../data/partnerBrands";

type Props = {
  /** Extra class on outer grid (e.g. scroll margin) */
  className?: string;
};

export default function PartnerBrandsGrid({ className = "" }: Props) {
  return (
    <div className={`ndx-partner-grid ${className}`.trim()}>
      {PARTNER_BRANDS.map((b) => (
        <a
          key={b.id}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ndx-partner-tile ndx-card"
          aria-label={`${b.name} — opens in new tab`}
        >
          <span className="ndx-partner-tile__imgWrap">
            <img
              src={b.src}
              alt={b.alt || `${b.name} logo`}
              width={200}
              height={80}
              decoding="async"
              className="ndx-partner-tile__img"
              loading="lazy"
            />
          </span>
          <span className="ndx-partner-tile__hoverLabel" aria-hidden="true">
            {b.name}
          </span>
        </a>
      ))}
    </div>
  );
}
