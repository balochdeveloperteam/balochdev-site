import { Link } from 'react-router-dom';

import BlogCategoriesAside from './BlogCategoriesAside';

/**
 * Sticky right sidebar for single post pages.
 * @param {{ summary?: string, relatedPosts?: { slug: string, title: string }[] }} props
 */
export default function BlogPostSidebar({ summary, relatedPosts = [] }) {
  const hasSummary = Boolean(String(summary || '').trim());

  return (
    <aside className="ndx-blog-article__sidebar" aria-label="Post sidebar">
      {hasSummary ? (
        <div className="ndx-blog-aside-card">
          <h2 className="ndx-blog-aside-card__title">Key takeaways</h2>
          <div className="ndx-blog-aside-summary">{summary.trim()}</div>
        </div>
      ) : null}

      <BlogCategoriesAside showCounts={false} />

      {relatedPosts.length ? (
        <div className="ndx-blog-aside-card">
          <h2 className="ndx-blog-aside-card__title">Related articles</h2>
          <ul className="ndx-blog-aside-related">
            {relatedPosts.map((r) => (
              <li key={r.slug}>
                <Link to={`/blog/${r.slug}`} className="ndx-blog-aside-related__link">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
