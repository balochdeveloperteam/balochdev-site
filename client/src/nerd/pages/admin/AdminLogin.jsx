import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiUrl } from '../../../lib/api';
import { supabase } from '../../../lib/supabase';
import Seo from '../../seo/Seo';
import { PRIVATE_ROUTES } from '../../seo/siteSeo';

const ADMIN_META_DESC = 'BalochDev team sign-in — not indexed.';
const NOT_AUTHORIZED_MSG = "This account isn't authorized for admin access.";

function isAdminReturnPath(path) {
  return typeof path === 'string' && path.startsWith('/admin') && path !== '/admin/login';
}

async function verifyAdminAccess(accessToken) {
  const res = await fetch(apiUrl('/api/blog/admin/me'), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.ok) return 'admin';
  if (res.status === 403) return 'denied';
  return 'error';
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [adminConfirmed, setAdminConfirmed] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const from = location.state?.from;
    if (isAdminReturnPath(from)) return from;
    return '/admin/overview';
  }, [location.state?.from]);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!data.session?.access_token) {
        setChecking(false);
        return;
      }

      const verdict = await verifyAdminAccess(data.session.access_token);
      if (cancelled) return;

      if (verdict === 'admin') {
        setAdminConfirmed(true);
      } else if (verdict === 'denied') {
        setNotAuthorized(true);
        setChecking(false);
      } else {
        setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotAuthorized(false);
    if (!supabase) {
      setError('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client .env');
      return;
    }

    setSubmitting(true);
    try {
      const { error: err, data } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        return;
      }

      const token = data.session?.access_token;
      if (!token) {
        setError('Sign-in failed — no session token.');
        return;
      }

      const verdict = await verifyAdminAccess(token);
      if (verdict === 'admin') {
        setAdminConfirmed(true);
      } else if (verdict === 'denied') {
        setNotAuthorized(true);
        setError(NOT_AUTHORIZED_MSG);
      } else {
        setError('Could not verify admin access. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (adminConfirmed) {
    return <Navigate to={redirectTo} replace />;
  }

  if (checking) {
    return (
      <>
        <Seo
          title="Sign in | BalochDev"
          description={ADMIN_META_DESC}
          canonicalPath={PRIVATE_ROUTES.ADMIN_LOGIN}
          noindex
        />
        <section className="ndx-section" style={{ paddingTop: '3rem', minHeight: '70vh' }}>
          <div className="ndx-container" style={{ maxWidth: '400px' }}>
            <p className="ndx-tech-blurb">Checking session…</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Sign in | BalochDev"
        description={ADMIN_META_DESC}
        canonicalPath={PRIVATE_ROUTES.ADMIN_LOGIN}
        noindex
      />
      <section className="ndx-section" style={{ paddingTop: '3rem', minHeight: '70vh' }}>
        <div className="ndx-container" style={{ maxWidth: '400px' }}>
          <p className="ndx-eyebrow">Admin</p>
          <h1 className="ndx-h1" style={{ fontSize: '2rem' }}>
            Team login
          </h1>
          <p className="ndx-lead">Members only — uses Supabase Auth.</p>
          {notAuthorized && (
            <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '1rem' }} role="alert">
              {NOT_AUTHORIZED_MSG}
            </p>
          )}
          <form
            onSubmit={onSubmit}
            style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                maxWidth: '100%',
                padding: '0.85rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--ndx-border)',
                background: 'var(--ndx-surface)',
                color: 'var(--ndx-text)',
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                maxWidth: '100%',
                padding: '0.85rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--ndx-border)',
                background: 'var(--ndx-surface)',
                color: 'var(--ndx-text)',
              }}
            />
            {error && !notAuthorized && (
              <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{error}</p>
            )}
            <button type="submit" className="ndx-btn ndx-btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
