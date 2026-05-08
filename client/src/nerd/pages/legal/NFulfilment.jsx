import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NFulfilment() {
  useEffect(() => {
    document.title = 'Fulfilment policy — BalochDev';
  }, []);

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Legal</p>
        <h1 className="ndx-h1">Fulfilment policy</h1>
        <p className="ndx-lead" style={{ marginBottom: '1.5rem' }}>
          How we deliver digital products and services once an agreement is in place: timelines, communication, and acceptance.
        </p>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>Kickoff</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            After contract and deposit, we schedule kickoff, share a central workspace (Notion / Slack / your tool), and confirm
            milestones, stakeholders, and review cadence.
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '1rem' }}>
          <h3>Delivery & reviews</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            We ship incremental previews (staging URLs / builds). You confirm acceptance per milestone; material scope changes move
            through change control as agreed in writing.
          </p>
        </div>
        <div className="ndx-card" style={{ marginBottom: '2rem' }}>
          <h3>Go-live</h3>
          <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)' }}>
            Production launch includes handover docs, access transfer, and a short hypercare window where agreed. Ongoing support is
            optional and quoted separately.
          </p>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--ndx-dim)' }}>
          Ops: <a href="mailto:team@balochdev.com">team@balochdev.com</a>
        </p>
        <Link to="/" className="ndx-btn" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Home
        </Link>
      </div>
    </section>
  );
}
