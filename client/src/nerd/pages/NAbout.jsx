import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Adeel Baloch', role: 'Founder + Project manager · Full stack developer' },
  { name: 'Fazi Baloch', role: 'Team manager' },
  { name: 'Shees Baloch', role: 'Full stack developer (mobile app development)' },
  { name: 'Sohail Baloch', role: 'Frontend developer · Trainer for team B' },
  { name: 'Shams Baloch', role: 'Social media manager · Graphic designer' },
  { name: 'Hafsa Baloch', role: 'Social media content creator (onboarding pending)' },
  { name: 'Iqra Baloch', role: 'YouTube content manager' },
  { name: 'Nabeel Baloch', role: 'Junior frontend developer' },
  { name: 'Jwad Baloch', role: 'Junior frontend developer' },
  { name: 'Digital marketing', role: 'Role pending — we are hiring' },
  { name: 'Data management', role: 'Role pending — we are hiring' },
];

export default function NAbout() {
  useEffect(() => {
    document.title = 'About us — BalochDev';
  }, []);

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container">
        <p className="ndx-eyebrow">About BalochDev</p>
        <h1 className="ndx-h1">
          Promoting Baloch <em>tech</em> — worldwide.
        </h1>
        <p className="ndx-lead">
          We are a focused product and services team. <strong>High priority</strong> is partner work that advances Balochi
          language and culture in mainstream software — alongside international web and mobile delivery for clients who need speed,
          clarity, and security.
        </p>

        <div className="ndx-principles" style={{ marginTop: '2.5rem' }}>
          <div className="ndx-principle">
            <h3>Mission</h3>
            <p>
              Digitise and promote Balochi: keyboards, office tools, browsers, and ethical AI that speaks with and for the
              community — always in partnership with educators and native speakers.
            </p>
          </div>
          <div className="ndx-principle">
            <h3>How we deliver</h3>
            <p>
              Weekly demos, fixed milestones, protected Git branches, staging before production. Tools: modern JS &amp; Flutter
              stacks, Supabase, Cloudflare-first hosting patterns when you need edge speed and strong TLS.
            </p>
          </div>
        </div>

        <h2 className="ndx-h2" style={{ marginTop: '3rem' }}>
          Team
        </h2>
        <p className="ndx-group-sub" style={{ marginBottom: '1.25rem' }}>
          Core contributors and open roles — say hello if you want to collaborate.
        </p>
        <div className="ndx-card-grid">
          {team.map((m) => (
            <div key={m.name} className="ndx-card">
              <h3>{m.name}</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--ndx-muted)', fontSize: '0.9rem' }}>{m.role}</p>
            </div>
          ))}
        </div>

        <h2 className="ndx-h2" style={{ marginTop: '3rem' }}>
          Brand partners
        </h2>
        <div className="ndx-hero-btns" style={{ marginTop: '1rem' }}>
          <span className="ndx-card" style={{ padding: '1rem 1.25rem', display: 'inline-block' }}>
            Balochi Academy
          </span>
          <span className="ndx-card" style={{ padding: '1rem 1.25rem', display: 'inline-block' }}>
            Taheer team
          </span>
        </div>

        <h2 className="ndx-h2" style={{ marginTop: '3rem' }}>
          Initiatives in motion
        </h2>
        <ul style={{ marginTop: '1rem', color: 'var(--ndx-muted)', paddingLeft: '1.25rem', maxWidth: '62ch' }}>
          <li style={{ marginBottom: '0.5rem' }}>Balochi in Microsoft Office (partner)</li>
          <li style={{ marginBottom: '0.5rem' }}>Balochi in Google Keyboard (partner)</li>
          <li style={{ marginBottom: '0.5rem' }}>LLM / chatbot for Balochi Academy — answers in Balochi</li>
          <li style={{ marginBottom: '0.5rem' }}>Balochi Music AI — ethical promotion of Balochi music globally</li>
          <li style={{ marginBottom: '0.5rem' }}>Large-scale Balochi foundation model (research track)</li>
          <li style={{ marginBottom: '0.5rem' }}>Voice-forward Balochi music &amp; learning device concept</li>
          <li>Balochi typography &amp; input in Chrome and other browsers</li>
        </ul>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/proposal" className="ndx-btn ndx-btn-primary">
            Partner with us
          </Link>
          <Link to="/portfolio" className="ndx-btn">
            Projects
          </Link>
          <Link to="/contact" className="ndx-btn">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
