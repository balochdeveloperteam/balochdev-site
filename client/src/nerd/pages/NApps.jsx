import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const apps = [
  'AI-enabled tools',
  'Marketplaces',
  'Dashboards & analytics',
  'Booking & operations',
  'Internal portals',
  'Mobile-first consumer apps',
];

export default function NApps() {
  useEffect(() => {
    document.title = 'Apps — BalochDev';
  }, []);

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container">
        <p className="ndx-eyebrow">Apps</p>
        <h1 className="ndx-h1">
          Software products we <em>design & ship</em>.
        </h1>
        <p className="ndx-lead">Short list of app types — tell us yours and we map the stack in week one.</p>
        <ul className="ndx-tech-list" style={{ marginTop: '2rem' }}>
          {apps.map((a) => (
            <li key={a} className="ndx-card">
              <h3 style={{ fontSize: '1rem' }}>{a}</h3>
              <p className="ndx-tech-blurb">Scoping, UX, build, and launch — with SEO and performance checks.</p>
            </li>
          ))}
        </ul>
        <Link to="/contact" className="ndx-btn ndx-btn-primary" style={{ marginTop: '2rem' }}>
          Describe your app
        </Link>
      </div>
    </section>
  );
}
