import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { fetchPublishedPosts } from '../../lib/blogData';
import { BLOG_CATEGORIES, blogCategoryUrl } from '../lib/blogCategories';
import { useBlogAds } from '../lib/useBlogAds';
import Seo from '../seo/Seo';
import BlogAdSlot from './blog/BlogAdSlot';
import BlogCard from './blog/BlogCard';
import BlogCategoriesAside from './blog/BlogCategoriesAside';
import './blog/blog.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'liked', label: 'Most liked' },
  { value: 'commented', label: 'Most commented' },
];

function sortPosts(posts, sort) {
  const list = [...posts];
  switch (sort) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.published_at || 0) - new Date(b.published_at || 0));
    case 'liked':
      return list.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    case 'commented':
      return list.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
    default:
      return list.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
  }
}

export default function NBlog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [tag, setTag] = useState('');

  const category = searchParams.get('category') || '';
  const ads = useBlogAds();

  useEffect(() => {
    fetchPublishedPosts()
      .then((posts) => setPosts(posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => {
    const set = new Set();
    for (const p of posts) {
      for (const t of p.tags || []) set.add(t);
    }
    return [...set].sort();
  }, [posts]);

  const categoryCounts = useMemo(() => {
    /** @type {Record<string, number>} */
    const counts = { __all: posts.length };
    for (const cat of BLOG_CATEGORIES) counts[cat] = 0;
    for (const p of posts) {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    }
    return counts;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matched = posts.filter((p) => {
      if (category && p.category !== category) return false;
      if (tag && !(p.tags || []).includes(tag)) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.excerpt_plain || p.excerpt || ''}`.toLowerCase();
      return hay.includes(q);
    });
    return sortPosts(matched, sort);
  }, [posts, search, category, tag, sort]);

  const featured = useMemo(() => {
    if (sort !== 'newest' || filtered.length < 4) return [];
    return [...filtered].sort((a, b) => (b.like_count || 0) - (a.like_count || 0)).slice(0, 3);
  }, [filtered, sort]);

  const featuredIds = new Set(featured.map((p) => p.id));
  const gridPosts = featured.length ? filtered.filter((p) => !featuredIds.has(p.id)) : filtered;

  const setCategoryFilter = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set('category', cat);
    else next.delete('category');
    setSearchParams(next, { replace: true });
    setTag('');
  };

  const visibleCategories = useMemo(() => {
    const fromPosts = new Set(posts.map((p) => p.category).filter(Boolean));
    return BLOG_CATEGORIES.filter((c) => fromPosts.has(c) || category === c);
  }, [posts, category]);

  return (
    <section className="ndx-section ndx-blog-feed">
      <Seo
        title={category ? `${category} — Blog — BalochDev` : 'Blog — BalochDev'}
        description="Notes from BalochDev on AI, web and mobile development, Supabase backends, and Balochi language technology."
        canonicalPath={category ? `/blog/?category=${encodeURIComponent(category)}` : '/blog/'}
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

        <div className="ndx-blog-feed__layout">
          <main className="ndx-blog-feed__main">
            {ads?.blog_hero?.image_url ? (
              <BlogAdSlot ad={ads.blog_hero} variant="hero" />
            ) : null}

            <div className="ndx-blog-feed__toolbar">
              <input
                type="search"
                className="ndx-blog-feed__search"
                placeholder="Search titles and excerpts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search blog posts"
              />
              <select
                className="ndx-blog-feed__sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort posts"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="ndx-blog-feed__filters">
              <button
                type="button"
                className={`ndx-blog-feed__chip${!category && !tag ? ' is-active' : ''}`}
                onClick={() => { setCategoryFilter(''); setTag(''); }}
              >
                All
              </button>
              {visibleCategories.map((c) => (
                <Link
                  key={c}
                  to={blogCategoryUrl(c)}
                  className={`ndx-blog-feed__chip${category === c ? ' is-active' : ''}`}
                  onClick={() => setTag('')}
                >
                  {c}
                </Link>
              ))}
              {tags.slice(0, 8).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`ndx-blog-feed__chip${tag === t ? ' is-active' : ''}`}
                  onClick={() => { setTag(t); setCategoryFilter(''); }}
                >
                  #{t}
                </button>
              ))}
            </div>

            {category ? (
              <p className="ndx-blog-feed__active-filter">
                Showing posts in <strong>{category}</strong>
                {' · '}
                <Link to="/blog/">Clear filter</Link>
              </p>
            ) : null}

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
          </main>

          <aside className="ndx-blog-feed__sidebar" aria-label="Blog sidebar">
            <BlogCategoriesAside
              counts={categoryCounts}
              activeCategory={category}
              showCounts
            />
            {ads?.post_sidebar_a?.image_url ? (
              <BlogAdSlot ad={ads.post_sidebar_a} variant="sidebar" />
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
