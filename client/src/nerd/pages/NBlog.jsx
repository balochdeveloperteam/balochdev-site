import { useEffect, useMemo, useState } from 'react';

import { apiUrl } from '../../lib/api';
import Seo from '../seo/Seo';
import BlogCard from './blog/BlogCard';
import './blog/blog.css';

export default function NBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    fetch(apiUrl('/api/blog'))
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return [...set].sort();
  }, [posts]);

  const tags = useMemo(() => {
    const set = new Set();
    for (const p of posts) {
      for (const t of p.tags || []) set.add(t);
    }
    return [...set].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts
      .filter((p) => {
        if (category && p.category !== category) return false;
        if (tag && !(p.tags || []).includes(tag)) return false;
        if (!q) return true;
        const hay = `${p.title} ${p.excerpt_plain || p.excerpt || ''}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
  }, [posts, search, category, tag]);

  const featured = useMemo(() => {
    if (filtered.length < 4) return [];
    return [...filtered].sort((a, b) => (b.like_count || 0) - (a.like_count || 0)).slice(0, 3);
  }, [filtered]);

  const featuredIds = new Set(featured.map((p) => p.id));
  const gridPosts = featured.length ? filtered.filter((p) => !featuredIds.has(p.id)) : filtered;

  return (
    <section className="ndx-section ndx-blog-feed">
      <Seo
        title="Blog — BalochDev"
        description="Notes from BalochDev on AI, web and mobile development, Supabase backends, and Balochi language technology."
        canonicalPath="/blog"
        type="website"
      />
      <div className="ndx-container">
        <header className="ndx-blog-feed__header">
          <p className="ndx-eyebrow">Community</p>
          <h1 className="ndx-h1">
            Notes from <em>delivery</em>.
          </h1>
          <p className="ndx-lead">
            Articles, insights, and updates from the BalochDev team — like, comment, and share.
          </p>
        </header>

        <div className="ndx-blog-feed__toolbar">
          <input
            type="search"
            className="ndx-blog-feed__search"
            placeholder="Search titles and excerpts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search blog posts"
          />
          <div className="ndx-blog-feed__filters">
            <button
              type="button"
              className={`ndx-blog-feed__chip${!category && !tag ? ' is-active' : ''}`}
              onClick={() => { setCategory(''); setTag(''); }}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`ndx-blog-feed__chip${category === c ? ' is-active' : ''}`}
                onClick={() => { setCategory(c); setTag(''); }}
              >
                {c}
              </button>
            ))}
            {tags.slice(0, 8).map((t) => (
              <button
                key={t}
                type="button"
                className={`ndx-blog-feed__chip${tag === t ? ' is-active' : ''}`}
                onClick={() => { setTag(t); setCategory(''); }}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="ndx-lead">Loading posts…</p>
        ) : !filtered.length ? (
          <p className="ndx-blog-empty">No posts match your filters.</p>
        ) : (
          <>
            {featured.length ? (
              <div className="ndx-blog-feed__featured">
                <p className="ndx-blog-feed__featured-label">Most liked</p>
                <div className="ndx-blog-grid">
                  {featured.map((p) => (
                    <BlogCard key={p.id} post={p} />
                  ))}
                </div>
              </div>
            ) : null}
            <div className="ndx-blog-grid">
              {gridPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
