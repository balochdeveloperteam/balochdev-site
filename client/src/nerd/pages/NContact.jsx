import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Seo from '../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../seo/seoFromData';

import { apiUrl } from '../../lib/api';

const CONTACT_SEO = STATIC_PUBLIC_PAGES_SEO['/contact'];

const inputStyle = {
  padding: '0.85rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--ndx-border)',
  background: 'var(--ndx-surface)',
  color: 'var(--ndx-text)',
  fontFamily: 'var(--ndx-font-sans)',
};

export default function NContact() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(CONTACT_SEO.metaTitle), []);

  const seoDescription = useMemo(() => capDescription(CONTACT_SEO.metaDescription), []);

  const onSubmit = async (e) => {
    setErr(null);
    const fd = new FormData(e.target);
    try {
      const res = await fetch(apiUrl(`/api/forms/submit`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'contact',
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          company: fd.get('company'),
          message: fd.get('message'),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setErr(data.error || 'Something went wrong');
      else setSent(true);
    } catch {
      setErr('Network error — email team@balochdev.com');
    }
  };

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} canonicalPath={CONTACT_SEO.canonicalPath} />
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '560px' }}>
        <p className="ndx-eyebrow">Contact</p>
        <h1 className="ndx-h1">
          Tell us the <em>problem</em>.
        </h1>
        <p className="ndx-lead">
          Book a call or drop a note — we reply within two business days. For structured briefs use{' '}
          <Link to="/proposal" style={{ color: 'var(--ndx-accent)' }}>
            project proposal
          </Link>{' '}
          or{' '}
          <Link to="/estimate" style={{ color: 'var(--ndx-accent)' }}>
            AI estimate
          </Link>
          .
        </p>

        {!sent ? (
          <form onSubmit={onSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {err ? (
              <p role="alert" style={{ color: '#fecaca', fontSize: '0.9rem' }}>
                {err}
              </p>
            ) : null}
            <input name="name" required placeholder="Name" style={inputStyle} />
            <input name="email" type="email" required placeholder="Email" style={inputStyle} />
            <input name="phone" placeholder="Phone (optional)" style={inputStyle} />
            <input name="company" placeholder="Company (optional)" style={inputStyle} />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="How can we help?"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
            />
            <button type="submit" className="ndx-btn ndx-btn-primary">
              Send
            </button>
          </form>
        ) : (
          <p className="ndx-lead" style={{ marginTop: '2rem' }}>
            Thanks — we got your note. We’ll follow up shortly.
          </p>
        )}
      </div>
    </section>
    </>
  );
}
