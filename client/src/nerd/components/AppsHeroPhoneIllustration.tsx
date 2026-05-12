import React from "react";

/**
 * Large hero graphic for /apps — phone frame + abstract app UI (inline SVG, theme-aware).
 */
export default function AppsHeroPhoneIllustration() {
  return (
    <svg
      className="ndx-apps-hero-phone-svg"
      viewBox="0 0 400 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mobile app illustration"
    >
      <defs>
        <linearGradient id="ndx-apps-phone-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--ndx-accent)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--ndx-accent-2, var(--ndx-accent))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--ndx-border)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ndx-apps-phone-screen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--ndx-bg)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--ndx-accent) 12%, var(--ndx-bg))" stopOpacity="1" />
        </linearGradient>
        <filter id="ndx-apps-phone-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="var(--ndx-accent)" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#ndx-apps-phone-shadow)">
        <rect x="118" y="36" width="164" height="448" rx="28" fill="url(#ndx-apps-phone-frame)" opacity="0.9" />
        <rect x="126" y="52" width="148" height="416" rx="20" fill="url(#ndx-apps-phone-screen)" stroke="var(--ndx-border)" strokeWidth="1.2" />
      </g>

      <rect x="186" y="60" width="28" height="5" rx="2.5" fill="var(--ndx-muted)" opacity="0.45" />

      <rect x="144" y="86" width="112" height="14" rx="6" fill="var(--ndx-accent)" opacity="0.35" />
      <rect x="144" y="108" width="72" height="10" rx="5" fill="var(--ndx-dim)" opacity="0.4" />

      <g opacity="0.92">
        <rect x="144" y="138" width="52" height="52" rx="14" fill="var(--ndx-accent)" opacity="0.22" />
        <rect x="208" y="138" width="52" height="52" rx="14" fill="var(--ndx-accent)" opacity="0.16" />
        <rect x="144" y="202" width="52" height="52" rx="14" fill="var(--ndx-accent)" opacity="0.18" />
        <rect x="208" y="202" width="52" height="52" rx="14" fill="var(--ndx-accent)" opacity="0.14" />
      </g>

      <rect x="144" y="278" width="116" height="56" rx="16" fill="var(--ndx-accent)" opacity="0.2" />
      <rect x="152" y="292" width="48" height="8" rx="4" fill="var(--ndx-text)" opacity="0.35" />
      <rect x="152" y="306" width="88" height="6" rx="3" fill="var(--ndx-dim)" opacity="0.35" />

      <rect x="144" y="348" width="116" height="40" rx="12" fill="color-mix(in srgb, var(--ndx-accent) 25%, transparent)" opacity="0.5" />

      <circle cx="200" cy="430" r="18" fill="none" stroke="var(--ndx-accent)" strokeWidth="2.5" opacity="0.5" />
      <circle cx="200" cy="430" r="6" fill="var(--ndx-accent)" opacity="0.55" />
    </svg>
  );
}
