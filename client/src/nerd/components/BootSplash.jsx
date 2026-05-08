import { useLayoutEffect, useState } from 'react';

function reduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initial skeleton / shimmer overlay until first layout + fonts settle.
 * Fades out — similar to skeleton-first paint many Next.js apps use before streaming.
 */
export default function BootSplash() {
  const [phase, setPhase] = useState(() => (reduceMotion() ? 'gone' : 'in'));

  useLayoutEffect(() => {
    if (reduceMotion()) return;

    let cancelled = false;
    const exit = () => {
      if (cancelled) return;
      setPhase('out');
      window.setTimeout(() => setPhase('gone'), 480);
    };

    const startExit = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(exit);
      });
    };

    const fonts = document.fonts?.ready;
    if (fonts && typeof fonts.then === 'function') {
      fonts.then(startExit).catch(startExit);
    } else {
      startExit();
    }

    const max = window.setTimeout(exit, 2800);
    return () => {
      cancelled = true;
      window.clearTimeout(max);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      className={`ndx-boot ${phase === 'out' ? 'ndx-boot--out' : ''}`}
      aria-busy={phase === 'in'}
      aria-label="Loading"
    >
      <div className="ndx-boot__frame">
        <div className="ndx-boot__header">
          <span className="ndx-boot__sk ndx-boot__sk--logo" />
          <span className="ndx-boot__sk ndx-boot__sk--nav" />
        </div>
        <div className="ndx-boot__body">
          <span className="ndx-boot__sk ndx-boot__sk--title" />
          <span className="ndx-boot__sk ndx-boot__sk--line" />
          <span className="ndx-boot__sk ndx-boot__sk--line ndx-boot__sk--short" />
          <div className="ndx-boot__grid">
            <span className="ndx-boot__sk ndx-boot__sk--card" />
            <span className="ndx-boot__sk ndx-boot__sk--card" />
            <span className="ndx-boot__sk ndx-boot__sk--card" />
          </div>
        </div>
      </div>
    </div>
  );
}
