import { SiFiverr, SiShopify, SiTrustpilot, SiUpwork } from 'react-icons/si';
import { useDataTheme } from '../../hooks/useDataTheme';
import logoBlack from '../../../assets/BalochDevLogo/logo_black.svg';
import logoWhite from '../../../assets/BalochDevLogo/logo_white.svg';
import logoOrange from '../../../assets/BalochDevLogo/logo_orange.svg';

const THEME_MARK = {
  light: logoBlack,
  dark: logoWhite,
  dusk: logoOrange,
};

function ClutchLogo() {
  return (
    <svg className="ndx-recog__wordmark ndx-recog__wordmark--clutch" viewBox="0 0 96 24" aria-hidden>
      <text
        x="0"
        y="18"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="-0.04em"
      >
        Clutch
      </text>
    </svg>
  );
}

function GoodFirmsLogo() {
  return (
    <svg className="ndx-recog__wordmark ndx-recog__wordmark--gf" viewBox="0 0 118 24" aria-hidden>
      <text
        x="0"
        y="18"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="-0.03em"
      >
        GoodFirms
      </text>
    </svg>
  );
}

function BalochMark({ src }) {
  return (
    <img
      className="ndx-recog__brand"
      src={src}
      alt="BalochDev logo"
      width={40}
      height={40}
      draggable={false}
    />
  );
}

export default function RecognitionBadges() {
  const theme = useDataTheme();
  const brandSrc = THEME_MARK[theme] || logoWhite;

  return (
    <div className="ndx-recog__bento" role="list" aria-label="Platform recognition">
      {/* 1–2 stacked */}
      <div className="ndx-recog__cell ndx-recog__cell--logo" role="listitem">
        <SiUpwork className="ndx-recog__logo-icon" aria-hidden />
        <span className="ndx-recog__logo-name">Upwork</span>
      </div>
      <div className="ndx-recog__cell ndx-recog__cell--logo" role="listitem">
        <SiTrustpilot className="ndx-recog__logo-icon" aria-hidden />
        <span className="ndx-recog__logo-name">Trustpilot</span>
      </div>

      {/* 3 Clutch */}
      <div className="ndx-recog__cell ndx-recog__cell--stat" role="listitem">
        <ClutchLogo />
        <span className="ndx-recog__stat-value">5.0</span>
        <span className="ndx-recog__stat-note">Client reviews</span>
      </div>

      {/* 4 GoodFirms tall logo */}
      <div className="ndx-recog__cell ndx-recog__cell--logo ndx-recog__cell--span-rows" role="listitem">
        <GoodFirmsLogo />
        <span className="ndx-recog__logo-meta">Top Developers · 5/5</span>
      </div>

      {/* 5 Fiverr once */}
      <div className="ndx-recog__cell ndx-recog__cell--stat" role="listitem">
        <SiFiverr className="ndx-recog__logo-icon" aria-hidden />
        <span className="ndx-recog__stat-label">Fiverr</span>
        <span className="ndx-recog__stat-value">50+</span>
        <span className="ndx-recog__stat-note">Top Rated · 5/5</span>
      </div>

      {/* 6 Shopify */}
      <div className="ndx-recog__cell ndx-recog__cell--logo ndx-recog__cell--span-rows" role="listitem">
        <SiShopify className="ndx-recog__logo-icon" aria-hidden />
        <span className="ndx-recog__logo-name">Shopify</span>
        <span className="ndx-recog__logo-meta">Certified Partner</span>
      </div>

      {/* 7 BalochDev */}
      <div className="ndx-recog__cell ndx-recog__cell--stat ndx-recog__cell--brand" role="listitem">
        <BalochMark src={brandSrc} />
        <span className="ndx-recog__stat-label">BalochDev</span>
        <span className="ndx-recog__stat-value">Top 1</span>
        <span className="ndx-recog__stat-note">Balochistan Tech Leaders</span>
      </div>
    </div>
  );
}
