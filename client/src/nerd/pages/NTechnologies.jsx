import { technologyGroups, techStats, principles, stackCombos, faqItems } from '../data/technologies';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const orbitLabels = [
  'AI', '12', 'FE', '5', 'BE', '4', 'DATA', '6', 'OPS', '5', 'NW', '315°', 'NE', '045°',
];

export default function NTechnologies() {
  const [filter, setFilter] = useState('group');

  useEffect(() => {
    document.title = 'Technologies — BalochDev';
  }, []);

  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <p className="ndx-eyebrow">Technologies · 2026</p>
          <h1 className="ndx-h1">
            We create software using <em>technologies</em> you can trust.
          </h1>
          <p className="ndx-lead">
            A curated stack — not a trophy wall. <strong>{techStats.total} platforms, languages, and tools</strong> we use
            on real client work, grouped by what they do. Short notes on where each fits.
          </p>
          <div className="ndx-hero-btns">
            <Link to="/contact" className="ndx-btn ndx-btn-primary">
              Get in touch →
            </Link>
            <a href="#stack" className="ndx-btn">
              See the stack
            </a>
          </div>

          <div className="ndx-orbit" aria-hidden>
            {orbitLabels.map((t, i) => (
              <div key={`${i}-${t}`} className="ndx-orbit-cell">
                {t}
              </div>
            ))}
          </div>

          <div className="ndx-compass">
            NW · 315° NE · 045° SW · 225° SE · 135° — SYS-STACK/v26 — REV04·26 — LIVE
          </div>

          <div className="ndx-pill-row" id="stack">
            {technologyGroups.slice(0, 6).map((g) => (
              <span key={g.id} className="ndx-pill">
                {g.title.split(' ')[0]} · {g.count}
              </span>
            ))}
          </div>

          <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span className="ndx-eyebrow" style={{ margin: 0 }}>
              Group by
            </span>
            {['group', 'role', 'alpha'].map((k) => (
              <button
                key={k}
                type="button"
                className="ndx-btn"
                onClick={() => setFilter(k)}
                style={{
                  borderColor: filter === k ? 'var(--ndx-accent)' : undefined,
                  color: filter === k ? 'var(--ndx-accent)' : undefined,
                }}
              >
                {k === 'group' ? 'Category' : k === 'role' ? 'Role' : 'A–Z'}
              </button>
            ))}
          </div>

          {technologyGroups.map((group, gi) => (
            <section key={group.id} className="ndx-section-tight" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <div className="ndx-group-head">
                <h2 className="ndx-h2">
                  <span className="ndx-h2-num">{String(gi + 1).padStart(2, '0')}</span>
                  {group.title}
                </h2>
                <p className="ndx-group-sub">{group.subtitle}</p>
              </div>
              <ul className="ndx-tech-list">
                {group.items
                  .slice()
                  .sort((a, b) => (filter === 'alpha' ? a.name.localeCompare(b.name) : 0))
                  .map((item) => (
                    <li key={item.name}>
                      <Link to="/contact" className="ndx-tech-card">
                        <div className="ndx-tech-abbr">{item.abbr}</div>
                        <div>
                          <div className="ndx-tech-meta">
                            {item.role} · since {item.since}
                          </div>
                          <div className="ndx-tech-name">{item.name}</div>
                          <p className="ndx-tech-blurb">{item.blurb}</p>
                        </div>
                        <span className="ndx-tech-arrow bx bx-right-arrow-alt" aria-hidden />
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="ndx-section" style={{ background: 'var(--ndx-bg-elev)' }}>
        <div className="ndx-container">
          <p className="ndx-eyebrow">How we pick</p>
          <h2 className="ndx-h2" style={{ marginBottom: '1.5rem' }}>
            Four principles, no exceptions.
          </h2>
          <div className="ndx-principles">
            {principles.map((p) => (
              <div key={p.n} className="ndx-principle">
                <div className="ndx-principle-num">{p.n}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section">
        <div className="ndx-container">
          <p className="ndx-eyebrow">Recipes</p>
          <h2 className="ndx-h2" style={{ marginBottom: '1rem' }}>
            Stack combos we actually ship
          </h2>
          <div className="ndx-table-wrap">
            <table className="ndx-table">
              <thead>
                <tr>
                  <th>Product type</th>
                  <th>Stack</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {stackCombos.map((row) => (
                  <tr key={row.product}>
                    <td style={{ color: 'var(--ndx-text)', fontWeight: 600 }}>{row.product}</td>
                    <td>{row.stack}</td>
                    <td>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="ndx-section" style={{ background: 'var(--ndx-surface)' }}>
        <div className="ndx-container">
          <p className="ndx-eyebrow">FAQ</p>
          <h2 className="ndx-h2" style={{ marginBottom: '1rem' }}>
            Questions we actually hear.
          </h2>
          {faqItems.map((f, i) => (
            <div key={f.q} className="ndx-faq-item">
              <button type="button" className="ndx-faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                {f.q}
                <span className="bx" style={{ transform: openFaq === i ? 'rotate(180deg)' : '' }}>▼</span>
              </button>
              {openFaq === i && <div className="ndx-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
