import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../lib/api';
import { supabase } from '../../../lib/supabase';

export default function AdminDashboard() {
  const nav = useNavigate();
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    document.title = 'Admin — BalochDev';
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) nav('/admin/login', { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) nav('/admin/login', { replace: true });
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  useEffect(() => {
    if (!session) return;
    fetch(apiUrl(`/api/analytics/summary`), {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ pageviews: 0, note: 'Run server + apply migration' }));
  }, [session]);

  const publish = async () => {
    if (!session) return;
    await fetch(apiUrl(`/api/blog`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-').slice(0, 80),
        excerpt,
        body_html: `<p>${body}</p>`,
      }),
    });
    setTitle('');
    setSlug('');
    setExcerpt('');
    setBody('');
    alert('Post saved (if API + DB configured).');
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    nav('/admin/login');
  };

  if (!supabase) {
    return (
      <section className="ndx-section">
        <div className="ndx-container">
          <p>Configure Supabase env vars in client `.env`.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="ndx-h2">Dashboard</h1>
          <button type="button" className="ndx-btn" onClick={signOut}>
            Sign out
          </button>
        </div>

        <div className="ndx-card-grid" style={{ marginBottom: '2rem' }}>
          <div className="ndx-card">
            <h3>Traffic (30d)</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats?.pageviews ?? '—'}</p>
            <p className="ndx-tech-blurb">{stats?.note || 'Pageviews from analytics_events'}</p>
          </div>
          <div className="ndx-card">
            <h3>Quick actions</h3>
            <p className="ndx-tech-blurb">Blog below · wire Cloudflare Web Analytics for richer stats later.</p>
          </div>
        </div>

        <div className="ndx-card">
          <h3>New blog post</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="ndx-admin-input" />
            <input placeholder="Slug (optional)" value={slug} onChange={(e) => setSlug(e.target.value)} className="ndx-admin-input" />
            <input placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="ndx-admin-input" />
            <textarea placeholder="Body (plain → wrapped in p)" value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="ndx-admin-input" />
            <button type="button" className="ndx-btn ndx-btn-primary" onClick={publish}>
              Publish
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .ndx-admin-input {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid var(--ndx-border);
          background: var(--ndx-bg);
          color: var(--ndx-text);
          font-family: var(--ndx-font-sans);
        }
      `}</style>
    </section>
  );
}
