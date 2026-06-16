import { Link } from 'react-router-dom';

/**
 * @param {{ items: { label: string, to?: string }[] }} props
 */
export default function BlogBreadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="ndx-blog-crumb" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="ndx-blog-crumb__segment">
            {i > 0 ? (
              <span aria-hidden className="ndx-blog-crumb__sep">
                /
              </span>
            ) : null}
            {item.to && !isLast ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span className={isLast ? 'ndx-blog-crumb__current' : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
