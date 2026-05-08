import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../lib/api';

const fallback = [
  { title: 'Client commerce build', summary: 'Shopify / headless hybrid — performance pass and SEO.', slug: null, category: 'client' },
  { title: 'Mobile MVP', summary: 'Flutter app with Supabase backend.', slug: null, category: 'client' },
];

const catLabel = {
  partner: 'Partner',
  balochdev: 'BalochDev',
  client: 'Client delivery',
  future: 'Roadmap',
};

export default function NPortfolio() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    document.title = 'Projects & partners — BalochDev';
  }, []);

  useEffect(() => {
    fetch(apiUrl('/api/projects'))
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .catch(() => setProjects([]));
  }, []);

  const list = projects && projects.length ? projects : fallback;

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container">
        <p className="ndx-eyebrow">Portfolio</p>
        <h1 className="ndx-h1">
          Partners, <em>clients</em>, and roadmap.
        </h1>
        <p className="ndx-lead">
          Live entries sync from Supabase. We highlight partner language work, internal BalochDev programmes, and international
          delivery — names anonymised where under NDA.
        </p>
        <div className="ndx-card-grid" style={{ marginTop: '2rem' }}>
          {list.map((p) => (
            <div key={p.slug || p.title} className="ndx-card">
              <p className="ndx-tech-meta" style={{ marginBottom: '0.5rem' }}>
                {catLabel[p.category] || 'Project'}
              </p>
              <h3>{p.title}</h3>
              <p style={{ marginTop: '0.5rem' }}>{p.summary || p.text}</p>
              {p.slug ? (
                <Link to={`/projects/${p.slug}`} className="ndx-btn" style={{ marginTop: '1rem' }}>
                  Details
                </Link>
              ) : null}
            </div>
          ))}
        </div>
        <Link to="/proposal" className="ndx-btn ndx-btn-primary" style={{ marginTop: '2rem' }}>
          Propose a partnership
        </Link>
      </div>
    </section>
  );
}
