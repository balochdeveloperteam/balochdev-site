import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SERVICE_PAGES } from '../data/servicePages';

export default function NServicePage() {
  const { slug } = useParams();
  const page = slug ? SERVICE_PAGES[slug] : null;

  useEffect(() => {
    document.title = page ? `${page.title} — BalochDev` : 'Service — BalochDev';
  }, [page]);

  if (!page) {
    return (
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <h1 className="ndx-h1">Service not found</h1>
          <Link to="/services" className="ndx-btn ndx-btn-primary" style={{ marginTop: '1rem' }}>
            All services
          </Link>
        </div>
      </section>
    );
  }

  const titleParts = page.title.split(' ');
  const lastWord = titleParts.length > 1 ? titleParts.pop() : '';
  const head = titleParts.join(' ');

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container">
        <p className="ndx-eyebrow">Services</p>
        <h1 className="ndx-h1">
          {head}
          {lastWord ? (
            <>
              {' '}
              <em>{lastWord}</em>
            </>
          ) : (
            <em>{page.title}</em>
          )}
        </h1>
        <p className="ndx-lead">{page.blurb}</p>
        <ul style={{ marginTop: '1.5rem', paddingLeft: '1.25rem', color: 'var(--ndx-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {page.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="ndx-hero-btns" style={{ marginTop: '2rem' }}>
          <Link to="/proposal" className="ndx-btn ndx-btn-primary">
            Send a proposal
          </Link>
          <Link to="/estimate" className="ndx-btn">
            AI estimate
          </Link>
          <Link to="/contact" className="ndx-btn">
            Book a call
          </Link>
        </div>
      </div>
    </section>
  );
}
