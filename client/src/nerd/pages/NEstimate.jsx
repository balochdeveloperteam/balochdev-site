import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../seo/seoFromData';
import { apiUrl } from '../../lib/api';
import { getVisitorKey } from '../lib/visitorKey';
import EstimateHero from '../components/EstimateHero';
import EstimateReport from '../components/EstimateReport';
import '../components/estimate.css';

const ESTIMATE_SEO = STATIC_PUBLIC_PAGES_SEO['/estimate'];

const inputStyle = {
  padding: '0.85rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--ndx-border)',
  background: 'var(--ndx-surface)',
  color: 'var(--ndx-text)',
  fontFamily: 'var(--ndx-font-sans)',
};

function LoadingPanel() {
  return (
    <motion.div
      className="ndx-estimate-loading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ndx-estimate-loading__nodes" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="ndx-estimate-loading__node"
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <motion.p
        className="ndx-lead"
        style={{ margin: '0 auto', maxWidth: '36ch' }}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Analyzing your brief… generating your estimate
      </motion.p>
    </motion.div>
  );
}

export default function NEstimate() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [err, setErr] = useState(null);
  const reportRef = useRef(null);

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(ESTIMATE_SEO.metaTitle), []);
  const seoDescription = useMemo(() => capDescription(ESTIMATE_SEO.metaDescription), []);

  const remainingLabel = remaining !== null ? remaining : '—';

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setReport(null);
    const fd = new FormData(e.target);
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/estimate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          company: fd.get('company'),
          budget: fd.get('budget'),
          timeline: fd.get('timeline'),
          brief: fd.get('message'),
          visitor_key: getVisitorKey(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || 'Something went wrong');
        if (typeof data.remaining === 'number') setRemaining(data.remaining);
        return;
      }
      setReport(data.report);
      setRemaining(typeof data.remaining === 'number' ? data.remaining : null);
    } catch {
      setErr('Network error — try again or email team@balochdev.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} canonicalPath={ESTIMATE_SEO.canonicalPath} />
      <EstimateHero />
      <section className="ndx-section" style={{ paddingTop: '2.5rem' }}>
        <div className="ndx-container" style={{ maxWidth: '720px' }}>
          {loading ? <LoadingPanel /> : null}

          {!loading ? (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              <button type="submit" className="ndx-btn ndx-btn-primary" disabled={loading}>
                Generate AI estimate
              </button>
              <p style={{ fontSize: '0.8125rem', color: 'var(--ndx-dim)' }}>
                Free AI estimate · {remainingLabel} left today · This is an automated ballpark, not a formal quote. Prefer
                email?{' '}
                <a href="mailto:team@balochdev.com" style={{ color: 'var(--ndx-accent)' }}>
                  team@balochdev.com
                </a>
              </p>
            </form>
          ) : null}

          {report && !loading ? <EstimateReport ref={reportRef} report={report} /> : null}
        </div>
      </section>
    </>
  );
}
