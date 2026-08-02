import { Navigate, useLocation } from 'react-router-dom';
import { isFilePathname, normalizeCanonicalPath } from '../seo/canonicalUrl';
import { isPrivateSitePath } from '../seo/siteSeo';

/**
 * Client + Cloudflare Pages agree: public page URLs use a trailing slash.
 * Redirect bare `/about` → `/about/` (replace). Skip home, files, and private shells.
 */
export default function PreferTrailingSlash() {
  const { pathname, search, hash } = useLocation();

  if (pathname === '/' || pathname === '') return null;
  if (isFilePathname(pathname)) return null;

  const bare = pathname.replace(/\/+$/, '') || '/';

  // Private shells stay without trailing slash (Route paths are `/admin`, `/login`, `/team`).
  if (isPrivateSitePath(bare)) {
    if (pathname.endsWith('/') && pathname.length > 1) {
      return <Navigate to={`${bare}${search}${hash}`} replace />;
    }
    return null;
  }

  if (pathname.endsWith('/')) return null;

  const next = normalizeCanonicalPath(pathname);
  if (next === pathname) return null;

  return <Navigate to={`${next}${search}${hash}`} replace />;
}
