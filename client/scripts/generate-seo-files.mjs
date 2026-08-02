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

import { absoluteCanonicalUrl, normalizeCanonicalPath } from '../src/nerd/seo/canonicalUrl.js';
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
    return normalizeCanonicalPath(new URL(abs).pathname || '/');
  } catch {
    return '/';
  }
}

function blogSlugFromPathname(p) {
  const bare = String(p || '').replace(/\/+$/, '') || '/';
  const m = /^\/blog\/([^/?#]+)$/.exec(bare);
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
 * Prefer updated_at for blog sitemap lastmod; fall back to published_at, then created_at.
 */
function resolveBlogLastmodRow(row) {
  const candidates = [row?.updated_at, row?.published_at, row?.created_at];
  for (const v of candidates) {
    const lm = formatSitemapLastMod(v);
    if (lm) return lm;
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
      .select('slug, published_at, created_at, updated_at')
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

/**
 * Fetch published blog posts for llms.txt enumeration so AI crawlers
 * (ChatGPT, Perplexity, ClaudeBot, etc.) can discover every published article.
 * Returns posts ordered by published_at desc; empty array if Supabase unavailable.
 */
async function fetchPublishedBlogPostsForLlms() {
  /** @type {Array<{ slug: string, title: string, summary: string }>} */
  const posts = [];

  const client = tryCreateSupabaseBuildClient(() => {});
  if (!client) return posts;

  try {
    const { data, error } = await client
      .from('blog_posts')
      .select('slug, title, summary, excerpt, meta_description, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn(`[seo:files] blog_posts llms query failed (${error.message}) — llms.txt blog list omitted.`);
      return posts;
    }

    for (const row of Array.isArray(data) ? data : []) {
      const slug = typeof row?.slug === 'string' ? row.slug.trim() : '';
      const title = typeof row?.title === 'string' ? row.title.trim() : '';
      if (!slug || !title) continue;
      const rawSummary = row?.summary || row?.excerpt || row?.meta_description || '';
      const summary = String(rawSummary).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
      posts.push({ slug, title, summary });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[seo:files] blog_posts llms query threw (${msg}) — llms.txt blog list omitted.`);
  }

  return posts;
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
    '# Cloudflare email-protection / cdn-cgi artifacts (404 in GSC if crawled)',
    'Disallow: /cdn-cgi/',
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

function buildLlmsTxt(blogPosts = []) {
  const header = `# BalochDev

BalochDev is an AI-first software studio. The team ships custom web apps, mobile apps, AI agents, RAG systems, LLM-powered chatbots, and related integrations for global clients (including the US, UK, and Canada).

The same studio maintains open Balochi language technology: a Balochi keyboard, Microsoft Word support, a Balochi chatbot / LLM, and Balochi music AI tooling for the Baloch community worldwide.

Statements above are factual product and scope summaries for retrieval and citation.

## Key URLs

- [Home](${SITE_URL}/) — Studio overview, services, and recent work.
- [Services](${absoluteCanonicalUrl('/services')}) — Web, mobile, AI, automation, and integration services.
- [Technologies](${absoluteCanonicalUrl('/technologies')}) — Stack we work with (React, Next.js, Node, Supabase, AI tooling).
- [Portfolio](${absoluteCanonicalUrl('/portfolio')}) — Selected client and partner projects.
- [Apps](${absoluteCanonicalUrl('/apps')}) — BalochDev-built apps and tools.
- [About](${absoluteCanonicalUrl('/about')}) — Who we are.
- [FAQ](${absoluteCanonicalUrl('/faq')}) — Common questions about services, pricing, and process.
- [Blog](${absoluteCanonicalUrl('/blog')}) — Articles, notes, and updates.
- [Advertise](${absoluteCanonicalUrl('/advertise')}) — Reach the BalochDev audience.
- [Estimate](${absoluteCanonicalUrl('/estimate')}) — AI-assisted project estimate.
- [Contact](${absoluteCanonicalUrl('/contact')}) — Get in touch.
`;

  if (!blogPosts.length) return header;

  const lines = [header, '## Articles', ''];
  for (const post of blogPosts) {
    const url = absoluteCanonicalUrl(`/blog/${post.slug}`);
    const summary = post.summary ? ` — ${post.summary}` : '';
    lines.push(`- [${post.title}](${url})${summary}`);
  }
  lines.push('');
  return lines.join('\n');
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
    const barePrivate = pathname.replace(/\/+$/, '') || '/';
    if (pathname === '/404' || pathname === '/404/') continue;
    if (isPrivateSitePath(barePrivate)) continue;
    const canonicalAbs = absoluteCanonicalUrl(pathname);
    publicUrls.push(canonicalAbs);
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

  const blogPostsForLlms = await fetchPublishedBlogPostsForLlms();
  await fsPromises.writeFile(path.join(DIST, 'llms.txt'), buildLlmsTxt(blogPostsForLlms), 'utf8');

  const blogCount = publicUrls.filter((u) => /\/blog\/[^/]+$/.test(pathnameFromAbsoluteUrl(u))).length;
  console.info(
    `[seo:files] wrote sitemap.xml (${publicUrls.length} URLs, ${blogCount} blog posts), robots.txt, llms.txt (${blogPostsForLlms.length} articles).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
