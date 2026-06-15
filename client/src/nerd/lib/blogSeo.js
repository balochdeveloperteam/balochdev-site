import { DEFAULT_OG_IMAGE, ORGANIZATION_GRAPH_ID, SITE_URL } from '../seo/siteSeo';

function absImage(url) {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function plainDescription(post) {
  const raw = post.meta_description || post.excerpt || '';
  return String(raw).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
}

export function buildBlogArticleJsonLd(post, comments = []) {
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const headline = (post.meta_title || post.title || '').trim();
  const description = plainDescription(post);
  const image = absImage(post.og_image_url || post.cover_image_url);

  /** @type {object} */
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline,
    description,
    image: [image],
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: {
      '@type': 'Person',
      name: post.author_name || 'BalochDev',
    },
    publisher: { '@id': ORGANIZATION_GRAPH_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    url: pageUrl,
    inLanguage: 'en',
    wordCount: undefined,
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'LikeAction' },
        userInteractionCount: post.like_count || 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'CommentAction' },
        userInteractionCount: post.comment_count || comments.length || 0,
      },
    ],
  };

  if (comments.length) {
    article.comment = comments.slice(0, 20).map((c) => ({
      '@type': 'Comment',
      text: c.content,
      author: { '@type': 'Person', name: c.author_name },
      dateCreated: c.created_at,
    }));
  }

  return article;
}

export function buildBlogBreadcrumbJsonLd(post) {
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
    ],
  };
}

export function blogSeoTitle(post) {
  const t = (post.meta_title || post.title || 'Blog').trim();
  return t.includes('BalochDev') ? t : `${t} — BalochDev`;
}

export function blogSeoDescription(post) {
  const d = plainDescription(post);
  if (d) return d;
  return `Read ${post.title} on the BalochDev blog — AI, development, and Balochi language tech.`;
}

export function formatBlogDate(iso) {
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

export function authorInitials(name) {
  const parts = String(name || 'B').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] || 'B').toUpperCase();
}
