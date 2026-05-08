import { useEffect, useRef } from 'react';

function reduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Soft accent spotlight following the pointer (pointer-events: none). */
export default function CursorGlow() {
  const layerRef = useRef(null);

  useEffect(() => {
    if (reduceMotion()) return;

    const el = layerRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (reduceMotion()) return null;

  return <div ref={layerRef} className="ndx-pointer-glow" aria-hidden="true" />;
}
