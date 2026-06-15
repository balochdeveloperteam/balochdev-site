const STORAGE_KEY = 'balochdev_visitor_key';

function randomKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

/** Anonymous browser id for blog likes — persisted in localStorage on the public site. */
export function getVisitorKey() {
  try {
    let key = localStorage.getItem(STORAGE_KEY);
    if (!key || key.length < 8) {
      key = randomKey();
      localStorage.setItem(STORAGE_KEY, key);
    }
    return key;
  } catch {
    return randomKey();
  }
}
