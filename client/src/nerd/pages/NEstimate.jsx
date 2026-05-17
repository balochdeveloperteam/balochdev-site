import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../seo/seoFromData';
import { apiUrl } from '../../lib/api';

const ESTIMATE_SEO = STATIC_PUBLIC_PAGES_SEO['/estimate'];

const inputStyle = {
  padding: '0.85rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--ndx-border)',
  background: 'var(--ndx-surface)',
  color: 'var(--ndx-text)',
  fontFamily: 'var(--ndx-font-sans)',
};

export default function NEstimate() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(ESTIMATE_SEO.metaTitle), []);

  const seoDescription = useMemo(() => capDescription(ESTIMATE_SEO.metaDescription), []);

  const onSubmit = async (e) => {
    setErr(null);
    const fd = new FormData(e.target);
    try {
      const res = await fetch(apiUrl('/api/forms/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'estimate',
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          company: fd.get('company'),
          message: fd.get('message'),
          budget: fd.get('budget'),
          timeline: fd.get('timeline'),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setErr(data.error || 'Something went wrong');
      else setSent(true);
    } catch {
      setErr('Network error — try again or email team@balochdev.com');
    }
  };

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} canonicalPath={ESTIMATE_SEO.canonicalPath} />
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '560px' }}>
        <p className="ndx-eyebrow">AI estimate</p>
        <h1 className="ndx-h1">
          Ballpark scope in <em>48 hours</em>.
        </h1>
        <p className="ndx-lead">
          AI-first software development. We ship custom products faster with modern agents, careful architecture, and a stack
          you can run — web, mobile, and Balochi-language initiatives included.
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
            <input name="company" placeholder="Company / org (optional)" style={inputStyle} />
            <input name="budget" placeholder="Budget range (optional)" style={inputStyle} />
            <input name="timeline" placeholder="Target timeline (optional)" style={inputStyle} />
            <textarea
              name="message"
              required
              rows={6}
              placeholder="What are you building? Stack preferences, users, success metrics…"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
            />
            <button type="submit" className="ndx-btn ndx-btn-primary">
              Request estimate
            </button>
            <p style={{ fontSize: '0.8125rem', color: 'var(--ndx-dim)' }}>
              Submissions are stored securely and also forwarded to our team channel. Prefer email?{' '}
              <a href="mailto:team@balochdev.com" style={{ color: 'var(--ndx-accent)' }}>
                team@balochdev.com
              </a>
            </p>
          </form>
        ) : (
          <>
            <p className="ndx-lead" style={{ marginTop: '2rem' }}>
              Thanks — we received your brief. We reply within two business days with questions or a fixed-scope outline.
            </p>
            <Link to="/" className="ndx-btn" style={{ marginTop: '1rem' }}>
              Back home
            </Link>
          </>
        )}
      </div>
    </section>
    </>
  );
}
