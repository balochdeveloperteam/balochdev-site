import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RESOURCE_PAGES } from '../data/resourcePages';

export default function NResourcePage() {
  const { slug } = useParams();
  const page = slug ? RESOURCE_PAGES[slug] : null;

  useEffect(() => {
    document.title = page ? `${page.title} — BalochDev` : 'Resource — BalochDev';
  }, [page]);

  if (!page) {
    return (
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <h1 className="ndx-h1">Resource not found</h1>
          <Link to="/technologies" className="ndx-btn ndx-btn-primary" style={{ marginTop: '1rem' }}>
            Technologies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Resources</p>
        <h1 className="ndx-h1">{page.title}</h1>
        <p className="ndx-lead">{page.blurb}</p>
        <div className="ndx-hero-btns" style={{ marginTop: '2rem' }}>
          <Link to="/estimate" className="ndx-btn ndx-btn-primary">
            AI estimate
          </Link>
          <Link to="/contact" className="ndx-btn">
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
