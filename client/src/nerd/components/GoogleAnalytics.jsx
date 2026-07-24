import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-PB4XH55BPP';

/**
 * SPA page views for Google Analytics (gtag.js is loaded from index.html).
 * Initial page_view comes from gtag('config'); this fires on client route changes.
 */
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: document.title,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
