import { useEffect } from 'react';
import Lenis from 'lenis';
import { getCachedLiteMotion } from '../utils/motionBudget';

function reduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Inertial smooth scrolling (Lenis). Skipped when reduced-motion or lite-device tier (saves RAM / main-thread work). */
export default function SmoothScroll() {
  useEffect(() => {
    if (reduceMotion()) return;
    if (getCachedLiteMotion()) return;

    let lenis;
    let cancelled = false;
    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        lenis = new Lenis({
          lerp: 0.34,
          smoothWheel: true,
          anchors: true,
          autoRaf: true,
          wheelMultiplier: 1.35,
          duration: 0.9,
        });
        window.ndxLenis = lenis;
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[SmoothScroll] Lenis init failed', e);
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (lenis && window.ndxLenis === lenis) {
        delete window.ndxLenis;
      }
      if (lenis) {
        try {
          lenis.destroy();
        } catch (e) {
          if (import.meta.env.DEV) console.warn('[SmoothScroll] Lenis destroy failed', e);
        }
      }
    };
  }, []);

  return null;
}
