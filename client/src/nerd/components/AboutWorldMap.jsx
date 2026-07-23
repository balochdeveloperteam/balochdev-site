import { useId, useState } from 'react';

/**
 * Approximate equirectangular positions for presence markers.
 * x/y are percentages of the map frame.
 */
export const MEET_LOCATIONS = [
  { id: 'qatar', name: 'Qatar', x: 64.3, y: 39.5, kind: 'meet' },
  { id: 'bahrain', name: 'Bahrain', x: 63.8, y: 38.8, kind: 'meet' },
  { id: 'uae', name: 'United Arab Emirates', x: 65.2, y: 40.2, kind: 'meet' },
  { id: 'iran', name: 'Iran', x: 64.8, y: 35.5, kind: 'meet' },
  { id: 'russia', name: 'Russia', x: 62.5, y: 22.5, kind: 'meet' },
  { id: 'balochistan', name: 'Balochistan', x: 67.5, y: 38.5, kind: 'meet' },
];

export const CLIENT_LOCATIONS = [
  { id: 'usa', name: 'United States', x: 22, y: 36, kind: 'client' },
  { id: 'canada', name: 'Canada', x: 20, y: 26, kind: 'client' },
  { id: 'uk', name: 'United Kingdom', x: 48.5, y: 28.5, kind: 'client' },
  { id: 'germany', name: 'Germany', x: 51.5, y: 29.5, kind: 'client' },
  { id: 'france', name: 'France', x: 49.5, y: 32, kind: 'client' },
  { id: 'netherlands', name: 'Netherlands', x: 50.8, y: 28.8, kind: 'client' },
  { id: 'eu', name: 'European Union', x: 52.5, y: 31.5, kind: 'client' },
];

export const ALL_LOCATIONS = [...MEET_LOCATIONS, ...CLIENT_LOCATIONS];

/** Stylized dotted world map with highlightable presence markers. */
export default function AboutWorldMap({ activeId = null, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const dotsId = `ndx-map-dots-${uid}`;
  const landId = `ndx-map-land-${uid}`;
  const glowId = `ndx-map-glow-${uid}`;

  return (
    <div className={`ndx-about-map ${className}`.trim()}>
      <svg
        className="ndx-about-map__svg"
        viewBox="0 0 1000 520"
        role="img"
        aria-label="World map showing BalochDev meet locations and client markets"
      >
        <defs>
          <pattern id={dotsId} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="1.15" className="ndx-about-map__dot" />
          </pattern>
          <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Simplified land silhouettes (stylized, not cadastral) */}
          <mask id={landId}>
            <rect width="1000" height="520" fill="black" />
            {/* North America */}
            <path
              fill="white"
              d="M95 95c35-28 78-42 125-38 42 4 78 22 98 55 14 24 12 52-2 74-10 16-28 28-48 34-22 6-40 4-58-6-18 22-42 40-72 48-28 8-58 4-78-14-24-22-28-58-12-86 10-18 28-40 47-67z"
            />
            <path
              fill="white"
              d="M170 250c22-8 48-4 62 14 10 14 8 34-4 46-16 16-42 20-62 10-18-8-28-28-22-46 4-12 14-20 26-24z"
            />
            {/* South America */}
            <path
              fill="white"
              d="M230 290c28-6 48 10 58 34 8 20 6 44-8 62-12 16-30 28-50 30-22 2-42-10-52-28-12-22-8-50 8-68 12-14 28-26 44-30z"
            />
            {/* Europe */}
            <path
              fill="white"
              d="M470 145c28-14 58-16 86-6 20 8 34 24 36 46 2 18-8 34-24 42-18 10-40 8-56-2-8 14-24 22-42 20-22-2-36-20-34-40 2-22 16-44 34-60z"
            />
            {/* Africa */}
            <path
              fill="white"
              d="M495 230c34-8 68 0 90 28 18 22 22 54 10 80-10 24-34 44-62 50-30 6-62-4-82-26-18-20-22-50-10-74 12-24 32-48 54-58z"
            />
            {/* Asia / Middle East / Russia mass */}
            <path
              fill="white"
              d="M560 95c70-20 150-24 220 6 48 20 86 58 96 110 8 40-6 82-36 110-28 26-68 38-108 34-24-2-46-12-64-28-12 18-34 28-58 26-36-4-62-32-64-68-2-28 12-56 34-74 8-28 28-54 52-74 18-16 42-30 68-42z"
            />
            {/* South Asia / SE Asia tip */}
            <path
              fill="white"
              d="M690 250c28-4 52 14 60 40 6 20-2 42-20 52-20 12-46 8-60-8-16-18-14-48 4-66 4-8 10-14 16-18z"
            />
            {/* Australia */}
            <path
              fill="white"
              d="M780 355c36-10 74 2 92 32 14 22 10 52-12 68-24 18-60 18-84 2-22-14-30-44-16-68 10-18 28-30 50-34z"
            />
            {/* Greenland-ish */}
            <path fill="white" d="M310 70c18-12 40-10 52 6 10 14 6 34-8 42-16 10-38 4-46-12-8-14-4-28 2-36z" />
          </mask>
        </defs>

        <rect width="1000" height="520" className="ndx-about-map__ocean" rx="18" />
        <rect
          width="1000"
          height="520"
          fill={`url(#${dotsId})`}
          mask={`url(#${landId})`}
          opacity="0.95"
        />

        {ALL_LOCATIONS.map((loc) => {
          const active = activeId === loc.id;
          const cx = (loc.x / 100) * 1000;
          const cy = (loc.y / 100) * 520;
          return (
            <g
              key={loc.id}
              className={`ndx-about-map__marker ndx-about-map__marker--${loc.kind}${
                active ? ' is-active' : ''
              }${activeId && !active ? ' is-dim' : ''}`}
              transform={`translate(${cx} ${cy})`}
              filter={active ? `url(#${glowId})` : undefined}
            >
              <circle className="ndx-about-map__pulse" r={active ? 16 : 11} />
              <circle className="ndx-about-map__pin" r={active ? 5.5 : 4} />
              {active ? (
                <text className="ndx-about-map__label" x="10" y="-10">
                  {loc.name}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function usePresenceHover() {
  const [activeId, setActiveId] = useState(null);
  return {
    activeId,
    onEnter: (id) => setActiveId(id),
    onLeave: () => setActiveId(null),
  };
}
