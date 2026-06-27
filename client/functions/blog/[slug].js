/**
 * On-demand SSR for /blog/:slug — Cloudflare Pages Function.
 *
 * Runs ONLY when no static prerendered HTML exists at dist/blog/<slug>/index.html
 * (Pages serves static assets first; Functions handle misses). For posts that
 * existed at the last build the function never fires — the prerendered file is
 * served directly. For freshly published posts, this returns full SSR HTML so
 * crawlers see the article body, canonical, OG/Twitter, Article + Breadcrumb
 * JSON-LD, and #balochdev-blog-bootstrap — and the SPA hydrates on top without
 * a network round-trip.
 *
 * Env required on Cloudflare Pages: SUPABASE_URL, SUPABASE_ANON_KEY. Anon key +
 * RLS (already used by the client SPA for the same read) is sufficient.
 */

import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '../../src/nerd/seo/siteSeo.js';
import { buildBlogHeadHtml } from '../../src/nerd/lib/blogSeo.js';

const BLOG_POST_SELECT =
  'id, slug, title, body_html, content_html, excerpt, summary, post_type, ' +
  'cover_image_url, cover_image_alt, meta_title, meta_description, og_image_url, ' +
  'reading_time_minutes, author_name, author_member_id, published_at, updated_at, ' +
  'like_count, comment_count, tags, category, related_slugs';

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Server-rendered article block — mirrors NBlogPost.jsx's primary DOM so bots
 * see the post body in raw HTML. React hydrates over this on the client.
 */
function buildArticleBodyHtml(post) {
  const title = escapeHtml(post.title);
  const author = escapeHtml(post.author_name || 'BalochDev');
  const dateIso = post.published_at || '';
  const dateLabel = formatDate(post.published_at);
  const readingTime =
    Number(post.reading_time_minutes) > 0 ? `${post.reading_time_minutes} min read` : '';
  const category = post.category ? escapeHtml(post.category) : '';
  const categoryHref = post.category
    ? `/blog?category=${encodeURIComponent(post.category)}`
    : '';

  const coverImg = post.cover_image_url
    ? `<div class="ndx-blog-article__hero"><img src="${escapeHtml(post.cover_image_url)}" alt="${escapeHtml(post.cover_image_alt || post.title)}" width="1200" height="630" loading="eager" /></div>`
    : '';

  // Body HTML is sanitized on save by the Worker (sanitize-html allowlist).
  const bodyHtml = post.content_html || post.body_html || '<p></p>';

  return `<article class="ndx-section ndx-blog-article">
  <div class="ndx-container ndx-blog-article__wrap">
    ${coverImg}
    <div class="ndx-blog-article__layout">
      <div class="ndx-blog-article__main">
        <header class="ndx-blog-article__header">
          <p class="ndx-eyebrow">${
            category
              ? `<a class="ndx-blog-article__cat-link" href="${escapeHtml(categoryHref)}">${category}</a> · `
              : ''
          }Blog</p>
          <h1 class="ndx-h1 ndx-blog-article__title">${title}</h1>
          <div class="ndx-blog-article__byline">
            <span>${author}</span>
            ${
              dateLabel
                ? `<span aria-hidden="true">·</span><time datetime="${escapeHtml(dateIso)}">${escapeHtml(dateLabel)}</time>`
                : ''
            }
            ${
              readingTime
                ? `<span aria-hidden="true">·</span><span>${escapeHtml(readingTime)}</span>`
                : ''
            }
          </div>
        </header>
        <div class="ndx-blog-prose ndx-blog-prose--in-main">${bodyHtml}</div>
      </div>
    </div>
  </div>
</article>`;
}

function buildBootstrapScript(post) {
  return `<script id="balochdev-blog-bootstrap" type="application/json">${escapeJsonForScript(
    {
      slug: post.slug,
      post,
      comments: [],
      post_liked: false,
    },
  )}</script>`;
}

function notFoundHtml(slug) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Post not found — BalochDev</title><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="${SITE_URL}/blog"></head><body><h1>Post not found</h1><p>The post <code>${escapeHtml(slug)}</code> doesn't exist or hasn't been published.</p><p><a href="/blog">All posts</a></p></body></html>`;
}

export async function onRequestGet({ request, env, params }) {
  const slug = String(params?.slug || '').trim();

  if (!slug) {
    return new Response(notFoundHtml(''), {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
        'cache-control': 'no-store',
      },
    });
  }

  const supaUrl = env.SUPABASE_URL;
  const supaAnon = env.SUPABASE_ANON_KEY;
  if (!supaUrl || !supaAnon) {
    console.error('[blog SSR] missing SUPABASE_URL or SUPABASE_ANON_KEY env');
    return new Response('Server misconfigured', {
      status: 500,
      headers: { 'cache-control': 'no-store' },
    });
  }

  const supabase = createClient(supaUrl, supaAnon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from('blog_posts')
    .select(BLOG_POST_SELECT)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('[blog SSR] supabase error', error.message);
    return new Response('Upstream error', {
      status: 502,
      headers: { 'cache-control': 'no-store' },
    });
  }

  if (!data) {
    return new Response(notFoundHtml(slug), {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
        'cache-control': 'public, max-age=30, s-maxage=60',
      },
    });
  }

  const post = {
    ...data,
    body_html: data.content_html || data.body_html || '',
    content_html: data.content_html || data.body_html || '',
    related_slugs: Array.isArray(data.related_slugs) ? data.related_slugs : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    prev_slug: null,
    next_slug: null,
    related_posts: [],
  };

  let shellResp;
  try {
    shellResp = await env.ASSETS.fetch(new URL('/index.html', request.url));
  } catch (e) {
    console.error('[blog SSR] ASSETS.fetch threw', e?.message || e);
    return new Response('Server error', {
      status: 500,
      headers: { 'cache-control': 'no-store' },
    });
  }
  if (!shellResp || !shellResp.ok) {
    console.error('[blog SSR] index.html shell not fetched', shellResp?.status);
    return new Response('Server error', {
      status: 500,
      headers: { 'cache-control': 'no-store' },
    });
  }

  let shell = await shellResp.text();

  const headHtml = buildBlogHeadHtml(post);
  shell = shell.replace('</head>', `${headHtml}\n</head>`);

  const articleHtml = buildArticleBodyHtml(post);
  const bootstrapScript = buildBootstrapScript(post);
  // index.html ships <div id="root"></div>; replace empty root with SSR content.
  shell = shell.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${articleHtml}</div>\n    ${bootstrapScript}`,
  );

  return new Response(shell, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
      'x-robots-tag': 'index, follow',
    },
  });
}
