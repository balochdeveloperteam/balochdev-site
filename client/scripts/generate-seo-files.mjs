/**
 * Generate sitemap.xml, robots.txt, and llms.txt into dist/ after `vite build`
 * (Pattern B). Inputs: authoritative client/.routes/all-routes.json from routes:enumerate.
 *
 * Sitemap lastmod policy (non-negotiable for non-blog URLs):
 * - Blog posts only: emit <lastmod> from real DB timestamps (published_at, else created_at).
 * - All other URLs: NEVER emit <lastmod>. Stamping every URL with build/deploy dates teaches
 *   crawlers the signal is noise and can reduce trust in genuine lastmod elsewhere.
 */

import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isPrivateSitePath, PRIVATE_ROUTES, SITE_URL } from '../src/nerd/seo/siteSeo.js';

import { tryCreateSupabaseBuildClient } from './lib/supabaseBuildClient.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.join(__dirname, '..');
const DIST = path.join(CLIENT_ROOT, 'dist');
const ROUTES_JSON = path.join(CLIENT_ROOT, '.routes', 'all-routes.json');

const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

/** Optional: mirror prerender scripts so CI / local `.env` VITE_* are visible without export. */
function hydrateProcessEnvFromClientDotEnv() {
  try {
    const fp = path.join(CLIENT_ROOT, '.env');
    if (!fs.existsSync(fp)) return;
    const raw = fs.readFileSync(fp, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const m = /^([\w.-]+)=(.*)$/.exec(line);
      if (!m) continue;
      const k = m[1];
      if (!k.startsWith('VITE_')) continue;
      if (process.env[k] !== undefined && String(process.env[k]).length > 0) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[k] = v;
    }
  } catch {
    /* optional */
  }
}

function pathnameFromAbsoluteUrl(abs) {
  try {
    let p = new URL(abs).pathname;
    if (p.endsWith('/') && p.length > 1) p = p.slice(0, -1);
    return p || '/';
  } catch {
    return '/';
  }
}

function blogSlugFromPathname(p) {
  const m = /^\/blog\/([^/?#]+)$/.exec(p);
  return m ? decodeURIComponent(m[1]) : null;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** W3C / ISO 8601 date (calendar day component is sufficient per sitemap spec). */
function formatSitemapLastMod(value) {
  if (value === null || value === undefined || value === '') return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/**
 * Prefer published_at; if missing and created_at exists, use created_at; else omit.
 */
function resolveBlogLastmodRow(row) {
  const pa = row?.published_at;
  const ca = row?.created_at;
  if (pa !== null && pa !== undefined && String(pa).trim() !== '') {
    return formatSitemapLastMod(pa);
  }
  if (pa === null || pa === undefined || String(pa).trim() === '') {
    if (ca !== null && ca !== undefined && String(ca).trim() !== '') {
      return formatSitemapLastMod(ca);
    }
  }
  return null;
}

async function fetchBlogSlugLastmods() {
  /** @type {Map<string, string | null>} */
  const slugToYM = new Map();

  const client = tryCreateSupabaseBuildClient(console.warn);
  if (!client) {
    console.warn('[seo:files] Supabase build client unavailable — sitemap blog <lastmod> omitted.');
    return slugToYM;
  }

  try {
    const { data, error } = await client
      .from('blog_posts')
      .select('slug, published_at, created_at')
      .eq('published', true);

    if (error) {
      console.warn(`[seo:files] blog_posts query failed (${error.message}) — sitemap blog <lastmod> omitted.`);
      return slugToYM;
    }

    const rows = Array.isArray(data) ? data : [];
    for (const row of rows) {
      const slug = typeof row?.slug === 'string' ? row.slug.trim() : '';
      if (!slug) continue;
      const lm = resolveBlogLastmodRow(row);
      slugToYM.set(slug, lm);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[seo:files] blog_posts threw (${msg}) — sitemap blog <lastmod> omitted.`);
  }

  return slugToYM;
}

function assertNoPrivateInPublicUrls(publicAbsUrls, publicPathnames) {
  for (let i = 0; i < publicAbsUrls.length; i += 1) {
    const u = publicAbsUrls[i];
    const pListed = publicPathnames[i];
    const pParsed = pathnameFromAbsoluteUrl(u);
    if (isPrivateSitePath(pListed) || isPrivateSitePath(pParsed)) {
      throw new Error(`[seo:files] Assertion failed — private route leaked into SEO output: ${u}`);
    }
  }
}

function buildRobotsTxt() {
  const disallowRoots = [PRIVATE_ROUTES.ADMIN_ROOT, PRIVATE_ROUTES.TEAM_ROOT].map((root) =>
    root.startsWith('/') ? root : `/${root}`,
  );

  const lines = [
    'User-agent: *',
    'Allow: /',
    '# Disallow private admin + team workspace surfaces',
    ...disallowRoots.map((d) => `Disallow: ${d}`),
    '',
    'User-agent: Googlebot',
    'Allow: /',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ];

  return lines.join('\n');
}

function buildLlmsTxt() {
  return `# BalochDev

BalochDev is an AI-first software studio. The team ships custom web apps, mobile apps, AI agents, RAG systems, LLM-powered chatbots, and related integrations for global clients (including the US, UK, and Canada).

The same studio maintains open Balochi language technology: a Balochi keyboard, Microsoft Word support, a Balochi chatbot / LLM, and Balochi music AI tooling for the Baloch community worldwide.

Statements above are factual product and scope summaries for retrieval and citation.

## Key URLs

- ${SITE_URL}/ — Home  
- ${SITE_URL}/services — Services  
- ${SITE_URL}/about — About  
- ${SITE_URL}/technologies — Technologies  
- ${SITE_URL}/blog — Blog  
- ${SITE_URL}/contact — Contact  
`;
}

async function main() {
  hydrateProcessEnvFromClientDotEnv();

  await fsPromises.access(DIST).catch(() => {
    console.error('[seo:files] dist/ missing — run `npm run build` first.');
    process.exit(1);
  });

  let raw;
  try {
    raw = await fsPromises.readFile(ROUTES_JSON, 'utf8');
  } catch {
    console.error('[seo:files] Missing .routes/all-routes.json — run `npm run routes:enumerate` first.');
    process.exit(1);
  }

  /** @type {{ urls?: unknown }} */
  const data = JSON.parse(raw);
  const manifestUrls = Array.isArray(data.urls) ? data.urls.map((u) => String(u).trim()) : [];

  /** @type {string[]} */
  const publicUrls = [];
  /** @type {string[]} */
  const publicPaths = [];

  for (const abs of manifestUrls) {
    const pathname = pathnameFromAbsoluteUrl(abs);
    if (isPrivateSitePath(pathname)) continue;
    publicUrls.push(abs);
    publicPaths.push(pathname);
  }

  assertNoPrivateInPublicUrls(publicUrls, publicPaths);

  const slugLastmods = await fetchBlogSlugLastmods();

  /** @type {string[]} */
  const urlFragments = [];

  urlFragments.push('<?xml version="1.0" encoding="UTF-8"?>');
  urlFragments.push(`<urlset xmlns="${escapeXml(SITEMAP_NS)}">`);

  for (const absUrl of publicUrls) {
    const pathname = pathnameFromAbsoluteUrl(absUrl);
    urlFragments.push('  <url>');
    urlFragments.push(`    <loc>${escapeXml(absUrl)}</loc>`);

    const slug = blogSlugFromPathname(pathname);
    if (slug) {
      const lm = slugLastmods.get(slug);
      if (lm) {
        urlFragments.push(`    <lastmod>${escapeXml(lm)}</lastmod>`);
      }
    }

    urlFragments.push('  </url>');
  }

  urlFragments.push('</urlset>');
  urlFragments.push('');

  const sitemapXml = urlFragments.join('\n');
  await fsPromises.writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml, 'utf8');
  await fsPromises.writeFile(path.join(DIST, 'robots.txt'), buildRobotsTxt(), 'utf8');
  await fsPromises.writeFile(path.join(DIST, 'llms.txt'), buildLlmsTxt(), 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
