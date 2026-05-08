import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { apiUrl } from '../../lib/api';

export default function NBlog() {
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    document.title = 'Blog — BalochDev';
    fetch(apiUrl(`/api/blog`))
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setErr('Showing placeholder — start the API to load posts from Supabase.'));
  }, []);

  const demo = [
    { id: '1', title: 'Launch checklist for May 10', slug: 'launch-checklist', excerpt: 'Cloudflare, Supabase, and SEO checks before you cut over DNS.', published_at: null },
    { id: '2', title: 'Why we default to Postgres', slug: 'why-postgres', excerpt: 'RLS, vectors, and boring reliability.', published_at: null },
  ];

  const list = posts.length ? posts : demo;

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container">
        <p className="ndx-eyebrow">Blog</p>
        <h1 className="ndx-h1">
          Notes from <em>delivery</em>.
        </h1>
        <p className="ndx-lead">Short posts — we publish daily from the admin panel once Supabase is wired.</p>
        {err && (
          <p style={{ color: 'var(--ndx-dim)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {err}
          </p>
        )}
        <ul className="ndx-tech-list" style={{ marginTop: '1.5rem' }}>
          {list.map((p) => (
            <li key={p.id}>
              <Link to={`/blog/${p.slug}`} className="ndx-tech-card">
                <div className="ndx-tech-abbr">▸</div>
                <div>
                  <div className="ndx-tech-name">{p.title}</div>
                  <p className="ndx-tech-blurb">{p.excerpt || 'Read more'}</p>
                </div>
                <span className="ndx-tech-arrow bx bx-right-arrow-alt" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
