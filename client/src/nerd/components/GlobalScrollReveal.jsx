import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Adds scroll-triggered motion to all `.ndx-section` / `.ndx-section-tight` blocks after route paint. */
export default function GlobalScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    let io;
    const run = () => {
      if (reducedMotion()) {
        document.querySelectorAll('.ndx-section, .ndx-section-tight').forEach((el) => {
          el.classList.add('ndx-reveal-section', 'ndx-reveal-section--visible');
        });
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('ndx-reveal-section--visible');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.07, rootMargin: '0px 0px -24px 0px' }
      );

      const markIfInView = (el) => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 0;
        const margin = 24;
        if (r.top < vh - margin && r.bottom > margin) {
          el.classList.add('ndx-reveal-section--visible');
          return true;
        }
        return false;
      };

      document.querySelectorAll('.ndx-section, .ndx-section-tight').forEach((el) => {
        el.classList.add('ndx-reveal-section');
        if (!markIfInView(el)) io.observe(el);
      });
    };

    const id = window.requestAnimationFrame(() => window.requestAnimationFrame(run));
    return () => {
      window.cancelAnimationFrame(id);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
