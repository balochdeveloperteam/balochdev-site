import { useEffect } from 'react';
import Lenis from 'lenis';

function reduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Inertial smooth scrolling (Lenis). Respects prefers-reduced-motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (reduceMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      anchors: true,
      autoRaf: true,
      wheelMultiplier: 0.95,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
