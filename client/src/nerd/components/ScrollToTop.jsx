import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SPA default: land at top when the pathname changes (avoids staying scrolled near footer).
 * Uses Lenis when SmoothScroll installed it on window.ndxLenis.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const lenis = typeof window !== "undefined" ? window.ndxLenis : null;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
