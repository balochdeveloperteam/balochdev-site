import { forwardRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

  // New contract
  if (Array.isArray(report.lineItems) && report.totals) {
    const recs = Array.isArray(report.recommendations)
      ? report.recommendations.map((r) =>
          typeof r === 'string' ? { title: r, detail: '' } : { title: r?.title || '', detail: r?.detail || '' },
        )
      : [];
    return {
      schema: 'v2',
      projectTitle: report.meta?.projectTitle || 'Project estimate',
      projectType: report.meta?.projectType || '',
      platforms: Array.isArray(report.meta?.platforms) ? report.meta.platforms : [],
      summary: report.summary || '',
      lineItems: report.lineItems,
      totals: report.totals,
      timeframe: report.timeframe || {},
      market: report.market || {},
      recommendations: recs.filter((r) => r.title),
      nextStep: report.nextStep || null,
    };
  }

  // Legacy freeform (pre-catalog) — minimal display so old saved reports still open
  return {
    schema: 'legacy',
    projectTitle: report.project_title || 'Project estimate',
    projectType: report.project_type || '',
    platforms: Array.isArray(report.platforms) ? report.platforms : [],
    summary: report.summary || '',
    lineItems: [],
    totals: {
      currency: report.cost?.currency || 'USD',
      low: report.cost?.low,
      high: report.cost?.high,
      notes: report.cost?.notes || '',
    },
    timeframe: {
      label: report.timeline?.total_weeks ? `~${report.timeline.total_weeks} weeks` : '',
    },
    market: {
      sizeNote: report.market?.size_note,
      audience: report.market?.audience,
      monetization: Array.isArray(report.market?.monetization)
        ? report.market.monetization.join(' · ')
        : report.market?.monetization,
      macroSeries: [],
    },
    recommendations: (report.recommendations || []).map((r) =>
      typeof r === 'string' ? { title: r, detail: '' } : { title: r?.title || '', detail: r?.detail || '' },
    ),
    nextStep: null,
  };
}

function MacroSeriesChart({ series }) {
  const rows = Array.isArray(series) ? series : [];
  if (!rows.length) return null;
  const max = Math.max(...rows.map((r) => Number(r.value) || 0), 1);

  return (
    <div className="ndx-estimate-macro" role="img" aria-label="Market signal chart">
      {rows.map((row) => {
        const pct = Math.round(((Number(row.value) || 0) / max) * 100);
        return (
          <div key={row.label} className="ndx-estimate-macro__row">
            <span className="ndx-estimate-macro__label">{row.label}</span>
            <div className="ndx-estimate-macro__track">
              <div className="ndx-estimate-macro__bar" style={{ width: `${pct}%` }} />
            </div>
            <span className="ndx-estimate-macro__value">{Number(row.value) || 0}</span>
          </div>
        );
      })}
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

      pdf.save(`BalochDev-Estimate-${slugifyFilename(data.projectTitle)}.pdf`);
    } catch {
      /* user can retry */
    } finally {
      onDownloadEnd?.();
    }
  }, [data.projectTitle, onDownloadEnd, onDownloadStart, ref]);

  return (
    <div ref={ref} className="ndx-estimate-report">
      <header>
        <h2 className="ndx-estimate-report__title">{data.projectTitle}</h2>
        <div>
          {data.projectType ? <span className="ndx-estimate-pill">{data.projectType}</span> : null}
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

      {data.lineItems.length > 0 ? (
        <section className="ndx-estimate-report__section">
          <h3 className="ndx-estimate-report__section-title">Line items</h3>
          <div className="ndx-estimate-table-wrap">
            <table className="ndx-estimate-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Low</th>
                  <th>High</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                {data.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.label}</strong>
                      {item.billing === 'monthly' ? (
                        <span className="ndx-estimate-table__hint"> / mo</span>
                      ) : null}
                    </td>
                    <td>{formatUsd(item.low)}</td>
                    <td>{formatUsd(item.high)}</td>
                    <td>
                      {item.calendarDaysLow != null && item.calendarDaysHigh != null
                        ? `${item.calendarDaysLow}–${item.calendarDaysHigh}d`
                        : item.billing === 'monthly'
                          ? 'Monthly'
                          : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="ndx-estimate-report__section">
        <h3 className="ndx-estimate-report__section-title">Totals</h3>
        <div className="ndx-estimate-cost-figures">
          <span>
            <strong>{formatUsd(data.totals?.low)}</strong>
            Low
          </span>
          <span>
            <em>{formatUsd(data.totals?.high)}</em>
            High
          </span>
        </div>
        {data.totals?.notes ? (
          <p style={{ marginTop: '0.85rem', fontSize: '0.875rem', color: 'var(--ndx-muted)' }}>{data.totals.notes}</p>
        ) : null}
        {data.totals?.requiresCall ? (
          <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--ndx-accent)' }}>
            Scope likely needs a scoping call before a firm quote.
          </p>
        ) : null}
      </section>

      <section className="ndx-estimate-report__section">
        <h3 className="ndx-estimate-report__section-title">Timeframe</h3>
        <p style={{ margin: 0, color: 'var(--ndx-muted)', fontSize: '0.9375rem' }}>
          {data.timeframe?.label ||
            (data.timeframe?.calendarDaysLow != null
              ? `${data.timeframe.calendarDaysLow}–${data.timeframe.calendarDaysHigh} calendar days`
              : '—')}
        </p>
      </section>

      {(data.market?.sizeNote || data.market?.audience || data.market?.monetization) && (
        <section className="ndx-estimate-report__section">
          <h3 className="ndx-estimate-report__section-title">Market</h3>
          <div className="ndx-estimate-market-grid">
            {data.market.sizeNote ? (
              <div className="ndx-estimate-market-cell">
                <strong>Size</strong>
                {data.market.sizeNote}
              </div>
            ) : null}
            {data.market.audience ? (
              <div className="ndx-estimate-market-cell">
                <strong>Audience</strong>
                {data.market.audience}
              </div>
            ) : null}
            {data.market.monetization ? (
              <div className="ndx-estimate-market-cell">
                <strong>Monetization</strong>
                {data.market.monetization}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {Array.isArray(data.market?.macroSeries) && data.market.macroSeries.length > 0 ? (
        <section className="ndx-estimate-report__section">
          <h3 className="ndx-estimate-report__section-title">Signals</h3>
          <MacroSeriesChart series={data.market.macroSeries} />
        </section>
      ) : null}

      {data.recommendations.length > 0 ? (
        <section className="ndx-estimate-report__section">
          <h3 className="ndx-estimate-report__section-title">Recommendations</h3>
          <ul className="ndx-estimate-list ndx-estimate-list--recs">
            {data.recommendations.map((rec) => (
              <li key={rec.title}>
                <strong style={{ color: 'var(--ndx-text)' }}>{rec.title}</strong>
                {rec.detail ? <span> — {rec.detail}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.nextStep ? (
        <section className="ndx-estimate-report__section ndx-estimate-next">
          <h3 className="ndx-estimate-report__section-title">Next step</h3>
          <p className="ndx-estimate-next__title">{data.nextStep.title}</p>
          {data.nextStep.detail ? <p className="ndx-estimate-next__detail">{data.nextStep.detail}</p> : null}
          <Link to="/contact" className="ndx-btn ndx-btn-primary">
            {data.nextStep.ctaLabel || 'Contact BalochDev'}
          </Link>
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
