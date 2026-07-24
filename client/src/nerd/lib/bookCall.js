/** Cal.com 30‑minute meeting with Baloch Dev. */
export const CAL_LINK = 'baloch-dev/30min';
export const CAL_NAMESPACE = '30min';
export const CAL_URL = 'https://cal.com/baloch-dev/30min';

export function openCalInNewTab() {
  if (typeof window === 'undefined') return;
  window.open(CAL_URL, '_blank', 'noopener,noreferrer');
}
