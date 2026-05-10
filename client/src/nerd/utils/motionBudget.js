/**
 * Functional-only tiering for heavy motion (orbit rings, Lenis). Cached per tab in sessionStorage
 * so we don't re-read device hints on every navigation. Not advertising/analytics — no consent banner required.
 */
const STORAGE_KEY = "balochdev-lite-motion-v1";

export function computeLiteMotion() {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  try {
    const dm = navigator.deviceMemory;
    if (typeof dm === "number" && dm <= 4) return true;
  } catch {
    /* ignore */
  }

  try {
    const hc = navigator.hardwareConcurrency;
    if (typeof hc === "number" && hc <= 4) return true;
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
