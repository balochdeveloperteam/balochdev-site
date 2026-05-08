import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

/** Top progress bar on route change (common Next.js / SPA pattern). */
export default function RouteNProgress() {
  const ref = useRef(null);
  const skipFirst = useRef(true);
  const location = useLocation();

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const bar = ref.current;
    if (!bar) return;
    bar.continuousStart();
    const t = window.setTimeout(() => bar.complete(), 420);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.search, location.hash]);

  return (
    <LoadingBar
      ref={ref}
      color="var(--ndx-accent)"
      height={3}
      shadow
      containerClassName="ndx-nprogress-container"
      className="ndx-nprogress-bar"
      loaderSpeed={450}
      transitionTime={280}
    />
  );
}
