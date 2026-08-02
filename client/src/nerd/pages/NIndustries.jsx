import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const industries = [
  { title: 'E-commerce & retail', text: 'Stores, subscriptions, and ops tooling.' },
  { title: 'Professional services', text: 'Lead gen, booking, and client portals.' },
  { title: 'Education', text: 'Course sites, cohort tools, and content.' },
  { title: 'Logistics & ops', text: 'Dashboards, alerts, and field workflows.' },
];

export default function NIndustries() {
  useEffect(() => {
    document.title = 'Industries — BalochDev';
  }, []);

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container">
        <p className="ndx-eyebrow">Industries</p>
        <h1 className="ndx-h1">
          Where we have <em>deep context</em>.
        </h1>
        <p className="ndx-lead">Industry notes stay short — we’ll tailor compliance and integrations on the call.</p>
        <div className="ndx-card-grid" style={{ marginTop: '2rem' }}>
          {industries.map((i) => (
            <div key={i.title} className="ndx-card">
              <h3>{i.title}</h3>
              <p>{i.text}</p>
            </div>
          ))}
        </div>
        <Link to="/contact/" className="ndx-btn ndx-btn-primary" style={{ marginTop: '2rem' }}>
          Talk industry fit
        </Link>
      </div>
    </section>
  );
}
