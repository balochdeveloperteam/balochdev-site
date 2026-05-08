import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDataTheme } from '../../hooks/useDataTheme';

/**
 * Vanta.js NET — https://www.vantajs.com/ — bundled three + dynamic vanta.net
 * Wider field (points / spacing / maxDistance), dots on, colors follow site theme.
 */
const THEME_NET = {
  dark: { color: 0x983fff, backgroundColor: 0x181818 },
  /* Light: Vanta picks additive blending when line luminance > bg; bright coral on #e8ecff washes to near-white.
   * Use dark ink + accent second pass via points/dots still readable; bg matches page. */
  light: { color: 0x132060, backgroundColor: 0xe8ecff },
  dusk: { color: 0xff8a6e, backgroundColor: 0x2a1f4a },
};

const NET_SHAPE = {
  points: 14,
  maxDistance: 32,
  spacing: 26,
  showDots: true,
};

export default function VantaNetBackground({ className = '', reducedMotion = false }) {
  const hostRef = useRef(null);
  const vantaRef = useRef(null);
  const theme = useDataTheme();

  useEffect(() => {
    if (reducedMotion || !hostRef.current) {
      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
      return undefined;
    }

    const palette = THEME_NET[theme] || THEME_NET.dark;

    let cancelled = false;

    (async () => {
      const { default: NET } = await import('vanta/dist/vanta.net.min.js');
      if (cancelled || !hostRef.current) return;

      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }

      vantaRef.current = NET({
        el: hostRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: palette.color,
        backgroundColor: palette.backgroundColor,
        ...NET_SHAPE,
      });
    })();

    return () => {
      cancelled = true;
      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [reducedMotion, theme]);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      {...(reducedMotion ? { 'data-vanta-off': 'true' } : {})}
    />
  );
}
