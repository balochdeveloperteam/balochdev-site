import { useMemo } from "react";
import { getCachedLiteMotion } from "../utils/motionBudget";

/** Same lite-device signal as SmoothScroll — orbit / hero motion should respect it */
export function useLiteMotionProfile() {
  return useMemo(() => getCachedLiteMotion(), []);
}
