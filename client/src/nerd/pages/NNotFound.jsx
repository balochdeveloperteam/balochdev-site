import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PAGE_TITLE = '404 — Page not found · BalochDev';

export default function NNotFound() {
  const loc = useLocation();
  const isStatic404Snapshot = loc.pathname === '/404';

  useEffect(() => {
    document.title = PAGE_TITLE;

    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    if (meta.getAttribute('content') !== 'noindex') {
      meta.setAttribute('content', 'noindex');
    }
  }, []);

  return (
    <section className="ndx-section" style={{ paddingTop: '5rem', minHeight: '70vh' }}>
      <div className="ndx-container" style={{ maxWidth: 720, textAlign: 'center' }}>
        <p className="ndx-eyebrow">Error 404</p>
        <h1 className="ndx-h1" style={{ marginTop: '0.5rem' }}>
          We couldn't find that page.
        </h1>
        {isStatic404Snapshot ? (
          <p className="ndx-lead" style={{ marginTop: '1rem' }}>
            This page doesn't exist or may have moved.
          </p>
        ) : (
          <p className="ndx-lead" style={{ marginTop: '1rem' }}>
            The link{' '}
            <code style={{ background: 'var(--ndx-surface)', padding: '0.15rem 0.5rem', borderRadius: 6 }}>
              {loc.pathname}
            </code>{' '}
            doesn't exist or may have moved.
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link to="/" className="ndx-btn ndx-btn-primary">
            Go home
          </Link>
          <Link to="/services" className="ndx-btn">
            Browse services
          </Link>
          <Link to="/contact" className="ndx-btn">
            Contact us
          </Link>
        </div>

        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', textAlign: 'left' }}>
          <Link to="/portfolio" className="ndx-card" style={{ padding: '1rem' }}>
            <strong>Portfolio</strong>
            <p className="ndx-tech-blurb" style={{ marginTop: '0.25rem' }}>See selected work</p>
          </Link>
          <Link to="/blog" className="ndx-card" style={{ padding: '1rem' }}>
            <strong>Blog</strong>
            <p className="ndx-tech-blurb" style={{ marginTop: '0.25rem' }}>Notes and updates</p>
          </Link>
          <Link to="/about" className="ndx-card" style={{ padding: '1rem' }}>
            <strong>About</strong>
            <p className="ndx-tech-blurb" style={{ marginTop: '0.25rem' }}>Who we are</p>
          </Link>
          <Link to="/estimate" className="ndx-card" style={{ padding: '1rem' }}>
            <strong>AI estimate</strong>
            <p className="ndx-tech-blurb" style={{ marginTop: '0.25rem' }}>Get a quick quote</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
