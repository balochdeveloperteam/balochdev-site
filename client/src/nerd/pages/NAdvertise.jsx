import { Link } from 'react-router-dom';

import Seo from '../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../seo/seoFromData';
import { AD_PLACEMENTS } from '../lib/adPlacements';
import './advertise.css';

const ADVERTISE_SEO = STATIC_PUBLIC_PAGES_SEO['/advertise'];

const PRICING = [
  {
    price: '$5',
    duration: '12 hours',
    detail: 'Short burst — ideal for launches, announcements, or time-sensitive offers.',
  },
  {
    price: '$10',
    duration: '24 hours',
    detail: 'Full-day visibility across the blog feed and every article sidebar slot.',
  },
];

const STEPS = [
  'Choose a placement and duration ($5 / 12h or $10 / 24h).',
  'Email your ad image (correct dimensions below) and target link to team@balochdev.com.',
  'We review your creative and send an invoice.',
  'Pay via PayPal, Stripe, or bank transfer (Qatar, Bahrain, or Pakistan).',
  'We schedule your ad and confirm when it goes live.',
];

const PAYMENTS = ['PayPal', 'Stripe', 'Bank transfer — Qatar', 'Bank transfer — Bahrain', 'Bank transfer — Pakistan'];

export default function NAdvertise() {
  const seoTitle = metaTitleFromPublicBrief(ADVERTISE_SEO.metaTitle);
  const seoDescription = capDescription(ADVERTISE_SEO.metaDescription);

  return (
    <section className="ndx-section ndx-advertise">
      <Seo title={seoTitle} description={seoDescription} canonicalPath={ADVERTISE_SEO.canonicalPath} />
      <div className="ndx-container ndx-advertise__wrap">
        <header className="ndx-advertise__header">
          <p className="ndx-eyebrow">Advertise</p>
          <h1 className="ndx-h1">
            Reach developers on the <em>BalochDev blog</em>.
          </h1>
          <p className="ndx-lead">
            Put your product or service in front of a technical audience — AI builders, web developers, and startup teams who read our notes from delivery.
          </p>
        </header>

        <section className="ndx-advertise__section" aria-labelledby="pricing-heading">
          <h2 id="pricing-heading" className="ndx-advertise__h2">Pricing</h2>
          <div className="ndx-advertise__pricing-grid">
            {PRICING.map((tier) => (
              <div key={tier.duration} className="ndx-advertise__price-card">
                <p className="ndx-advertise__price">{tier.price}</p>
                <p className="ndx-advertise__duration">{tier.duration}</p>
                <p className="ndx-advertise__price-detail">{tier.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ndx-advertise__section" aria-labelledby="placements-heading">
          <h2 id="placements-heading" className="ndx-advertise__h2">Where your ad appears</h2>
          <div className="ndx-advertise__placements">
            {AD_PLACEMENTS.map((p) => (
              <div key={p.id} className="ndx-advertise__placement-card">
                <h3 className="ndx-advertise__placement-title">{p.label}</h3>
                <p className="ndx-advertise__placement-desc">{p.description}</p>
                <p className="ndx-advertise__placement-specs">
                  <strong>Image specs:</strong> {p.specs}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="ndx-advertise__section" aria-labelledby="how-heading">
          <h2 id="how-heading" className="ndx-advertise__h2">How it works</h2>
          <ol className="ndx-advertise__steps">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="ndx-advertise__section" aria-labelledby="pay-heading">
          <h2 id="pay-heading" className="ndx-advertise__h2">Payment methods</h2>
          <ul className="ndx-advertise__payments">
            {PAYMENTS.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>

        <section className="ndx-advertise__cta">
          <h2 className="ndx-advertise__h2">Ready to advertise?</h2>
          <p className="ndx-lead">
            Email your placement choice, ad image, and target URL to{' '}
            <a href="mailto:team@balochdev.com">team@balochdev.com</a>.
          </p>
          <div className="ndx-advertise__cta-actions">
            <a href="mailto:team@balochdev.com" className="ndx-btn ndx-btn-primary">
              Email team@balochdev.com
            </a>
            <Link to="/blog/" className="ndx-btn">
              View the blog
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
