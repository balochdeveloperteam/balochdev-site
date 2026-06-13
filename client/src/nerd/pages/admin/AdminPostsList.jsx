import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAdmin } from './AdminContext';

function StatusBadge({ status }) {
  const key = status || 'draft';
  return <span className={`ndx-admin-status ndx-admin-status--${key}`}>{key}</span>;
}

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function AdminPostsList() {
  const { authFetch } = useAdmin();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const reduceMotion = useReducedMotion();

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await authFetch('/api/blog/admin/posts');
      if (!res.ok) throw new Error('Could not load posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) {
      setErr(e.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onDelete = async (post) => {
    const ok = window.confirm(`Delete "${post.title}"? This cannot be undone.`);
    if (!ok) return;
    const res = await authFetch(`/api/blog/admin/posts/${post.id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
      return;
    }
    loadPosts();
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ndx-admin-page-head">
        <div>
          <p className="ndx-eyebrow">Blog Posts</p>
          <h2 className="ndx-h2" style={{ margin: 0 }}>
            All posts
          </h2>
        </div>
        <Link to="/admin/posts/new" className="ndx-btn ndx-btn-primary">
          New post
        </Link>
      </div>

      {err && <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{err}</p>}

      <div className="ndx-admin-table-wrap">
        <table className="ndx-admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Type</th>
              <th>Published</th>
              <th>Views</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6}>Loading…</td>
              </tr>
            )}
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan={6}>No posts yet — create your first one.</td>
              </tr>
            )}
            {!loading &&
              posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong>{post.title}</strong>
                    <div className="ndx-admin-field-hint">/{post.slug}</div>
                  </td>
                  <td>
                    <StatusBadge status={post.status} />
                  </td>
                  <td>{post.post_type === 'image_caption' ? 'Image + caption' : 'Article'}</td>
                  <td>{formatDate(post.published_at)}</td>
                  <td>{post.view_count ?? 0}</td>
                  <td>
                    <div className="ndx-admin-actions">
                      <Link to={`/admin/posts/${post.id}/edit`} className="ndx-btn">
                        Edit
                      </Link>
                      <button type="button" className="ndx-btn" onClick={() => onDelete(post)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
