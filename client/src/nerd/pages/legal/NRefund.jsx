import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NRefund() {
  useEffect(() => {
    document.title = 'Refund policy — BalochDev';
  }, []);

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Legal</p>
        <h1 className="ndx-h1">Refund policy</h1>
        <p className="ndx-lead" style={{ marginBottom: '1.5rem' }}>
          BalochDev delivers professional services and software. Refunds depend on the commercial agreement. Milestones, deposits,
          and acceptance criteria are spelled out before work begins.
        </p>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>Deposits & milestones</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            Initial deposits secure calendar time and discovery. Unless a written exception exists, deposits are non-refundable
            once work has started, reflecting planning and allocation costs.
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>If we cannot deliver</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            If BalochDev terminates for cause unable to be remedied, unused prepaid amounts for incomplete milestones may be
            returned or credited, as detailed in your SOW.
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '2rem' }}>
          <h3>Third-party fees</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            Licenses, hosting, and vendor subscriptions are typically passed through at cost. Refunds for those items follow the
            vendor&apos;s policy, not BalochDev&apos;s.
          </p>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--ndx-dim)' }}>
          Billing questions: <a href="mailto:support@balochdev.com">support@balochdev.com</a>
        </p>
        <Link to="/" className="ndx-btn" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Home
        </Link>
      </div>
    </section>
  );
}
