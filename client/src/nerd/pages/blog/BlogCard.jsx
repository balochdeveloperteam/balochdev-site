import { Link } from 'react-router-dom';

import { formatBlogDate } from '../../lib/blogSeo';
import BlogAvatar from './BlogAvatar';

function statIcon(label) {
  return <span aria-hidden>{label}</span>;
}

export default function BlogCard({ post }) {
  const isImagePost = post.post_type === 'image_caption';
  const excerpt =
    post.excerpt_plain ||
    (typeof post.excerpt === 'string' ? post.excerpt.replace(/<[^>]*>/g, ' ').trim() : '') ||
    '';

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`ndx-blog-card${isImagePost ? ' ndx-blog-card--image' : ''}`}
    >
      {post.cover_image_url ? (
        <div className="ndx-blog-card__cover">
          <img src={post.cover_image_url} alt={post.cover_image_alt || post.title} loading="lazy" />
        </div>
      ) : null}
      <div className="ndx-blog-card__body">
        {post.category ? (
          <span className="ndx-blog-card__tag">{post.category}</span>
        ) : null}
        <h2 className="ndx-blog-card__title">{post.title}</h2>
        {excerpt ? <p className="ndx-blog-card__excerpt">{excerpt}</p> : null}
        <div className="ndx-blog-card__meta">
          <BlogAvatar name={post.author_name} url={post.author_avatar_url} size="sm" />
          <span>{post.author_name}</span>
          {post.published_at ? (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.published_at}>{formatBlogDate(post.published_at)}</time>
            </>
          ) : null}
          {post.reading_time_minutes ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.reading_time_minutes} min read</span>
            </>
          ) : null}
        </div>
        <div className="ndx-blog-card__stats">
          <span>{statIcon('♥')} {post.like_count || 0}</span>
          <span>{statIcon('💬')} {post.comment_count || 0}</span>
        </div>
        {post.tags?.length ? (
          <div className="ndx-blog-card__tags">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="ndx-blog-card__tag">{t}</span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
