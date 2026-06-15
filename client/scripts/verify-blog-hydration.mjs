/**
 * Simulate failed /api/blog refetch after prerender bootstrap (Unreachable API).
 * Run from client/: node scripts/verify-blog-hydration.mjs (requires vite build + npm run prerender first).
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { createConnection, createServer } from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.join(__dirname, '..');
const DIST = path.join(CLIENT_ROOT, 'dist');

const HOST = '127.0.0.1';

async function allocPort() {
  return await new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, HOST, () => {
      try {
        const addr = s.address();
        const p = typeof addr === 'object' && addr?.port ? addr.port : null;
        s.close(() => (p ? resolve(p) : reject(new Error('no port'))));
      } catch (e) {
        reject(e);
      }
    });
    s.on('error', reject);
  });
}

function waitTcp(port, tries = 60) {
  return new Promise((resolve) => {
    let n = 0;
    function tryOnce() {
      const c = createConnection({ host: HOST, port }, () => {
        c.destroy();
        resolve(true);
      });
      c.on('error', () => {
        n += 1;
        if (n >= tries) resolve(false);
        else setTimeout(tryOnce, 150);
      });
    }
    tryOnce();
  });
}

function firstPrerenderedBlogSlug() {
  const blogRoot = path.join(DIST, 'blog');
  if (!fs.existsSync(blogRoot)) return null;

  for (const name of fs.readdirSync(blogRoot)) {
    const dir = path.join(blogRoot, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (fs.existsSync(path.join(dir, 'index.html'))) return name;
  }
  return null;
}

async function main() {
  const slug = firstPrerenderedBlogSlug();
  if (!slug) {
    console.error('[hydration-verify] No dist/blog/*/index.html found — build + prerender a blog slug first.');
    process.exit(1);
  }

  const port = await allocPort();
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--host', HOST, '--port', String(port), '--strictPort'],
    { cwd: CLIENT_ROOT, shell: true, stdio: 'pipe' },
  );

  /** eslint-disable-next-line no-console */
  preview.stderr?.on('data', () => {});
  preview.stdout?.on('data', () => {});

  if (!(await waitTcp(port))) {
    preview.kill('SIGTERM');
    console.error('[hydration-verify] Preview did not start.');
    process.exit(1);
  }

  const diskHtmlPath = path.join(DIST, 'blog', slug, 'index.html');
  /** Vite preview is SPA-first; nested prerender paths may fall back to dist/index.html. Fulfill navigation from disk like static hosts do. */
  const diskHtml = fs.readFileSync(diskHtmlPath, 'utf8');
  const hasBootstrapDisk = diskHtml.includes('balochdev-blog-bootstrap');
  console.log('[hydration-verify] disk snapshot has bootstrap script:', hasBootstrapDisk);

  const base = `http://${HOST}:${port}`;
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      javaScriptEnabled: true,
    });
    const page = await ctx.newPage();

    await page.route('**/*', async (route) => {
      let u;
      try {
        u = new URL(route.request().url());
      } catch {
        await route.continue();
        return;
      }

      if (u.pathname.includes('/api/blog/')) {
        await route.abort('failed');
        return;
      }

      const norm = u.pathname.replace(/\/+$/, '') || '/';
      const wantsPost =
        norm === `/blog/${slug}` ||
        norm === `/blog/${encodeURIComponent(slug)}` ||
        norm === `/blog/${decodeURIComponent(slug)}`;

      if (route.request().resourceType() === 'document' && wantsPost) {
        await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: diskHtml });
        return;
      }

      await route.continue();
    });

    await page.goto(`${base}/blog/${slug}`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
    const bootstrapAfterNav = await page.evaluate(
      () => !!document.getElementById('balochdev-blog-bootstrap'),
    );
    console.log('[hydration-verify] slug:', slug);
    console.log('[hydration-verify] bootstrap present immediately after navigation:', bootstrapAfterNav);

    await page.waitForFunction(
      () =>
        !!document.querySelector('#root')?.children?.length &&
        document.querySelectorAll('.ndx-boot').length === 0,
      { timeout: 15_000 },
    );

    /** React mount + useEffect(fetch) settles */
    await page.waitForTimeout(2500);

    const verdict = await page.evaluate(() => {
      const txt = document.body?.innerText ?? '';
      const hasPlaceholder = txt.trim() === 'Loading…' || (txt.includes('Loading…') && !hasArticle);
      const hasArticle = !!document.querySelector('article h1.ndx-h1');
      return { hasPlaceholder, hasArticle, sample: txt.slice(0, 420) };
    });

    console.log('[hydration-verify] after mount + aborted /api/blog refetch:');
    console.log('  hasArticle:', verdict.hasArticle);
    console.log('  hasPlaceholderLead:', verdict.hasPlaceholder);
    if (verdict.hasPlaceholder && verdict.hasArticle) {
      console.log(
        '[hydration-verify] RESULT: PROBLEM — article content coexists with loading placeholder UI (inspect layout).',
      );
    } else if (verdict.hasPlaceholder && !verdict.hasArticle) {
      console.log('[hydration-verify] RESULT: REGRESSION — real content replaced by placeholder after JS.');
      process.exitCode = 2;
    } else if (!verdict.hasPlaceholder && verdict.hasArticle) {
      console.log('[hydration-verify] RESULT: OK — prerender content preserved; placeholder not shown.');
    } else if (!verdict.hasPlaceholder && !verdict.hasArticle) {
      console.log('[hydration-verify] RESULT: ambiguous — neither article heading nor placeholder (unexpected).');
      process.exitCode = 3;
    }
  } finally {
    if (browser) await browser.close();
    try {
      if (preview?.pid) {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/PID', String(preview.pid), '/T', '/F'], {
            stdio: 'ignore',
            shell: true,
          });
        } else {
          preview.kill('SIGTERM');
        }
      }
    } catch {
      /* ignore */
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
