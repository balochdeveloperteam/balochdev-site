/**
 * Static prerender via Playwright: loads vite-preview with the production bundle,
 * captures document.documentElement.outerHTML after React + react-helmet-async run.
 *
 * Prerequisites: npm run build (vite client bundle in dist/).
 * Routes: reads client/.routes/all-routes.json (run routes:enumerate if missing).
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import { createConnection, createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { loadSanitizedBlogPostsMap } from './lib/blogPrerenderData.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.join(__dirname, '..');
const DIST = path.join(CLIENT_ROOT, 'dist');
const ROUTES_JSON = path.join(CLIENT_ROOT, '.routes', 'all-routes.json');

/**
 * Mirrors Vite's dev/build env injection for vars that vite build already saw in .env
 * — this Node worker does not inherit that unless we hydrate process.env explicitly.
 */
function hydrateProcessEnvFromClientDotEnv() {
  try {
    const fp = path.join(CLIENT_ROOT, '.env');
    if (!existsSync(fp)) return;
    const raw = readFileSync(fp, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const m = /^([\w.-]+)=(.*)$/.exec(line);
      if (!m) continue;
      const k = m[1];
      /** Only hydrate VITE_* build-time keys Supabase enumeration already relies on — never override explicit env */
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

const PREVIEW_HOST = process.env.PRERENDER_HOST || '127.0.0.1';
const _envPortRaw = parseInt(process.env.PRERENDER_PORT ?? '', 10);
/** When unset, bind an ephemeral preview port so a stale vite preview can't break CI. */
const PREVIEW_PORT = Number.isFinite(_envPortRaw) ? _envPortRaw : null;

async function allocatePreviewPortFallback() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, PREVIEW_HOST, () => {
      try {
        const addr = s.address();
        const p = typeof addr === 'object' && addr?.port ? addr.port : null;
        s.close(() => {
          if (p) resolve(p);
          else reject(new Error('No preview port allocated'));
        });
      } catch (e) {
        reject(e);
      }
    });
    s.on('error', reject);
  });
}

/** Mirrors client SEO base URL normalization (canonical / og:url). */
function canonUrlKey(u) {
  try {
    const x = new URL(u);
    if (x.pathname === '/' || x.pathname === '') return x.origin;
    return x.origin + x.pathname.replace(/\/+$/, '');
  } catch {
    return '';
  }
}

const HOME_HELMET_TITLE = 'BalochDev — AI, Web & Mobile Development Studio';
const HOME_META_DESC_NEEDLE =
  'BalochDev builds AI-native products, web and mobile apps, RAG systems and chatbots for global clients';

/** React 19 + react-helmet-async can temporarily leave overlapping <Seo /> tags; prune to this route before saving HTML. */
async function stabilizeHeadTags(page, pageAbsoluteUrl) {
  const expectedKey = canonUrlKey(pageAbsoluteUrl);
  const siteRootKey = canonUrlKey('https://balochdev.com');
  await page.evaluate(
    ({ expectedKey: exp, siteRoot, homeTitle, homeDescNeedle }) => {
      function canon(u) {
        try {
          const x = new URL(u);
          if (x.pathname === '/' || x.pathname === '') return x.origin;
          return x.origin + x.pathname.replace(/\/+$/, '');
        } catch {
          return '';
        }
      }

      const head = document.head;
      if (!head || !exp) return;

      const pageIsHome = exp === siteRoot;

      [...head.querySelectorAll('link[rel="canonical"]')].forEach((l) => {
        if (canon(l.href) !== exp) l.remove();
      });

      [...head.querySelectorAll('meta[property="og:url"]')].forEach((m) => {
        const c = m.getAttribute('content');
        if (!c || canon(c) !== exp) m.remove();
      });

      if (!pageIsHome) {
        [...head.querySelectorAll('meta[property="og:title"]')].forEach((m) => {
          const t = (m.getAttribute('content') || '').trim();
          if (t === homeTitle.trim()) m.remove();
        });
        [...head.querySelectorAll('meta[property="og:description"]')].forEach((m) => {
          const t = (m.getAttribute('content') || '').trim();
          if (homeDescNeedle && t.includes(homeDescNeedle)) m.remove();
        });
        [...head.querySelectorAll('meta[name="twitter:title"]')].forEach((m) => {
          const t = (m.getAttribute('content') || '').trim();
          if (t === homeTitle.trim()) m.remove();
        });
        [...head.querySelectorAll('meta[name="twitter:description"]')].forEach((m) => {
          const t = (m.getAttribute('content') || '').trim();
          if (homeDescNeedle && t.includes(homeDescNeedle)) m.remove();
        });

        [...document.querySelectorAll('script[type="application/ld+json"]')].forEach((s) => {
          try {
            const data = JSON.parse(s.textContent || '{}');
            if (
              data &&
              data['@type'] === 'Organization' &&
              data.url &&
              canon(data.url) === siteRoot
            ) {
              s.remove();
            }
          } catch {
            /* keep */
          }
        });
      }

      function dedupeMetaBySig(selector) {
        const seen = new Set();
        const metas = [...head.querySelectorAll(selector)].reverse();
        metas.forEach((m) => {
          const prop = m.getAttribute('property') || m.getAttribute('name') || '';
          const cont = m.getAttribute('content') || '';
          const sig = `${prop}|${cont}`;
          if (seen.has(sig)) m.remove();
          else seen.add(sig);
        });
      }

      dedupeMetaBySig('meta[property^="og:"]');
      dedupeMetaBySig('meta[name^="twitter:"]');
      dedupeMetaBySig('meta[name="robots"]');

      /** Helmet/React 19 can leave ld+json scripts under #root until hoisting completes — move before saving so view-source sees them next to titles. */
      [...document.querySelectorAll('script[type="application/ld+json"]')].forEach((s) => {
        if (!head.contains(s)) head.appendChild(s);
      });
      const ogTitles = [...head.querySelectorAll('meta[property="og:title"]')];
      const wantTitleRaw = ogTitles.at(-1)?.getAttribute('content');

      [...head.querySelectorAll('title')].forEach((t) => {
        const txt = (t.textContent || '').trim();
        if (!wantTitleRaw || !txt) return;
        const a = txt.replace(/\s+/g, ' ');
        const b = wantTitleRaw.trim().replace(/\s+/g, ' ');
        if (a !== b) t.remove();
      });

      const ogDescs = [...head.querySelectorAll('meta[property="og:description"]')];
      const wantDescRaw = ogDescs.at(-1)?.getAttribute('content');

      [...head.querySelectorAll('meta[name="description"]')].forEach((m) => {
        const c = m.getAttribute('content');
        if (wantDescRaw && c !== wantDescRaw) m.remove();
      });

      const jsonSeen = new Set();
      [...head.querySelectorAll('script[type="application/ld+json"]')].reverse().forEach((s) => {
        const raw = s.textContent || '';
        const key = raw.replace(/\s+/g, '').slice(0, 4096);
        if (jsonSeen.has(key)) s.remove();
        else jsonSeen.add(key);
      });
    },
    {
      expectedKey,
      siteRoot: siteRootKey,
      homeTitle: HOME_HELMET_TITLE,
      homeDescNeedle: HOME_META_DESC_NEEDLE,
    },
  );
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

function extractBlogSlugFromPathname(entryPath) {
  const m = /^\/blog\/([^/?#]+)$/.exec(entryPath);
  return m ? decodeURIComponent(m[1]).trim() : null;
}

function viteConfiguredApiOrigin() {
  const viteRaw = (process.env.VITE_API_URL ?? '').trim();
  if (!viteRaw) return null;
  let baseTrim = viteRaw.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(baseTrim)) baseTrim = `https://${baseTrim}`;
  try {
    return new URL(baseTrim).origin;
  } catch {
    return null;
  }
}

/**
 * Mirrors runtime apiUrl (/api/blog/:slug): same-origin when bundle has empty base, else bundled API origin(s).
 */
function slugFromBlogApiRequestUrl(absRequestUrl, previewBaseHref) {
  let req;
  try {
    req = new URL(absRequestUrl);
  } catch {
    return null;
  }

  const previewOrigin = new URL(previewBaseHref).origin;
  const viteOrigin = viteConfiguredApiOrigin();

  const originsOk = new Set([previewOrigin]);
  if (viteOrigin) originsOk.add(viteOrigin);

  /** Local dev ergonomics for apiUrl(...) hitting 127 vs localhost with different origins. */
  for (const o of [...originsOk]) {
    try {
      const u = new URL(o);
      const h = u.hostname;
      if (h !== 'localhost' && h !== '127.0.0.1') continue;
      u.hostname = h === 'localhost' ? '127.0.0.1' : 'localhost';
      originsOk.add(u.origin);
    } catch {
      /* ignore */
    }
  }

  if (!originsOk.has(req.origin)) return null;

  const m = /^\/api\/blog\/([^/?#]+)$/.exec(req.pathname || '');
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]).trim();
  } catch {
    return null;
  }
}

/** @returns {(p: string) => boolean} */
function createShouldPrerenderPath(blogSlugWhitelistSet) {
  return function shouldPrerenderPath(entryPath) {
    if (entryPath === '/') return true;
    if (entryPath === '/blog') return true;
    if (/^\/blog\/.+$/.test(entryPath)) {
      const slug = extractBlogSlugFromPathname(entryPath);
      return !!slug && blogSlugWhitelistSet.has(slug);
    }
    return true;
  };
}

async function injectBlogBootstrapJson(page, slug, postPayload) {
  await page.evaluate(
    ({ slug, post }) => {
      document.getElementById('balochdev-blog-bootstrap')?.remove();
      const script = document.createElement('script');
      script.type = 'application/json';
      script.id = 'balochdev-blog-bootstrap';
      script.textContent = JSON.stringify({ slug, post }).replace(/</g, '\\u003c');
      (document.body || document.documentElement).appendChild(script);
    },
    { slug, post: postPayload },
  );
}

function diskPathForPathname(pathname) {
  const p = pathname === '/' ? '' : pathname.replace(/^\//, '');
  if (!p) return path.join(DIST, 'index.html');
  return path.join(DIST, ...p.split('/').filter(Boolean), 'index.html');
}

async function waitForPreviewReady(host, port, tries = 80) {
  for (let i = 0; i < tries; i += 1) {
    try {
      await new Promise((resolve, reject) => {
        const c = createConnection({ host, port }, () => {
          c.destroy();
          resolve(null);
        });
        c.on('error', reject);
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  return false;
}

function startPreview(port) {
  return spawn('npx', ['vite', 'preview', '--host', PREVIEW_HOST, '--port', String(port), '--strictPort'], {
    cwd: CLIENT_ROOT,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env },
  });
}

async function ensureRoutesManifest() {
  try {
    await fs.access(ROUTES_JSON);
  } catch {
    console.info('[prerender] Missing .routes/all-routes.json — running npm run routes:enumerate');
    await runRoutesEnumerate();
  }
}

async function runRoutesEnumerate() {
  await new Promise((resolve, reject) => {
    const p = spawn('npm', ['run', 'routes:enumerate'], {
      cwd: CLIENT_ROOT,
      shell: true,
      stdio: 'inherit',
      env: { ...process.env },
    });
    p.on('error', reject);
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`routes:enumerate exit ${code}`))));
  });
}

function countManifestIndividualBlogUrls(urlArr) {
  return urlArr.filter((u) => /^\/blog\/.+$/.test(pathnameFromAbsoluteUrl(String(u).trim()))).length;
}

async function main() {
  hydrateProcessEnvFromClientDotEnv();

  await ensureRoutesManifest();
  await fs.access(DIST).catch(() => {
    console.error('[prerender] dist/ missing — run vite build first (npm run prerender wraps this)');
    process.exit(1);
  });

  const { bySlug: supabasePosts, querySucceeded } = await loadSanitizedBlogPostsMap();
  console.info(
    '[prerender] Supabase blog rows (sanitized map size / query ok):',
    supabasePosts.size,
    '/',
    querySucceeded,
  );

  let raw = await fs.readFile(ROUTES_JSON, 'utf8');
  let data = JSON.parse(raw);
  let urls = Array.isArray(data.urls) ? data.urls : [];

  /** Stale committed manifest: enumerate only adds /blog/:slug when run with env — resync without changing package scripts. */
  if (querySucceeded && supabasePosts.size > 0 && countManifestIndividualBlogUrls(urls) === 0) {
    console.info(
      '[prerender] Manifest has no /blog/:slug entries but Supabase returned published rows — running routes:enumerate to sync.',
    );
    await runRoutesEnumerate();
    raw = await fs.readFile(ROUTES_JSON, 'utf8');
    data = JSON.parse(raw);
    urls = Array.isArray(data.urls) ? data.urls : [];
  }

  /** Manifest ∩ successfully loaded Supabase rows (never trust query on failure — empty whitelist). */
  /** @type {Set<string>} */
  const blogSlugWhitelist = new Set();
  if (querySucceeded) {
    for (const u of urls) {
      const p = pathnameFromAbsoluteUrl(String(u).trim());
      const slug = extractBlogSlugFromPathname(p);
      if (slug && supabasePosts.has(slug)) blogSlugWhitelist.add(slug);
    }
  }

  const shouldPrerenderPath = createShouldPrerenderPath(blogSlugWhitelist);
  const visits = urls
    .map((u) => ({ url: String(u).trim(), path: pathnameFromAbsoluteUrl(String(u).trim()) }))
    .filter((x) => shouldPrerenderPath(x.path));

  const manifestBlogSlugCount = urls.filter((u) => /^\/blog\/.+$/.test(pathnameFromAbsoluteUrl(String(u).trim())))
    .length;

  const scheduledBlogSnapshots = visits.filter(({ path: p }) => /^\/blog\/.+$/.test(p)).length;
  console.info('[prerender] Manifest blog URLs (individual posts):', manifestBlogSlugCount);
  console.info('[prerender] Scheduled /blog/:slug snapshots (whitelist):', scheduledBlogSnapshots);
  console.info('[prerender] Non-blog-style URLs to snapshot:', visits.filter((x) => !/^\/blog\/.+$/.test(x.path)).length);
  console.info('[prerender] URLs to snapshot (total):', visits.length);

  const eligiblePostsForMock = new Map();
  for (const slug of blogSlugWhitelist) eligiblePostsForMock.set(slug, supabasePosts.get(slug));

  const previewPort = PREVIEW_PORT ?? (await allocatePreviewPortFallback());
  console.info('[prerender] vite preview port:', previewPort);

  let previewProc;
  let blogApiMockFulfillCount = 0;
  try {
    previewProc = startPreview(previewPort);
    const ok = await waitForPreviewReady(PREVIEW_HOST, previewPort);
    if (!ok) throw new Error(`Preview server did not start on ${PREVIEW_HOST}:${previewPort}`);

    const base = `http://${PREVIEW_HOST}:${previewPort}`;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      javaScriptEnabled: true,
    });

    let written = 0;
    const page = await context.newPage();

    if (scheduledBlogSnapshots > 0) {
      console.info('[prerender] Installing Playwright /api/blog/* mock (sanitized payloads only).');

      await page.route('**/*', async (route) => {
        const reqUrl = route.request().url();
        const slugMatched = slugFromBlogApiRequestUrl(reqUrl, base);
        if (!slugMatched || !blogSlugWhitelist.has(slugMatched)) {
          await route.continue();
          return;
        }

        const post = eligiblePostsForMock.get(slugMatched);
        if (!post?.title?.trim?.()) {
          throw new Error(
            `[prerender] Internal error: whitelist contains "${slugMatched}" but no sanitized post payload is available.`,
          );
        }

        blogApiMockFulfillCount += 1;

        await route.fulfill({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({ post }),
        });
      });
    }

    for (const { url: absUrlFromManifest, path: pathname } of visits) {
      const navigateTo = pathname === '/' ? `${base}/` : `${base}${pathname}`;
      await page.goto(navigateTo, { waitUntil: 'domcontentloaded', timeout: 120_000 });

      await page.waitForFunction(
        () => {
          const r = document.getElementById('root');
          return r && r.children && r.children.length > 0;
        },
        { timeout: 120_000 },
      );

      await page.waitForFunction(() => !document.querySelector('.ndx-boot'), { timeout: 12_000 });

      /** Helmet + layout settles after boot */
      await page.waitForTimeout(400);

      await stabilizeHeadTags(page, absUrlFromManifest);

      const blogSlugHit = extractBlogSlugFromPathname(pathname);
      if (blogSlugHit && blogSlugWhitelist.has(blogSlugHit)) {
        const p = eligiblePostsForMock.get(blogSlugHit);
        if (!p) {
          throw new Error(`[prerender] Missing sanitized post row for whitelist slug "${blogSlugHit}".`);
        }
        await injectBlogBootstrapJson(page, blogSlugHit, p);
      }

      const html = await page.evaluate(() => document.documentElement.outerHTML);

      /** Never ship placeholder-only blog HTML for whitelisted slugs */
      if (blogSlugHit && blogSlugWhitelist.has(blogSlugHit)) {
        const p = eligiblePostsForMock.get(blogSlugHit);
        const pageOk =
          !!p &&
          (await page.evaluate(({ titleSnippet }) => {
            if (!document.getElementById('balochdev-blog-bootstrap')) return false;

            /** Placeholder-only view uses this exact lead copy on /blog/:slug */
            const hasPlaceholder = [...document.querySelectorAll('.ndx-lead')].some((el) =>
              (el.textContent || '').includes('Loading or sample — connect API for live content.'),
            );
            if (hasPlaceholder) return false;

            const h1Txt = document.querySelector('article h1.ndx-h1')?.textContent?.trim?.() ?? '';
            if (!h1Txt || !titleSnippet) return false;
            const bodyTxt = document.body?.innerText ?? '';
            return h1Txt === titleSnippet || bodyTxt.includes(titleSnippet);
          }, { titleSnippet: p.title.trim() }));

        if (!pageOk) {
          throw new Error(`[prerender] Blog HTML validation failed for /blog/${blogSlugHit}.`);
        }
      }

      const outFile = diskPathForPathname(pathname);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, `<!DOCTYPE html>\n${html}\n`, 'utf8');
      written += 1;
      console.info('[prerender] wrote', outFile.replace(CLIENT_ROOT, ''));
    }

    if (scheduledBlogSnapshots > 0 && blogApiMockFulfillCount === 0) {
      throw new Error(
        '[prerender] FATAL: blog post pages were scheduled but Playwright fulfilled 0 /api/blog/* intercepts — aborting (likely VITE_API_URL / origin mismatch).',
      );
    }

    if (scheduledBlogSnapshots > 0) {
      console.info('[prerender] Blog API intercept fulfill hits:', blogApiMockFulfillCount);
    }

    await browser.close();
    previewProc.kill('SIGTERM');
    previewProc = null;

    console.info('[prerender] Done. HTML files:', written);
  } finally {
    if (previewProc) {
      try {
        previewProc.kill('SIGTERM');
      } catch {
        /* ignore */
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
