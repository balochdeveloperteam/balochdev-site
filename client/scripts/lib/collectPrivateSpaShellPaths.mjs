/**
 * Static pathname list for private SPA shells (dist/<path>/index.html).
 * Derived from client/src/App.jsx — excludes dynamic segments (:id, :slug, etc.).
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_JSX = join(__dirname, '../../src/App.jsx');

function isDynamicSegment(seg) {
  return seg.includes(':') || seg.includes('*');
}

function normalizePathname(p) {
  if (!p || p === '/') return p;
  return p.replace(/\/+$/, '') || p;
}

function addRelativePaths(inner, prefix, paths) {
  if (!inner) return;
  for (const m of inner.matchAll(/<Route\s+path="([^"/][^"]*)"/g)) {
    const seg = m[1];
    if (isDynamicSegment(seg)) continue;
    paths.add(normalizePathname(`${prefix}/${seg}`));
  }
}

/**
 * @returns {string[]} sorted unique pathnames needing bare SPA shells on Cloudflare Pages
 */
export function collectPrivateSpaShellPathnames() {
  const src = readFileSync(APP_JSX, 'utf8');
  /** @type {Set<string>} */
  const paths = new Set(['/login', '/admin', '/team']);

  for (const m of src.matchAll(/<Route\s+path="(\/[^"]*)"/g)) {
    const p = normalizePathname(m[1]);
    if (isDynamicSegment(p)) continue;
    if (p === '/login' || p.startsWith('/admin')) paths.add(p);
  }

  const adminInner = src.match(
    /<Route\s+path="\/admin"[^>]*>([\s\S]*?)<\/Route>\s*\n\s*<Route\s+path="\/team"/,
  )?.[1];
  const teamInner = src.match(
    /<Route\s+path="\/team"[^>]*>([\s\S]*?)<\/Route>\s*\n\s*<Route\s+path="\*"/,
  )?.[1];

  addRelativePaths(adminInner, '/admin', paths);
  addRelativePaths(teamInner, '/team', paths);

  return [...paths].sort();
}
