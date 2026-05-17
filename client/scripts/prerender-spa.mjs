/**
 * Static prerender via Playwright: loads vite-preview with the production bundle,
 * captures document.documentElement.outerHTML after React + react-helmet-async run.
 *
 * Prerequisites: npm run build (vite client bundle in dist/).
 * Routes: reads client/.routes/all-routes.json (run routes:enumerate if missing).
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { createConnection, createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.join(__dirname, '..');
const DIST = path.join(CLIENT_ROOT, 'dist');
const ROUTES_JSON = path.join(CLIENT_ROOT, '.routes', 'all-routes.json');

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

/** Skip /blog/:slug (individual posts); keep /blog listing. Static 404 routes are not enumerated. */
function shouldPrerenderPath(p) {
  if (p === '/') return true;
  if (/^\/blog\/.+$/.test(p)) return false;
  return true;
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
    await new Promise((resolve, reject) => {
      const p = spawn('npm', ['run', 'routes:enumerate'], {
        cwd: CLIENT_ROOT,
        shell: true,
        stdio: 'inherit',
      });
      p.on('error', reject);
      p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`routes:enumerate exit ${code}`))));
    });
  }
}

async function main() {
  await ensureRoutesManifest();
  await fs.access(DIST).catch(() => {
    console.error('[prerender] dist/ missing — run vite build first (npm run prerender wraps this)');
    process.exit(1);
  });

  const raw = await fs.readFile(ROUTES_JSON, 'utf8');
  const data = JSON.parse(raw);
  const urls = Array.isArray(data.urls) ? data.urls : [];
  const toVisit = urls.map((u) => ({ url: String(u).trim(), path: pathnameFromAbsoluteUrl(u) })).filter((x) => shouldPrerenderPath(x.path));

  console.info('[prerender] URLs to snapshot:', toVisit.length);

  const previewPort = PREVIEW_PORT ?? (await allocatePreviewPortFallback());
  console.info('[prerender] vite preview port:', previewPort);

  let previewProc;
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

    /** index.html runs the theme bootstrap before bundle load; snapshots include that markup only (no extra Playwright patching). */
    let written = 0;
    const page = await context.newPage();

    for (const { url: absUrlFromManifest, path: pathname } of toVisit) {
      const navigateTo = pathname === '/' ? `${base}/` : `${base}${pathname}`;
      await page.goto(navigateTo, { waitUntil: 'domcontentloaded', timeout: 120_000 });

      await page.waitForFunction(
        () => {
          const r = document.getElementById('root');
          return r && r.children && r.children.length > 0;
        },
        { timeout: 120_000 },
      );

      /** BootSplash (fonts.ready, max ~3280ms) must clear so #root carries real headings + copy, not the skeleton overlay. */
      await page.waitForFunction(() => !document.querySelector('.ndx-boot'), { timeout: 12_000 });
      /** Helmet + layout settles after boot */
      await page.waitForTimeout(400);

      await stabilizeHeadTags(page, absUrlFromManifest);

      const html = await page.evaluate(() => document.documentElement.outerHTML);
      const outFile = diskPathForPathname(pathname);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, `<!DOCTYPE html>\n${html}\n`, 'utf8');
      written += 1;
      console.info('[prerender] wrote', outFile.replace(CLIENT_ROOT, ''));
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
