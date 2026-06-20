import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useDataTheme } from '../hooks/useDataTheme';
import './estimate.css';

const LEAD =
  'AI-first software development. We ship custom products faster with modern agents, careful architecture, and a stack you can run — web, mobile, and Balochi-language initiatives included.';

function cssColorToInt(cssValue, fallback = 0x2dd4bf) {
  if (typeof document === 'undefined' || !cssValue) return fallback;
  const probe = document.createElement('span');
  probe.style.color = cssValue.trim();
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const parts = rgb.match(/\d+/g);
  if (!parts || parts.length < 3) return fallback;
  return (Number(parts[0]) << 16) + (Number(parts[1]) << 8) + Number(parts[2]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function PlainHeroOverlay() {
  return (
    <div className="ndx-estimate-hero__overlay">
      <p className="ndx-eyebrow">AI ESTIMATE</p>
      <h1 className="ndx-h1">
        Estimate your build with <em>AI</em>.
      </h1>
      <p className="ndx-lead">{LEAD}</p>
    </div>
  );
}

export default function EstimateHero() {
  const hostRef = useRef(null);
  const vantaRef = useRef(null);
  const theme = useDataTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [vantaFailed, setVantaFailed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion || vantaFailed || !hostRef.current) {
      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const root = document.documentElement;
        const accent = cssColorToInt(getComputedStyle(root).getPropertyValue('--ndx-accent'));
        const bg = cssColorToInt(getComputedStyle(root).getPropertyValue('--ndx-bg'), 0x181818);

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
          color: accent,
          backgroundColor: bg,
          points: 12,
          maxDistance: 28,
          spacing: 22,
          showDots: true,
        });
      } catch {
        if (!cancelled) setVantaFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [reducedMotion, theme, vantaFailed]);

  const showVanta = typeof window !== 'undefined' && !reducedMotion && !vantaFailed;

  return (
    <section className="ndx-estimate-hero">
      {showVanta ? <div ref={hostRef} className="ndx-estimate-hero__vanta" aria-hidden /> : null}
      <PlainHeroOverlay />
    </section>
  );
}
