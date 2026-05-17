import * as esbuild from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { SITE_URL, isPrivateSitePath, PRIVATE_ROUTES } from '../src/nerd/seo/siteSeo.js';
import { readProjectDetailSlugsFromCanonicalFile } from './lib/readProjectDetailSlugs.mjs';
import { tryCreateSupabaseBuildClient } from './lib/supabaseBuildClient.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = join(__dirname, '..');
const ROUTES_OUT_DIR = join(CLIENT_ROOT, '.routes');
const OUT_JSON = join(ROUTES_OUT_DIR, 'all-routes.json');
const TMP_BUNDLE = join(ROUTES_OUT_DIR, '__enumerate_bundle.tmp.mjs');

/** Public static pathname list from App.jsx (no /admin*, no wildcard). */
const STATIC_PATHS = [
  '/',
  '/services',
  '/brand',
  '/technologies',
  '/apps',
  '/portfolio',
  '/about',
  '/blog',
  '/contact',
  '/estimate',
  '/proposal',
  '/privacy',
  '/terms',
  '/refund',
  '/fulfilment',
];

function abs(site, pathname) {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${site.replace(/\/$/, '')}${p}`;
}

function pathname(u) {
  try {
    if (typeof u !== 'string' || !u.startsWith('http')) {
      let p = String(u || '').trim();
      if (!p.startsWith('/')) p = `/${p}`;
      if (p.endsWith('/') && p.length > 1) p = p.slice(0, -1);
      return p;
    }
    const url = new URL(u);
    let p = url.pathname;
    if (p.endsWith('/') && p.length > 1) p = p.slice(0, -1);
    return p;
  } catch {
    return '/';
  }
}

async function bundleCollector() {
  await mkdir(ROUTES_OUT_DIR, { recursive: true });

  await esbuild.build({
    absWorkingDir: CLIENT_ROOT,
    entryPoints: [join(CLIENT_ROOT, 'scripts/collectBundledRouteKeys.mjs')],
    outfile: TMP_BUNDLE,
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: ['node18'],
    logLevel: 'warning',
    loader: { '.ts': 'ts' },
  });

  const { collectBundledRoutePieces } = await import(pathToFileURL(TMP_BUNDLE).href);
  return collectBundledRoutePieces();
}

/**
 * Enumerate `/blog/:slug` from Supabase — never throws; uses blogEnumerated flag.
 * @returns {Promise<{ pathnames: string[], blogEnumerated: boolean }>}
 */
async function fetchBlogPathnames(log = console.warn) {
  /** @type {string[]} */
  const pathnames = [];
  let blogEnumerated = false;

  const client = tryCreateSupabaseBuildClient();
  if (!client) {
    log(`[routes:enumerate] blogEnumerated=false (Supabase env not available)`);
    return { pathnames, blogEnumerated };
  }

  try {
    const { data, error } = await client.from('blog_posts').select('slug').eq('published', true);

    if (error) {
      log(`[routes:enumerate] Blog query failed (${error.message}); blogEnumerated=false`);
      return { pathnames, blogEnumerated };
    }

    const rows = Array.isArray(data) ? data : [];
    for (const row of rows) {
      const slug = typeof row?.slug === 'string' ? row.slug.trim() : '';
      if (slug) pathnames.push(`/blog/${slug}`);
    }
    blogEnumerated = true;
  } catch (e) {
    log(`[routes:enumerate] Blog query threw (${/** @type {Error} */ (e)?.message}); blogEnumerated=false`);
  }

  return { pathnames, blogEnumerated };
}

function assertNoPrivateRoutes(sortedAbsUrls) {
  /** @type {string[]} */
  const violations = [];

  for (const u of sortedAbsUrls) {
    const p = pathname(u);
    if (p.includes('*')) violations.push(`${u} contains *`);
    if (isPrivateSitePath(p)) violations.push(`${p} matched isPrivateSitePath`);
  }

  const forbiddenAbs = [
    abs(SITE_URL, PRIVATE_ROUTES.ADMIN_ROOT),
    abs(SITE_URL, PRIVATE_ROUTES.ADMIN_LOGIN),
  ].filter(Boolean);
  for (const fx of forbiddenAbs) {
    if (sortedAbsUrls.includes(fx)) violations.push(`${fx} (PRIVATE_ROUTES)`);
  }

  if (violations.length) {
    throw new Error(
      `[routes:enumerate] Assertion failed — private/admin routes leaked:\n${violations.join('\n')}`,
    );
  }

  console.info('[routes:enumerate] Assertion OK — no admin paths or wildcards.');
}

async function main() {
  const bundled = await bundleCollector();
  const projectSlugs = readProjectDetailSlugsFromCanonicalFile();
  const blogResult = await fetchBlogPathnames();

  /** @type {string[]} */
  const pathnameList = [...STATIC_PATHS];

  for (const s of bundled.serviceDetailSlugs) pathnameList.push(`/services/${s}`);
  for (const id of bundled.practiceIds) pathnameList.push(`/services/practice/${id}`);
  for (const s of bundled.resourceSlugs) pathnameList.push(`/resources/${s}`);
  pathnameList.push(...bundled.techPathnames);

  for (const slug of projectSlugs) pathnameList.push(`/projects/${slug}`);
  pathnameList.push(...blogResult.pathnames);

  const normalized = pathnameList.map((p) => (p.endsWith('/') && p !== '/' ? p.replace(/\/+$/, '') : p));

  const site = SITE_URL;
  const filtered = normalized.filter((p) => !isPrivateSitePath(p));
  /** @type {string[]} */
  const uniqSortedPathnames = [...new Set(filtered)].sort();
  const sortedAbs = uniqSortedPathnames.map((p) => abs(site, p));

  assertNoPrivateRoutes(sortedAbs);

  const counts = {
    static: STATIC_PATHS.length,
    services: bundled.serviceDetailSlugs.length,
    practice: bundled.practiceIds.length,
    resources: bundled.resourceSlugs.length,
    tech: bundled.techPathnames.length,
    projects: projectSlugs.length,
    blog: blogResult.pathnames.length,
  };

  const payload = {
    siteUrl: site,
    generatedAt: new Date().toISOString(),
    urls: sortedAbs,
    pathnameCount: uniqSortedPathnames.length,
    urlCountUnique: sortedAbs.length,
    counts,
    blogEnumerated: blogResult.blogEnumerated,
    blogSlugCount: blogResult.pathnames.length,
  };

  await mkdir(dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.info(`[routes:enumerate] Wrote ${OUT_JSON}`);
  console.info(`[routes:enumerate] counts:`, counts);
  console.info(`[routes:enumerate] grandTotal (unique absolute URLs):`, sortedAbs.length);
  console.info(`[routes:enumerate] blogEnumerated:`, blogResult.blogEnumerated);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
