import { Link } from 'react-router-dom';

import { BLOG_CATEGORIES, blogCategoryUrl } from '../../lib/blogCategories';

/**
 * Sidebar list of all managed categories with optional post counts.
 * @param {{ counts?: Record<string, number>, activeCategory?: string, showCounts?: boolean }} props
 */
export default function BlogCategoriesAside({
  counts = {},
  activeCategory = '',
  showCounts = true,
}) {
  return (
    <div className="ndx-blog-aside-card">
      <h2 className="ndx-blog-aside-card__title">Categories</h2>
      <ul className="ndx-blog-aside-cats">
        <li>
          <Link
            to="/blog"
            className={`ndx-blog-aside-cats__link${!activeCategory ? ' is-active' : ''}`}
          >
            All posts
            {showCounts && typeof counts.__all === 'number' ? (
              <span className="ndx-blog-aside-cats__count">{counts.__all}</span>
            ) : null}
          </Link>
        </li>
        {BLOG_CATEGORIES.map((cat) => {
          const count = counts[cat] || 0;
          return (
            <li key={cat}>
              <Link
                to={blogCategoryUrl(cat)}
                className={`ndx-blog-aside-cats__link${activeCategory === cat ? ' is-active' : ''}`}
              >
                {cat}
                {showCounts ? (
                  <span className="ndx-blog-aside-cats__count">{count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
