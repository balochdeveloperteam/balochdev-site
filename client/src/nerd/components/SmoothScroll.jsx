import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { getCachedLiteMotion } from '../utils/motionBudget';

function reduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Inertial smooth scrolling (Lenis). Skipped when reduced-motion or lite-device tier (saves RAM / main-thread work). */
export default function SmoothScroll() {
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    if (getCachedLiteMotion()) return;

    const lenis = new Lenis({
      lerp: 0.22,
      smoothWheel: true,
      anchors: true,
      autoRaf: true,
      wheelMultiplier: 1.12,
    });

    window.ndxLenis = lenis;

    return () => {
      delete window.ndxLenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
