import { Link } from 'react-router-dom';

import Seo from '../../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../../seo/seoFromData';

const TERMS_SEO = STATIC_PUBLIC_PAGES_SEO['/terms'];

export default function NTerms() {
  const title = metaTitleFromPublicBrief(TERMS_SEO.metaTitle);
  const description = capDescription(TERMS_SEO.metaDescription);

  return (
    <>
      <Seo title={title} description={description} canonicalPath={TERMS_SEO.canonicalPath} />
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Legal</p>
        <h1 className="ndx-h1">Terms &amp; conditions</h1>
        <p className="ndx-lead" style={{ marginBottom: '1.5rem' }}>
          These terms govern use of balochdev.com and preliminary enquiries. Formal development engagements are additionally
          covered by a signed statement of work (SOW) or master services agreement (MSA).
        </p>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>Use of the website</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            Content is provided for information. You agree not to misuse forms, attempt unauthorised access, or scrape the site
            in ways that harm availability.
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>Intellectual property</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            Unless a contract says otherwise, BalochDev retains rights to reusable tools and know-how; client-specific assets are
            transferred as defined in the SOW.
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '2rem' }}>
          <h3>Limitation</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            The site is provided as-is. To the extent permitted by law, BalochDev is not liable for indirect losses from site
            use. Disputes are handled as set out in your executed agreement or, if missing, through good-faith negotiation.
          </p>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--ndx-dim)' }}>
          Commercial terms: <a href="mailto:team@balochdev.com">team@balochdev.com</a>
        </p>
        <Link to="/" className="ndx-btn" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Home
        </Link>
      </div>
    </section>
    </>
  );
}
