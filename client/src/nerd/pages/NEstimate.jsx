import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Seo from '../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../seo/seoFromData';
import EstimateHero from '../components/EstimateHero';
import EstimateReport from '../components/EstimateReport';
import EstimateChat from '../components/estimate/EstimateChat';
import EstimatePublicNotice from '../components/estimate/EstimatePublicNotice';
import { apiUrl } from '../../lib/api';
import { getVisitorKey } from '../lib/visitorKey';
import {
  getActiveEstimateProject,
  getEstimateQuota,
  loadEstimateSession,
  saveEstimateSession,
  utcDayKey,
} from '../lib/estimateSession';
import '../components/estimate.css';

const ESTIMATE_SEO = STATIC_PUBLIC_PAGES_SEO['/estimate'];
const DEFAULT_LIMIT = 3;

export default function NEstimate() {
  const initialQuota = getEstimateQuota();
  const [projectId, setProjectId] = useState(() => getActiveEstimateProject()?.id);
  const [report, setReport] = useState(() => loadEstimateSession()?.report ?? null);
  const [remaining, setRemaining] = useState(() => initialQuota.remaining);
  const [limit, setLimit] = useState(() => initialQuota.limit || DEFAULT_LIMIT);
  const [used, setUsed] = useState(() => initialQuota.used);
  const [err, setErr] = useState(null);
  const reportRef = useRef(null);

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(ESTIMATE_SEO.metaTitle), []);
  const seoDescription = useMemo(() => capDescription(ESTIMATE_SEO.metaDescription), []);

  const applyQuota = useCallback((data) => {
    const nextLimit = typeof data?.limit === 'number' ? data.limit : undefined;
    const nextUsed = typeof data?.used === 'number' ? data.used : undefined;
    const nextRemaining = typeof data?.remaining === 'number' ? data.remaining : undefined;
    const day = typeof data?.day === 'string' ? data.day : utcDayKey();

    if (nextLimit !== undefined) setLimit(nextLimit);
    if (nextUsed !== undefined) setUsed(nextUsed);
    if (nextRemaining !== undefined) setRemaining(nextRemaining);

    saveEstimateSession({
      ...(nextLimit !== undefined ? { limit: nextLimit } : {}),
      ...(nextUsed !== undefined ? { used: nextUsed } : {}),
      ...(nextRemaining !== undefined ? { remaining: nextRemaining } : {}),
      quotaDay: day,
    });
  }, []);

  const refreshQuota = useCallback(async () => {
    // Local UTC-day rollover first (used → 0, remaining → 3) if the day changed.
    const local = getEstimateQuota();
    setLimit(local.limit || DEFAULT_LIMIT);
    setUsed(local.used);
    setRemaining(local.remaining);

    try {
      const key = encodeURIComponent(getVisitorKey());
      const res = await fetch(apiUrl(`/api/estimate?visitor_key=${key}`));
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      applyQuota(data);
    } catch {
      // keep rolled-over local quota
    }
  }, [applyQuota]);

  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  // When the tab is focused again (or next day), re-sync quota.
  useEffect(() => {
    const onFocus = () => refreshQuota();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshQuota();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refreshQuota]);

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} canonicalPath={ESTIMATE_SEO.canonicalPath} />
      <EstimatePublicNotice />
      <EstimateHero />
      <section className="ndx-section ndx-estimate-page" style={{ paddingTop: '2.5rem' }}>
        <div className="ndx-container ndx-estimate-page__inner">
          {err ? (
            <p role="alert" className="ndx-estimate-chat__error">
              {err}
            </p>
          ) : null}

          <EstimateChat
            key={projectId}
            projectId={projectId}
            remaining={remaining}
            limit={limit}
            used={used}
            onQuota={applyQuota}
            onRemaining={setRemaining}
            onReport={setReport}
            onError={setErr}
            onProjectChange={setProjectId}
          />

          {report ? <EstimateReport ref={reportRef} report={report} /> : null}
        </div>
      </section>
    </>
  );
}
