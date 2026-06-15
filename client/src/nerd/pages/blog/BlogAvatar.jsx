import { authorInitials } from '../../lib/blogSeo';

export default function BlogAvatar({ name, url, size = 'md' }) {
  const cls = size === 'sm' ? 'ndx-blog-avatar ndx-blog-avatar--sm' : 'ndx-blog-avatar';
  if (url) {
    return <img src={url} alt="" className={cls} loading="lazy" width={size === 'sm' ? 24 : 32} height={size === 'sm' ? 24 : 32} />;
  }
  return <span className={cls} aria-hidden>{authorInitials(name)}</span>;
}
