import { useMemo, useRef, useState } from 'react';
import Seo from '../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../seo/seoFromData';
import EstimateHero from '../components/EstimateHero';
import EstimateReport from '../components/EstimateReport';
import EstimateChat from '../components/estimate/EstimateChat';
import '../components/estimate.css';

const ESTIMATE_SEO = STATIC_PUBLIC_PAGES_SEO['/estimate'];

export default function NEstimate() {
  const [report, setReport] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [err, setErr] = useState(null);
  const reportRef = useRef(null);

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(ESTIMATE_SEO.metaTitle), []);
  const seoDescription = useMemo(() => capDescription(ESTIMATE_SEO.metaDescription), []);

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} canonicalPath={ESTIMATE_SEO.canonicalPath} />
      <EstimateHero />
      <section className="ndx-section" style={{ paddingTop: '2.5rem' }}>
        <div className="ndx-container" style={{ maxWidth: '720px' }}>
          {err ? (
            <p role="alert" className="ndx-estimate-chat__error">
              {err}
            </p>
          ) : null}

          <EstimateChat
            remaining={remaining}
            onRemaining={setRemaining}
            onReport={setReport}
            onError={setErr}
          />

          {report ? <EstimateReport ref={reportRef} report={report} /> : null}
        </div>
      </section>
    </>
  );
}
