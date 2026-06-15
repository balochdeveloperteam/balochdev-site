import { useState } from 'react';

import { apiUrl } from '../../../lib/api';
import { getVisitorKey } from '../../lib/visitorKey';

export default function BlogLikeButton({ targetType, targetId, initialCount = 0, initialLiked = false, compact = false }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy || !targetId) return;
    setBusy(true);
    const visitorKey = getVisitorKey();
    const method = liked ? 'DELETE' : 'POST';
    try {
      const res = await fetch(apiUrl('/api/blog/like'), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, visitor_key: visitorKey }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setLiked(!!data.liked);
      if (typeof data.like_count === 'number') setCount(data.like_count);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={`ndx-blog-like-btn${liked ? ' is-liked' : ''}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <span aria-hidden>{liked ? '♥' : '♡'}</span>
      {!compact ? <span>{count}</span> : <span aria-label={`${count} likes`}>{count}</span>}
    </button>
  );
}
