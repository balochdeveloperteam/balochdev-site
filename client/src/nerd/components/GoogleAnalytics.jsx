import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SPA page views via Cloudflare Zaraz.
 * GA4 itself is installed in Zaraz (not gtag in HTML) so Consent Management can gate it.
 */
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.zaraz?.track !== 'function') return;

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    window.zaraz.track('Pageview', {
      page_path: pagePath,
      page_title: document.title,
      page_url: window.location.href,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
