import { useEffect } from 'react';

function setMetaProperty(property, content) {
  if (content == null || content === '') return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets document title, meta description, optional canonical, Open Graph, and optional JSON-LD for SPA routes.
 * @param {{
 *   title: string,
 *   description?: string,
 *   path?: string,
 *   jsonLd?: object,
 *   ogTitle?: string,
 *   ogDescription?: string,
 *   ogImage?: string,
 *   ogUrl?: string,
 * }} opts
 */
export function usePageMeta({ title, description, path, jsonLd, ogTitle, ogDescription, ogImage, ogUrl }) {
  const jsonKey = jsonLd == null ? '' : JSON.stringify(jsonLd);

  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    if (description) meta.setAttribute('content', description);

    let link = document.querySelector('link[rel="canonical"]');
    if (path) {
      const href = `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
      setMetaProperty('og:url', ogUrl ?? href);
    } else if (ogUrl) {
      setMetaProperty('og:url', ogUrl);
    }

    setMetaProperty('og:title', ogTitle ?? title);
    setMetaProperty('og:description', ogDescription ?? description ?? '');
    if (ogImage) setMetaProperty('og:image', ogImage);
    setMetaProperty('og:type', 'website');

    const id = 'balochdev-page-jsonld';
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = id;
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [title, description, path, jsonKey, ogTitle, ogDescription, ogImage, ogUrl]);
}
