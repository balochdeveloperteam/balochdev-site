import { forwardRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import botLogo from '../../assets/BalochDevLogo/botlogo.webp';
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
      generatedAt: report.meta?.generatedAt || null,
    };
  }

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
    generatedAt: null,
  };
}

function CostRangeChart({ low, high }) {
  const lo = Number(low);
  const hi = Number(high);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi <= 0) return null;

  return (
    <div className="ndx-estimate-range" role="img" aria-label={`Cost range ${formatUsd(lo)} to ${formatUsd(hi)}`}>
      <div className="ndx-estimate-range__track">
        <div className="ndx-estimate-range__fill" />
      </div>
      <div className="ndx-estimate-range__labels">
        <span>{formatUsd(lo)}</span>
        <span>{formatUsd(hi)}</span>
      </div>
    </div>
  );
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

async function assetToDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load asset (${res.status})`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to encode asset'));
    reader.readAsDataURL(blob);
  });
}

function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  return Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
    ),
  );
}

function formatDocDate(iso) {
  if (!iso) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

/** html2canvas cannot parse modern CSS color() / color-mix / oklch values. */
function isHtml2CanvasSafeColor(value) {
  if (!value || typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  if (v === 'transparent' || v === 'currentcolor' || v === 'inherit' || v === 'initial') return false;
  if (/color-mix\(|oklch\(|oklab\(|lab\(|lch\(|color\(|hwb\(/i.test(v)) return false;
  return /^#([0-9a-f]{3,8})$/i.test(v) || /^rgba?\(/i.test(v);
}

let pdfColorCtx = null;
function toHtml2CanvasColor(value, fallback = null) {
  if (!value || typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'transparent' || trimmed === 'rgba(0, 0, 0, 0)') return fallback;
  if (isHtml2CanvasSafeColor(trimmed)) return trimmed;

  try {
    if (!pdfColorCtx) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      pdfColorCtx = canvas.getContext('2d', { willReadFrequently: true });
    }
    const ctx = pdfColorCtx;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000000';
    ctx.fillStyle = trimmed;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return fallback;
    if (a === 255) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${Number((a / 255).toFixed(3))})`;
  } catch {
    return fallback;
  }
}

function flattenPdfColors(root) {
  const nodes = [root, ...root.querySelectorAll('*')];
  nodes.forEach((nodeEl) => {
    if (!(nodeEl instanceof HTMLElement)) return;
    const cs = window.getComputedStyle(nodeEl);

    nodeEl.style.backgroundImage = 'none';
    nodeEl.style.boxShadow = 'none';
    nodeEl.style.textShadow = 'none';
    nodeEl.style.filter = 'none';
    nodeEl.style.backdropFilter = 'none';
    nodeEl.style.webkitBackdropFilter = 'none';
    nodeEl.style.outlineColor = 'transparent';

    const color = toHtml2CanvasColor(cs.color, '#0b1340');
    if (color) nodeEl.style.color = color;

    const bg = toHtml2CanvasColor(cs.backgroundColor, null);
    nodeEl.style.backgroundColor = bg || 'transparent';

    const borderColor = toHtml2CanvasColor(cs.borderColor, 'rgba(11, 19, 64, 0.16)');
    if (borderColor) {
      nodeEl.style.borderTopColor = borderColor;
      nodeEl.style.borderRightColor = borderColor;
      nodeEl.style.borderBottomColor = borderColor;
      nodeEl.style.borderLeftColor = borderColor;
    }

    const caret = toHtml2CanvasColor(cs.caretColor, null);
    if (caret) nodeEl.style.caretColor = caret;
  });
}

function PdfAlertModal({ open, message, onClose }) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="ndx-estimate-pdf-alert" role="presentation" onClick={onClose}>
      <div
        className="ndx-estimate-pdf-alert__panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ndx-estimate-pdf-alert-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="ndx-estimate-pdf-alert__eyebrow">PDF export</p>
        <h3 id="ndx-estimate-pdf-alert-title" className="ndx-estimate-pdf-alert__title">
          Could not generate the PDF
        </h3>
        <p className="ndx-estimate-pdf-alert__body">{message}</p>
        <div className="ndx-estimate-pdf-alert__actions">
          <button type="button" className="ndx-btn ndx-btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Document-style estimate report (invoice / proposal cost-breakdown layout).
 */
const EstimateReport = forwardRef(function EstimateReport({ report, onDownloadStart, onDownloadEnd }, ref) {
  const data = normalizeReport(report);
  const [pdfError, setPdfError] = useState('');
  const [pdfBusy, setPdfBusy] = useState(false);

  const timeframeLabel = data
    ? data.timeframe?.label ||
      (data.timeframe?.calendarDaysLow != null
        ? `${data.timeframe.calendarDaysLow}–${data.timeframe.calendarDaysHigh} calendar days`
        : '—')
    : '—';

  const handleDownloadPdf = useCallback(async () => {
    const node = ref?.current;
    if (!data || !node || pdfBusy) return;
    setPdfError('');
    setPdfBusy(true);
    onDownloadStart?.();
    let wrapper = null;
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      let logoDataUrl = '';
      try {
        logoDataUrl = await assetToDataUrl(botLogo);
      } catch {
        logoDataUrl = '';
      }

      wrapper = document.createElement('div');
      wrapper.setAttribute('aria-hidden', 'true');
      wrapper.style.cssText =
        'position:fixed;left:-10000px;top:0;width:800px;background:#ffffff;padding:32px;z-index:-1;color:#0b1340;';
      const clone = node.cloneNode(true);
      clone.classList.add('ndx-estimate-report--pdf');
      clone.style.background = '#ffffff';
      clone.style.color = '#0b1340';
      clone.querySelectorAll('.ndx-estimate-report__actions').forEach((el) => {
        el.style.display = 'none';
      });
      clone.querySelectorAll('a.ndx-btn').forEach((el) => {
        el.style.display = 'none';
      });
      if (logoDataUrl) {
        clone.querySelectorAll('img').forEach((img) => {
          img.setAttribute('src', logoDataUrl);
          img.removeAttribute('srcset');
          img.crossOrigin = 'anonymous';
        });
      } else {
        clone.querySelectorAll('img').forEach((img) => {
          img.remove();
        });
      }

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);
      await waitForImages(wrapper);
      // Flatten modern CSS colors to rgb()/hex before html2canvas parses them.
      flattenPdfColors(clone);

      const canvas = await html2canvas(wrapper, {
        scale: Math.min(2, window.devicePixelRatio || 1.5),
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        logging: false,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        onclone: (_doc, el) => {
          el.style.background = '#ffffff';
          el.style.color = '#0b1340';
          flattenPdfColors(el);
        },
      });

      if (!canvas.width || !canvas.height) {
        throw new Error('Empty canvas from html2canvas');
      }

      const img = canvas.toDataURL('image/png');
      if (!img || img === 'data:,') {
        throw new Error('Canvas export failed (likely tainted image)');
      }

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
    } catch (err) {
      console.error('[estimate PDF]', err);
      setPdfError(
        err?.message
          ? `${err.message}. Try again, or use your browser’s print dialog (Save as PDF).`
          : 'Try again, or use your browser’s print dialog (Save as PDF).',
      );
    } finally {
      if (wrapper?.parentNode) wrapper.parentNode.removeChild(wrapper);
      setPdfBusy(false);
      onDownloadEnd?.();
    }
  }, [data, onDownloadEnd, onDownloadStart, pdfBusy, ref]);

  if (!data) return null;

  return (
    <>
      <article ref={ref} className="ndx-estimate-report">
        <header className="ndx-estimate-report__doc-head">
          <div className="ndx-estimate-report__brand">
            <img src={botLogo} alt="" width={44} height={44} decoding="async" />
            <p className="ndx-estimate-report__brand-meta">
              <strong>BalochDev</strong>
              <span>Project estimate</span>
            </p>
          </div>
          <p className="ndx-estimate-report__doc-label">
            Document
            <br />
            {formatDocDate(data.generatedAt)}
          </p>
        </header>

        <div className="ndx-estimate-report__body">
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

          <section className="ndx-estimate-report__section">
            <h3 className="ndx-estimate-report__section-title">At a glance</h3>
            <div className="ndx-estimate-stat-grid">
              <div className="ndx-estimate-stat">
                <span className="ndx-estimate-stat__label">Low</span>
                <span className="ndx-estimate-stat__value">{formatUsd(data.totals?.low)}</span>
              </div>
              <div className="ndx-estimate-stat">
                <span className="ndx-estimate-stat__label">High</span>
                <span className="ndx-estimate-stat__value ndx-estimate-stat__value--accent">{formatUsd(data.totals?.high)}</span>
              </div>
              <div className="ndx-estimate-stat">
                <span className="ndx-estimate-stat__label">Timeframe</span>
                <span className="ndx-estimate-stat__value" style={{ fontSize: '0.95rem' }}>
                  {timeframeLabel}
                </span>
              </div>
            </div>
            <CostRangeChart low={data.totals?.low} high={data.totals?.high} />
            {data.totals?.notes ? (
              <p className="ndx-estimate-stat__hint" style={{ marginTop: '0.85rem' }}>
                {data.totals.notes}
              </p>
            ) : null}
            {data.totals?.requiresCall ? (
              <p className="ndx-estimate-stat__hint" style={{ color: 'var(--ndx-accent)' }}>
                Scope likely needs a scoping call before a firm quote.
              </p>
            ) : null}
          </section>

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
                          {item.billing === 'monthly' ? <span className="ndx-estimate-table__hint"> / mo</span> : null}
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
            <section className="ndx-estimate-report__section" style={{ borderTop: 'none', paddingTop: 0 }}>
              <div className="ndx-estimate-next">
                <h3 className="ndx-estimate-report__section-title">Next step</h3>
                <p className="ndx-estimate-next__title">{data.nextStep.title}</p>
                {data.nextStep.detail ? <p className="ndx-estimate-next__detail">{data.nextStep.detail}</p> : null}
                <Link to="/contact/" className="ndx-btn ndx-btn-primary">
                  {data.nextStep.ctaLabel || 'Contact BalochDev'}
                </Link>
              </div>
            </section>
          ) : null}

          <div className="ndx-estimate-report__actions">
            <button
              type="button"
              className="ndx-btn ndx-btn-primary"
              onClick={handleDownloadPdf}
              disabled={pdfBusy}
            >
              {pdfBusy ? 'Preparing PDF…' : 'Download report (PDF)'}
            </button>
          </div>
        </div>
      </article>

      <PdfAlertModal open={!!pdfError} message={pdfError} onClose={() => setPdfError('')} />
    </>
  );
});

export default EstimateReport;
