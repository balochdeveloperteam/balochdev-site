import { Link } from 'react-router-dom';

import Seo from '../../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../../seo/seoFromData';

const PRIVACY_SEO = STATIC_PUBLIC_PAGES_SEO['/privacy'];

export default function NPrivacy() {
  const title = metaTitleFromPublicBrief(PRIVACY_SEO.metaTitle);
  const description = capDescription(PRIVACY_SEO.metaDescription);

  return (
    <>
      <Seo title={title} description={description} canonicalPath={PRIVACY_SEO.canonicalPath} />
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Legal</p>
        <h1 className="ndx-h1">Privacy policy</h1>
        <p className="ndx-lead" style={{ marginBottom: '1.5rem' }}>
          BalochDev (&quot;we&quot;) processes personal data to operate balochdev.com, deliver services, and respond to enquiries.
          A fuller policy aligned with your jurisdiction is maintained by the team — this page is a concise public summary.
        </p>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>What we collect</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            Contact forms may collect name, email, phone, organisation, and message content. Analytics may log page paths and
            coarse technical data. Auth users (admins) have account metadata managed by Supabase Auth.
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>Why we use it</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            To reply to leads, deliver projects, secure our systems, and improve performance. With your consent where required, we
            may reference engagements in portfolio materials (never confidential details without agreement).
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '2rem' }}>
          <h3>Retention & security</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            Data is stored in Supabase (database &amp; files) and may be copied to operational tools (e.g. Telegram, Google
            Workspace) your team configures. We apply standard modern controls; detailed subprocessors are listed in the full
            policy pack.
          </p>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--ndx-dim)' }}>
          Questions: <a href="mailto:support@balochdev.com">support@balochdev.com</a>
        </p>
        <Link to="/" className="ndx-btn" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Home
        </Link>
      </div>
    </section>
    </>
  );
}
