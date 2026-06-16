import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { apiUrl } from '../../lib/api';
import { blogCategoryUrl } from '../lib/blogCategories';
import {
  blogSeoDescription,
  blogSeoTitle,
  buildBlogArticleJsonLd,
  buildBlogBreadcrumbJsonLd,
  formatBlogDate,
} from '../lib/blogSeo';
import { getVisitorKey } from '../lib/visitorKey';
import Seo from '../seo/Seo';
import BlogAvatar from './blog/BlogAvatar';
import BlogBreadcrumb from './blog/BlogBreadcrumb';
import BlogCard from './blog/BlogCard';
import BlogComments from './blog/BlogComments';
import BlogLikeButton from './blog/BlogLikeButton';
import BlogPostSidebar from './blog/BlogPostSidebar';
import BlogShareRow from './blog/BlogShareRow';
import SocialLinksRow from '../components/SocialLinksRow';
import { useBlogAds } from '../lib/useBlogAds';
import './blog/blog.css';
import BlogAdvertiseCta from './blog/BlogAdvertiseCta';

const BOOTSTRAP_ID = 'balochdev-blog-bootstrap';

function normalizePost(p) {
  if (!p || typeof p.title !== 'string' || !p.title.trim()) return null;
  const bodyHtml =
    typeof p.body_html === 'string'
      ? p.body_html
      : typeof p.content_html === 'string'
        ? p.content_html
        : '';
  return { ...p, title: p.title.trim(), body_html: bodyHtml };
}

function readBlogBootstrap(slug) {
  const el = document.getElementById(BOOTSTRAP_ID);
  if (!el?.textContent?.trim()) return null;
  try {
    const parsed = JSON.parse(el.textContent);
    if (!parsed || parsed.slug !== slug) return null;
    const post = normalizePost(parsed.post);
    if (!post) return null;
    return {
      post,
      comments: Array.isArray(parsed.comments) ? parsed.comments : [],
      postLiked: !!parsed.post_liked,
    };
  } catch {
    return null;
  }
}

export default function NBlogPost() {
  const { slug } = useParams();
  const bootstrap = slug ? readBlogBootstrap(slug) : null;
  const ads = useBlogAds();

  const [post, setPost] = useState(bootstrap?.post ?? null);
  const [comments, setComments] = useState(bootstrap?.comments ?? []);
  const [postLiked, setPostLiked] = useState(bootstrap?.postLiked ?? false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;

    fetch(apiUrl(`/api/blog/${slug}`))
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 404) {
          setMissing(true);
          return;
        }
        if (!response.ok) return;
        const data = await response.json().catch(() => null);
        const incoming = normalizePost(data?.post);
        if (cancelled || !incoming) return;
        setPost((prev) => ({ ...prev, ...incoming }));
        setMissing(false);
      })
      .catch(() => {});

    const vk = getVisitorKey();
    fetch(apiUrl(`/api/blog/${slug}/comments?visitor_key=${encodeURIComponent(vk)}`))
      .then(async (res) => {
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.comments)) setComments(data.comments);
        if (typeof data.post_liked === 'boolean') setPostLiked(data.post_liked);
        if (typeof data.like_count === 'number') {
          setPost((prev) => (prev ? { ...prev, like_count: data.like_count } : prev));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const jsonLd = useMemo(() => {
    if (!post) return null;
    return [buildBlogArticleJsonLd(post, comments), buildBlogBreadcrumbJsonLd(post)];
  }, [post, comments]);

  const breadcrumbItems = useMemo(() => {
    if (!post) return [];
    const items = [
      { label: 'Home', to: '/' },
      { label: 'Blog', to: '/blog' },
    ];
    if (post.category) {
      items.push({ label: post.category, to: blogCategoryUrl(post.category) });
    }
    items.push({ label: post.title });
    return items;
  }, [post]);

  const sidebarRelated = useMemo(() => {
    if (!post?.related_posts?.length) return [];
    return post.related_posts.map((r) => ({ slug: r.slug, title: r.title }));
  }, [post]);

  if (missing) {
    return (
      <section className="ndx-section ndx-blog-article">
        <div className="ndx-container ndx-blog-article__wrap">
          <h1 className="ndx-h1">Post not found</h1>
          <Link to="/blog" className="ndx-btn">← All posts</Link>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="ndx-section ndx-blog-article">
        <div className="ndx-container ndx-blog-article__wrap">
          <p className="ndx-eyebrow">Blog</p>
          <p className="ndx-lead">Loading…</p>
        </div>
      </section>
    );
  }

  const ogImage = post.og_image_url || post.cover_image_url || undefined;
  const isImageCaption = post.post_type === 'image_caption';

  return (
    <article className="ndx-section ndx-blog-article">
      <Seo
        title={blogSeoTitle(post)}
        description={blogSeoDescription(post)}
        canonicalPath={`/blog/${slug}`}
        ogImage={ogImage}
        type="article"
        jsonLd={jsonLd}
      />
      <div className="ndx-container ndx-blog-article__wrap">
        <BlogBreadcrumb items={breadcrumbItems} />

        {post.cover_image_url ? (
          <div className="ndx-blog-article__hero">
            <img
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              width={1200}
              height={630}
              loading="eager"
            />
          </div>
        ) : null}

        <div className="ndx-blog-article__layout">
          <div className="ndx-blog-article__main">
            <header className="ndx-blog-article__header">
              <p className="ndx-eyebrow">
                {post.category ? (
                  <Link to={blogCategoryUrl(post.category)} className="ndx-blog-article__cat-link">
                    {post.category}
                  </Link>
                ) : null}
                {post.category ? ' · ' : ''}
                Blog
              </p>
              <h1 className="ndx-h1 ndx-blog-article__title">{post.title}</h1>
              <div className="ndx-blog-article__byline">
                <BlogAvatar name={post.author_name} url={post.author_avatar_url} />
                <span>{post.author_name}</span>
                {post.published_at ? (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={post.published_at}>{formatBlogDate(post.published_at)}</time>
                  </>
                ) : null}
                {post.reading_time_minutes ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>{post.reading_time_minutes} min read</span>
                  </>
                ) : null}
              </div>
            </header>

            <div
              className={`ndx-blog-prose ndx-blog-prose--in-main${isImageCaption ? ' ndx-blog-prose--caption' : ''}`}
              dangerouslySetInnerHTML={{ __html: post.body_html || '<p></p>' }}
            />

            <div className="ndx-blog-article__actions">
              <BlogLikeButton
                targetType="post"
                targetId={post.id}
                initialCount={post.like_count || 0}
                initialLiked={postLiked}
              />
              <BlogShareRow slug={slug} title={post.title} />
            </div>

            <SocialLinksRow className="ndx-social-links--article" label="We're also on:" />

            <BlogComments
              slug={slug}
              initialComments={comments}
              commentCount={post.comment_count ?? comments.length}
            />
          </div>

          <BlogPostSidebar
            summary={post.summary}
            relatedPosts={sidebarRelated}
            sidebarAdA={ads?.post_sidebar_a}
            sidebarAdB={ads?.post_sidebar_b}
          />
        </div>

        <BlogAdvertiseCta />

        {post.related_posts?.length ? (
          <section className="ndx-blog-related" aria-labelledby="related-heading">
            <h2 id="related-heading" className="ndx-blog-related__title">Related articles</h2>
            <div className="ndx-blog-grid">
              {post.related_posts.map((r) => (
                <BlogCard key={r.id} post={r} />
              ))}
            </div>
          </section>
        ) : null}

        <nav className="ndx-blog-nav" aria-label="Post navigation">
          {post.prev_slug ? (
            <Link to={`/blog/${post.prev_slug}`}>← Previous</Link>
          ) : (
            <span />
          )}
          <Link to="/blog">All posts</Link>
          {post.next_slug ? (
            <Link to={`/blog/${post.next_slug}`} style={{ textAlign: 'right' }}>
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  );
}
