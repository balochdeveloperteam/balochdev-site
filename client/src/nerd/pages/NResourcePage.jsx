import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RESOURCE_PAGES } from '../data/resourcePages';
import Seo from '../seo/Seo';
import { capDescription, capTitle } from '../seo/seoFromData';

export default function NResourcePage() {
  const { slug } = useParams();
  const page = slug ? RESOURCE_PAGES[slug] : null;

  const seoHead = useMemo(() => {
    if (!page || !slug) return null;
    const titleRaw = typeof page.title === 'string' ? page.title.trim() : '';
    if (!titleRaw) return null;
    const title = capTitle(`${titleRaw} | BalochDev`, 60);
    const descRaw =
      (typeof page.blurb === 'string' && page.blurb.trim()) || titleRaw;
    if (!descRaw) return null;
    const description = capDescription(descRaw, 155);
    const canonicalPath = `/resources/${slug}`;
    return { title, description, canonicalPath };
  }, [page, slug]);

  if (!page) {
    return (
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <h1 className="ndx-h1">Resource not found</h1>
          <Link to="/technologies/" className="ndx-btn ndx-btn-primary" style={{ marginTop: '1rem' }}>
            Technologies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      {seoHead ? (
        <Seo title={seoHead.title} description={seoHead.description} canonicalPath={seoHead.canonicalPath} />
      ) : null}
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Resources</p>
        <h1 className="ndx-h1">{page.title}</h1>
        <p className="ndx-lead">{page.blurb}</p>
        <div className="ndx-hero-btns" style={{ marginTop: '2rem' }}>
          <Link to="/estimate/" className="ndx-btn ndx-btn-primary">
            AI estimate
          </Link>
          <Link to="/contact/" className="ndx-btn">
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
