import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { apiUrl } from '../../../lib/api';
import { formatBlogDate } from '../../lib/blogSeo';
import { getVisitorKey } from '../../lib/visitorKey';
import BlogAvatar from './BlogAvatar';
import BlogLikeButton from './BlogLikeButton';

function CommentItem({ comment, onReply, replyToId, onCancelReply, slug, onSubmitted }) {
  const isReplyForm = replyToId === comment.id;

  return (
    <li className={`ndx-blog-comment${comment.is_pinned ? ' is-pinned' : ''}`} id={`comment-${comment.id}`}>
      <div className="ndx-blog-comment__head">
        <BlogAvatar name={comment.author_name} size="sm" />
        <span className="ndx-blog-comment__author">{comment.author_name}</span>
        {comment.is_pinned ? <span className="ndx-blog-card__tag">Pinned</span> : null}
        <time className="ndx-blog-comment__time" dateTime={comment.created_at}>
          {formatBlogDate(comment.created_at)}
        </time>
      </div>
      <p className="ndx-blog-comment__body">{comment.content}</p>
      <div className="ndx-blog-comment__actions">
        <BlogLikeButton
          targetType="comment"
          targetId={comment.id}
          initialCount={comment.like_count || 0}
          initialLiked={!!comment.liked}
          compact
        />
        {!comment.parent_id ? (
          <button type="button" className="ndx-blog-comment__reply-btn" onClick={() => onReply(comment.id)}>
            Reply
          </button>
        ) : null}
      </div>
      {isReplyForm ? (
        <CommentForm
          slug={slug}
          parentId={comment.id}
          onSuccess={onSubmitted}
          onCancel={onCancelReply}
          compact
        />
      ) : null}
      {comment.replies?.length ? (
        <ul className="ndx-blog-comment__replies">
          {comment.replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              slug={slug}
              onReply={onReply}
              replyToId={replyToId}
              onCancelReply={onCancelReply}
              onSubmitted={onSubmitted}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function CommentForm({ slug, parentId = null, onSuccess, onCancel, compact = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch(apiUrl(`/api/blog/${slug}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: name,
          author_email: email,
          content,
          parent_id: parentId,
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not post comment.');
        return;
      }
      setName('');
      setEmail('');
      setContent('');
      onSuccess?.(data.comment);
    } catch {
      setError('Network error — try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="ndx-blog-comment-form" onSubmit={submit} style={compact ? { marginTop: '0.75rem' } : undefined}>
      <div className="ndx-blog-comment-form__hp" aria-hidden>
        <label htmlFor={`website-${parentId || 'root'}`}>Website</label>
        <input
          id={`website-${parentId || 'root'}`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      {!compact ? (
        <div className="ndx-blog-comment-form__row">
          <input
            type="text"
            placeholder="Your name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email (not shown publicly)"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Your name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email (not shown publicly)"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}
      <textarea
        placeholder={parentId ? 'Write a reply…' : 'Join the discussion…'}
        required
        minLength={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {error ? <p className="ndx-blog-form-error">{error}</p> : null}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="submit" className="ndx-btn ndx-btn-primary" disabled={busy}>
          {busy ? 'Posting…' : parentId ? 'Reply' : 'Post comment'}
        </button>
        {onCancel ? (
          <button type="button" className="ndx-btn" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      {!compact ? (
        <p className="ndx-blog-comment-legal">
          By posting, you agree to our{' '}
          <Link to="/terms/">Terms</Link> and <Link to="/privacy/">Privacy Policy</Link>.
        </p>
      ) : null}
    </form>
  );
}

function buildThread(flat) {
  const tops = flat.filter((c) => !c.parent_id);
  const byParent = new Map();
  for (const c of flat) {
    if (!c.parent_id) continue;
    const list = byParent.get(c.parent_id) || [];
    list.push(c);
    byParent.set(c.parent_id, list);
  }
  return tops.map((t) => ({
    ...t,
    replies: (byParent.get(t.id) || []).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    ),
  }));
}

export default function BlogComments({ slug, initialComments = [], commentCount = 0, bootstrapOnly = false }) {
  const [comments, setComments] = useState(initialComments);
  const [replyTo, setReplyTo] = useState(null);
  const [count, setCount] = useState(commentCount);

  const refresh = useCallback(async () => {
    if (!slug || bootstrapOnly) return;
    try {
      const vk = getVisitorKey();
      const res = await fetch(apiUrl(`/api/blog/${slug}/comments?visitor_key=${encodeURIComponent(vk)}`));
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.comments)) setComments(data.comments);
      if (typeof data.comments?.length === 'number') setCount(data.comments.length);
    } catch {
      /* keep bootstrap */
    }
  }, [slug, bootstrapOnly]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const threaded = useMemo(() => buildThread(comments), [comments]);

  function handleNewComment(c) {
    if (!c) return;
    setComments((prev) => [c, ...prev]);
    setCount((n) => n + 1);
    setReplyTo(null);
    refresh();
  }

  return (
    <section className="ndx-blog-comments" aria-labelledby="blog-comments-heading">
      <h2 id="blog-comments-heading" className="ndx-blog-comments__title">
        {count} {count === 1 ? 'Comment' : 'Comments'}
      </h2>
      <CommentForm slug={slug} onSuccess={handleNewComment} />
      {threaded.length ? (
        <ul className="ndx-blog-comment-list">
          {threaded.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              slug={slug}
              replyToId={replyTo}
              onReply={setReplyTo}
              onCancelReply={() => setReplyTo(null)}
              onSubmitted={handleNewComment}
            />
          ))}
        </ul>
      ) : (
        <p className="ndx-blog-empty">No comments yet — be the first.</p>
      )}
    </section>
  );
}
