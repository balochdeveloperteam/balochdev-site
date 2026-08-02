/**
 * Blog post categories for the admin editor dropdown.
 *
 * Add, remove, or reorder entries here — this list drives the category
 * select in Publishing & SEO. Values are saved to blog_posts.category as plain text.
 * (A dedicated categories table may replace this when public category pages ship.)
 */
export const BLOG_CATEGORIES = [
  'Technology',
  'News',
  'AI',
  'Tutorials',
  'Company',
  'Web Development',
];

/** Link to the main blog feed filtered by category (?category=). Trailing slash before query. */
export function blogCategoryUrl(category) {
  const cat = String(category || '').trim();
  if (!cat) return '/blog/';
  return `/blog/?category=${encodeURIComponent(cat)}`;
}
