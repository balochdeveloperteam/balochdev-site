import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../lib/api';

const inputStyle = {
  padding: '0.85rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--ndx-border)',
  background: 'var(--ndx-surface)',
  color: 'var(--ndx-text)',
  fontFamily: 'var(--ndx-font-sans)',
};

export default function NProposal() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    document.title = 'Project proposal — BalochDev';
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.target);
    try {
      const res = await fetch(apiUrl('/api/forms/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'proposal',
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
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '640px' }}>
        <p className="ndx-eyebrow">Proposal</p>
        <h1 className="ndx-h1">
          Send a <em>project brief</em>.
        </h1>
        <p className="ndx-lead">
          Describe outcomes, constraints, and links — we&apos;ll respond with clarifications or a scoping path. Partner work on
          Balochi language &amp; culture is especially welcome.
        </p>

        {!sent ? (
          <form onSubmit={onSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {err ? (
              <p role="alert" style={{ color: '#fecaca', fontSize: '0.9rem' }}>
                {err}
              </p>
            ) : null}
            <input name="name" required placeholder="Your name" style={inputStyle} />
            <input name="email" type="email" required placeholder="Email" style={inputStyle} />
            <input name="phone" placeholder="Phone / WhatsApp (optional)" style={inputStyle} />
            <input name="company" placeholder="Organisation (optional)" style={inputStyle} />
            <input name="budget" placeholder="Budget or funding stage (optional)" style={inputStyle} />
            <input name="timeline" placeholder="Ideal launch window (optional)" style={inputStyle} />
            <textarea
              name="message"
              required
              rows={8}
              placeholder="Problem statement, users, must-haves, links to references or docs…"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '180px' }}
            />
            <button type="submit" className="ndx-btn ndx-btn-primary">
              Submit proposal
            </button>
            <p style={{ fontSize: '0.8125rem', color: 'var(--ndx-dim)' }}>
              We may route this to Telegram and your Google Sheet if configured server-side; primary store is Supabase.
            </p>
          </form>
        ) : (
          <>
            <p className="ndx-lead" style={{ marginTop: '2rem' }}>
              Received. A project lead will reach out shortly. For urgent support:{' '}
              <a href="mailto:support@balochdev.com" style={{ color: 'var(--ndx-accent)' }}>
                support@balochdev.com
              </a>
              .
            </p>
            <Link to="/services" className="ndx-btn" style={{ marginTop: '1rem' }}>
              Explore services
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
