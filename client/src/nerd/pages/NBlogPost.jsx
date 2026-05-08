import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { apiUrl } from '../../lib/api';

export default function NBlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(apiUrl(`/api/blog/${slug}`))
      .then((r) => r.json())
      .then((data) => setPost(data.post))
      .catch(() => setPost(null));
  }, [slug]);

  useEffect(() => {
    if (post?.title) document.title = `${post.title} — BalochDev`;
  }, [post]);

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
