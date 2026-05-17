import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { apiUrl } from '../../lib/api';
import Seo from '../seo/Seo';

const BOOTSTRAP_ID = 'balochdev-blog-bootstrap';

function readBlogBootstrap(slug) {
  const el = document.getElementById(BOOTSTRAP_ID);
  if (!el?.textContent?.trim()) return null;
  let parsed;
  try {
    parsed = JSON.parse(el.textContent);
  } catch {
    return null;
  }
  if (!parsed || parsed.slug !== slug || !parsed.post) return null;

  const p = parsed.post;
  const title = typeof p.title === 'string' ? p.title.trim() : '';
  if (!title) return null;

  return {
    ...p,
    title,
    excerpt: typeof p.excerpt === 'string' ? p.excerpt : undefined,
    body_html: typeof p.body_html === 'string' ? p.body_html : '',
  };
}

export default function NBlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(() => (slug ? readBlogBootstrap(slug) : null));

  useEffect(() => {
    if (!slug) return undefined;

    let cancelled = false;
    fetch(apiUrl(`/api/blog/${slug}`))
      .then(async (response) => {
        if (!response.ok || cancelled) return;

        let data;
        try {
          data = await response.json();
        } catch {
          return;
        }
        const incoming = data?.post;
        if (
          cancelled ||
          !incoming ||
          typeof incoming.title !== 'string' ||
          !incoming.title.trim()
        ) {
          return;
        }

        const title = incoming.title.trim();
        const body =
          typeof incoming.body_html === 'string'
            ? incoming.body_html
            : undefined;

        setPost((prev) => ({
          ...incoming,
          title,
          body_html:
            body !== undefined
              ? body
              : (prev && typeof prev.body_html === 'string'
                  ? prev.body_html
                  : ''),
          excerpt:
            typeof incoming.excerpt === 'string'
              ? incoming.excerpt
              : prev?.excerpt,
        }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const metaDescription =
    post && typeof post.excerpt === 'string' && post.excerpt.trim()
      ? post.excerpt.replace(/<[^>]*>/g, '').trim().slice(0, 155)
      : post
        ? `Notes from BalochDev on ${post.title} — AI, development and Balochi language tech.`
        : '';

  if (!post) {
    return (
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <p className="ndx-eyebrow">Blog</p>
          <h1 className="ndx-h1">Post</h1>
          <p className="ndx-lead">Loading or sample — connect API for live content.</p>
          <Link to="/blog" className="ndx-btn">
            ← Back
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="ndx-section" style={{ paddingTop: '3rem' }}>
      <Seo
        title={`${post.title} — BalochDev`}
        description={metaDescription}
        canonicalPath={`/blog/${slug}`}
        type="article"
      />
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Blog</p>
        <h1 className="ndx-h1" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          {post.title}
        </h1>
        <div
          className="ndx-lead"
          style={{ maxWidth: 'none' }}
          dangerouslySetInnerHTML={{ __html: post.body_html || '<p>(No body)</p>' }}
        />
        <Link to="/blog" className="ndx-btn" style={{ marginTop: '2rem' }}>
          ← All posts
        </Link>
      </div>
    </article>
  );
}
