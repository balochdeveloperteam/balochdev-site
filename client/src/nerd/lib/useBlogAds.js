import { useEffect, useState } from 'react';

import { apiUrl } from '../../lib/api';

/**
 * Client-only fetch of live ads (not included in prerender HTML).
 * @returns {Record<string, object|null>|null} null while loading; then placement map.
 */
export function useBlogAds() {
  const [ads, setAds] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl('/api/ads'))
      .then((r) => (r.ok ? r.json() : { ads: {} }))
      .then((data) => {
        if (!cancelled) setAds(data.ads || {});
      })
      .catch(() => {
        if (!cancelled) setAds({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return ads;
}
