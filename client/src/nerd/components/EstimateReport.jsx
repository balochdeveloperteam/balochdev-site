import { forwardRef, useCallback } from 'react';
import './estimate.css';

function formatUsd(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(v);
}

function normalizeReport(report) {
  if (!report) return null;
  const monet = report.market?.monetization;
  return {
    ...report,
    costNotes: report.cost?.notes || report.cost?.basis || '',
    recommendations: report.recommendations || report.recommended_next_steps || [],
    platforms: Array.isArray(report.platforms) ? report.platforms : [],
    project_type: report.project_type || '',
    monetizationDisplay: Array.isArray(monet) ? monet.join(' · ') : monet || '',
  };
}

function CostRangeChart({ cost }) {
  const low = Number(cost?.low) || 0;
  const likely = Number(cost?.likely) || low;
  const high = Number(cost?.high) || likely;
  const span = Math.max(high - low, 1);
  const likelyPct = ((likely - low) / span) * 100;

  return (
    <svg viewBox="0 0 400 48" className="ndx-estimate-chart-svg" role="img" aria-label="Cost range">
      <line x1="24" y1="24" x2="376" y2="24" stroke="var(--ndx-border-strong)" strokeWidth="4" strokeLinecap="round" />
      <line x1="24" y1="24" x2="376" y2="24" stroke="var(--ndx-accent)" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      <circle cx="24" cy="24" r="6" fill="var(--ndx-dim)" />
      <circle cx="376" cy="24" r="6" fill="var(--ndx-dim)" />
      <circle cx={24 + (352 * likelyPct) / 100} cy="24" r="9" fill="var(--ndx-accent)" stroke="var(--ndx-bg)" strokeWidth="2" />
      <text x="24" y="44" fill="var(--ndx-dim)" fontSize="10" fontFamily="var(--ndx-font-mono)">
        Low
      </text>
      <text x="376" y="44" fill="var(--ndx-dim)" fontSize="10" fontFamily="var(--ndx-font-mono)" textAnchor="end">
        High
      </text>
    </svg>
  );
}

function TimelineChart({ timeline }) {
  const phases = Array.isArray(timeline?.phases) ? timeline.phases : [];
  const total = phases.reduce((s, p) => s + (Number(p.weeks) || 0), 0) || Number(timeline?.total_weeks) || 1;
  const shades = ['var(--ndx-accent)', 'color-mix(in srgb, var(--ndx-accent) 72%, var(--ndx-accent-2))', 'color-mix(in srgb, var(--ndx-accent) 48%, var(--ndx-bg))', 'color-mix(in srgb, var(--ndx-accent-2) 55%, transparent)', 'var(--ndx-accent-2)'];

  let x = 0;
  const segments = phases.map((phase, i) => {
    const weeks = Number(phase.weeks) || 1;
    const w = (weeks / total) * 360;
    const seg = { ...phase, x, w, fill: shades[i % shades.length] };
    x += w;
    return seg;
  });

  return (
    <>
      <svg viewBox="0 0 400 36" className="ndx-estimate-chart-svg" role="img" aria-label="Timeline phases">
        <rect x="20" y="8" width="360" height="20" rx="6" fill="color-mix(in srgb, var(--ndx-border) 80%, transparent)" />
        {segments.map((seg) => (
          <rect key={`${seg.name}-${seg.x}`} x={20 + seg.x} y="8" width={Math.max(seg.w, 2)} height="20" rx="4" fill={seg.fill} />
        ))}
      </svg>
      <div className="ndx-estimate-phase-labels">
        {phases.map((p) => (
          <span key={p.name}>
            {p.name} · {p.weeks}w
          </span>
        ))}
        {timeline?.total_weeks ? (
          <span>
            <strong style={{ color: 'var(--ndx-text)' }}>Total: {timeline.total_weeks} weeks</strong>
          </span>
        ) : null}
      </div>
    </>
  );
}

function ComplexityDonut({ score, label, drivers }) {
  const s = Math.min(100, Math.max(0, Number(score) || 0));
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (s / 100) * c;

  return (
    <div className="ndx-estimate-complexity-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120" className="ndx-estimate-chart-svg" role="img" aria-label={`Complexity ${s}`}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--ndx-border)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--ndx-accent)"
          strokeWidth="10"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="56" textAnchor="middle" fill="var(--ndx-text)" fontSize="22" fontWeight="600" fontFamily="var(--ndx-font-mono)">
          {s}
        </text>
        <text x="60" y="72" textAnchor="middle" fill="var(--ndx-dim)" fontSize="9" fontFamily="var(--ndx-font-mono)">
          / 100
        </text>
      </svg>
      <div className="ndx-estimate-complexity-meta">
        <strong style={{ color: 'var(--ndx-text)', display: 'block', marginBottom: '0.25rem' }}>{label || 'Complexity'}</strong>
        {Array.isArray(drivers) && drivers.length ? <span>{drivers.join(' · ')}</span> : null}
      </div>
    </div>
  );
}

function slugifyFilename(title) {
  return String(title || 'Project')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

const EstimateReport = forwardRef(function EstimateReport({ report, onDownloadStart, onDownloadEnd }, ref) {
  const data = normalizeReport(report);
  if (!data) return null;

  const handleDownloadPdf = useCallback(async () => {
    const node = ref?.current;
    if (!node) return;
    onDownloadStart?.();
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;background:#ffffff;padding:32px;';
      const clone = node.cloneNode(true);
      clone.classList.add('ndx-estimate-report--pdf');
      clone.style.background = '#ffffff';
      clone.style.color = '#0b1340';
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      document.body.removeChild(wrapper);

      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgW = pageW - margin * 2;
      const imgH = (canvas.height * imgW) / canvas.width;
      let heightLeft = imgH;
      let y = margin;

      pdf.addImage(img, 'PNG', margin, y, imgW, imgH);
      heightLeft -= pageH - margin * 2;

      while (heightLeft > 0) {
        pdf.addPage();
        y = margin - (imgH - heightLeft);
        pdf.addImage(img, 'PNG', margin, y, imgW, imgH);
        heightLeft -= pageH - margin * 2;
      }

      pdf.save(`BalochDev-Estimate-${slugifyFilename(data.project_title)}.pdf`);
    } catch {
      /* user can retry */
    } finally {
      onDownloadEnd?.();
    }
  }, [data.project_title, onDownloadEnd, onDownloadStart, ref]);

  return (
    <div ref={ref} className="ndx-estimate-report">
      <header>
        <h2 className="ndx-estimate-report__title">{data.project_title}</h2>
        <div>
          {data.project_type ? <span className="ndx-estimate-pill">{data.project_type}</span> : null}
          {data.platforms.map((p) => (
            <span key={p} className="ndx-estimate-pill">
              {p}
            </span>
          ))}
        </div>
        <p className="ndx-lead" style={{ marginTop: '1rem', marginBottom: 0 }}>
          {data.summary}
        </p>
      </header>

      <section className="ndx-estimate-report__section">
        <h3 className="ndx-estimate-report__section-title">Estimated cost</h3>
        <CostRangeChart cost={data.cost} />
        <div className="ndx-estimate-cost-figures">
          <span>
            <strong>{formatUsd(data.cost?.low)}</strong>
            Low
          </span>
          <span>
            <em>{formatUsd(data.cost?.likely)}</em>
            Likely
          </span>
          <span>
            <strong>{formatUsd(data.cost?.high)}</strong>
            High
          </span>
        </div>
        {data.costNotes ? (
          <p style={{ marginTop: '0.85rem', fontSize: '0.875rem', color: 'var(--ndx-muted)' }}>{data.costNotes}</p>
        ) : null}
      </section>

      <section className="ndx-estimate-report__section">
        <h3 className="ndx-estimate-report__section-title">Timeline</h3>
        <TimelineChart timeline={data.timeline} />
      </section>

      <section className="ndx-estimate-report__section">
        <h3 className="ndx-estimate-report__section-title">Tech stack</h3>
        {['frontend', 'backend', 'infra'].map((key) => {
          const items = data.tech_stack?.[key];
          if (!Array.isArray(items) || !items.length) return null;
          return (
            <div key={key} style={{ marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--ndx-dim)', letterSpacing: '0.08em' }}>
                {key}
              </span>
              <div className="ndx-estimate-tag-row">
                {items.map((t) => (
                  <span key={t} className="ndx-estimate-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="ndx-estimate-report__section">
        <h3 className="ndx-estimate-report__section-title">Market</h3>
        <div className="ndx-estimate-market-grid">
          <div className="ndx-estimate-market-cell">
            <strong>Size</strong>
            {data.market?.size_note || '—'}
          </div>
          <div className="ndx-estimate-market-cell">
            <strong>Audience</strong>
            {data.market?.audience || '—'}
          </div>
          <div className="ndx-estimate-market-cell">
            <strong>Monetization</strong>
            {data.monetizationDisplay || '—'}
          </div>
        </div>
      </section>

      {Array.isArray(data.competitors) && data.competitors.length > 0 ? (
        <section className="ndx-estimate-report__section">
          <h3 className="ndx-estimate-report__section-title">Competitors</h3>
          <ul className="ndx-estimate-list">
            {data.competitors.map((c) => (
              <li key={c.name}>
                <strong style={{ color: 'var(--ndx-text)' }}>{c.name}</strong>
                {c.note ? ` — ${c.note}` : ''}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="ndx-estimate-report__section">
        <h3 className="ndx-estimate-report__section-title">Complexity</h3>
        <ComplexityDonut score={data.complexity?.score} label={data.complexity?.label} drivers={data.complexity?.drivers} />
      </section>

      {Array.isArray(data.risks) && data.risks.length > 0 ? (
        <section className="ndx-estimate-report__section">
          <h3 className="ndx-estimate-report__section-title">Risks</h3>
          <ul className="ndx-estimate-list">
            {data.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(data.recommendations) && data.recommendations.length > 0 ? (
        <section className="ndx-estimate-report__section">
          <h3 className="ndx-estimate-report__section-title">Recommended next steps</h3>
          <ol className="ndx-estimate-list">
            {data.recommendations.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      <div className="ndx-estimate-report__actions">
        <button type="button" className="ndx-btn ndx-btn-primary" onClick={handleDownloadPdf}>
          Download report (PDF)
        </button>
      </div>
    </div>
  );
});

export default EstimateReport;
