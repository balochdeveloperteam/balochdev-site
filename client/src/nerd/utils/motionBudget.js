/**
 * Functional-only tiering for heavy motion extras (blurred bloom, Lenis).
 * Orbit rings / marquees stay on unless the user prefers reduced motion.
 * Cached per tab in sessionStorage so we don't re-read device hints on every navigation.
 */
const STORAGE_KEY = "balochdev-lite-motion-v2";

export function computeLiteMotion() {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  try {
    const dm = navigator.deviceMemory;
    /* Only very low-memory devices — 4GB was too aggressive and froze tech rings */
    if (typeof dm === "number" && dm <= 2) return true;
  } catch {
    /* ignore */
  }

  try {
    const hc = navigator.hardwareConcurrency;
    if (typeof hc === "number" && hc <= 2) return true;
  } catch {
    /* ignore */
  }

  try {
    if (navigator.connection?.saveData) return true;
  } catch {
    /* ignore */
  }

  return false;
}

/** Read/write cached lite flag for the session */
export function getCachedLiteMotion() {
  if (typeof window === "undefined") return false;
  try {
    const s = sessionStorage.getItem(STORAGE_KEY);
    if (s === "1") return true;
    if (s === "0") return false;
  } catch {
    /* ignore */
  }
  const v = computeLiteMotion();
  try {
    sessionStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
  return v;
}
