import { useCallback, useEffect, useState } from "react";
import { TbArrowUp } from "react-icons/tb";

/** Fixed “go to top” — logical inline-end (bottom-right LTR, bottom-left RTL). */
export default function ScrollTopFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible(y > 320);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const goTop = useCallback(() => {
    const lenis = typeof window !== "undefined" ? window.ndxLenis : null;
    if (lenis && typeof lenis.scrollTo === "function") {
      try {
        lenis.scrollTo(0, { duration: 0.5 });
        return;
      } catch {
        /* Lenis may be mid-teardown (Strict Mode / HMR); fall through */
      }
    }
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduce ? "auto" : "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="ndx-scroll-top-fab"
      onClick={goTop}
      aria-label="Go to top"
    >
      <TbArrowUp aria-hidden />
    </button>
  );
}
