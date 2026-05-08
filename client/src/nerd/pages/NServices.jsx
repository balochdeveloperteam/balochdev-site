import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const tiers = [
  { name: 'Launch', from: 100, text: 'Single landing or small brochure on Shopify, Wix, Webflow, or WordPress.' },
  { name: 'Growth', from: 499, text: 'Multi-page store or CMS with integrations, analytics, and performance pass.' },
  { name: 'Scale', from: 1499, text: 'Custom theme/apps, subscriptions, or headless commerce with Supabase/API.' },
];

const platforms = [
  { name: 'Shopify', note: 'DTC & subscriptions' },
  { name: 'WordPress', note: 'Content & Woo' },
  { name: 'Wix / Webflow', note: 'Marketing + light commerce' },
  { name: 'Squarespace / Tilda', note: 'Portfolio & editorial' },
  { name: 'Custom Next.js', note: 'Headless & speed' },
];

export default function NServices() {
  useEffect(() => {
    document.title = 'Services — BalochDev';
  }, []);

  return (
    <>
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <p className="ndx-eyebrow">Services</p>
          <h1 className="ndx-h1">
            Web, <em>mobile</em>, and e-commerce that convert.
          </h1>
          <p className="ndx-lead">
            Same craft as leading product studios — scoped for SMEs and growing brands. E-commerce builds{' '}
            <strong>start from $100</strong> for essential storefront setup; we scale with you.
          </p>
        </div>
      </section>

      <section className="ndx-section" style={{ background: 'var(--ndx-bg-elev)' }}>
        <div className="ndx-container">
          <h2 className="ndx-h2" style={{ marginBottom: '1rem' }}>
            E-commerce & site platforms
          </h2>
          <p className="ndx-group-sub" style={{ marginBottom: '1.5rem' }}>
            Pick your surface — we design, implement, and hand off with docs.
          </p>
          <div className="ndx-card-grid">
            {platforms.map((p) => (
              <div key={p.name} className="ndx-card">
                <h3>{p.name}</h3>
                <p>{p.note}</p>
                <p className="ndx-price-tag">From $100 setup · custom quote for full build</p>
                <Link to="/contact" className="ndx-btn" style={{ marginTop: '1rem' }}>
                  Get estimate
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section">
        <div className="ndx-container">
          <h2 className="ndx-h2" style={{ marginBottom: '1rem' }}>
            Engagement tiers
          </h2>
          <div className="ndx-card-grid">
            {tiers.map((t) => (
              <div key={t.name} className="ndx-card">
                <h3>{t.name}</h3>
                <p className="ndx-price-tag">From ${t.from}</p>
                <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--ndx-muted)' }}>{t.text}</p>
                <Link to="/contact" className="ndx-btn ndx-btn-primary" style={{ marginTop: '1rem' }}>
                  Start
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
