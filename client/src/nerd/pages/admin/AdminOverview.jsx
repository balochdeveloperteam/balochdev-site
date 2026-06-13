import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAdmin } from './AdminContext';

export default function AdminOverview() {
  const { authFetch, profile } = useAdmin();
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState('');
  const reduceMotion = useReducedMotion();
  const firstName = profile?.name?.split(' ')[0] || 'Admin';

  useEffect(() => {
    let cancelled = false;
    authFetch('/api/blog/admin/stats')
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load stats');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message || 'Failed to load stats');
      });
    return () => {
      cancelled = true;
    };
  }, [authFetch]);

  const cards = [
    { label: 'Total posts', value: stats?.total ?? '—' },
    { label: 'Published', value: stats?.published ?? '—' },
    { label: 'Drafts', value: stats?.drafts ?? '—' },
    { label: 'Post views', value: stats?.totalViews ?? '—' },
    { label: 'Site pageviews (30d)', value: stats?.pageviews30d ?? '—' },
  ];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ndx-admin-page-head">
        <div>
          <p className="ndx-eyebrow">Overview</p>
          <h2 className="ndx-h2">Welcome, {firstName}</h2>
        </div>
        <div className="ndx-admin-page-head-actions">
          <Link to="/admin/posts/new" className="ndx-btn ndx-btn-primary">
            New post
          </Link>
        </div>
      </div>

      <motion.div
        className="ndx-admin-hero ndx-glass-section"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.05 }}
      >
        <p className="ndx-lead">
          Manage articles and image-caption posts from the Blog Posts tab. Public post pages and
          comments ship in Part 2.
        </p>
      </motion.div>

      {err && (
        <p className="ndx-admin-alert">
          {err} — apply migration 005 and restart the API.
        </p>
      )}

      <div className="ndx-admin-stat-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            className="ndx-admin-stat-card"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.08 + index * 0.04 }}
          >
            <p className="ndx-admin-stat-label">{card.label}</p>
            <p className="ndx-admin-stat-value">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
