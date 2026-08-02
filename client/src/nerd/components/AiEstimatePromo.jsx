import { Link } from 'react-router-dom';
import botLogo from '../../assets/BalochDevLogo/botlogo.webp';
import './AiEstimatePromo.css';

/**
 * Always-on product promo for the AI estimator.
 */
export default function AiEstimatePromo({ className = '' }) {
  return (
    <aside className={`ndx-ai-promo ${className}`.trim()} aria-label="AI project estimate">
      <div className="ndx-container ndx-ai-promo__wrap">
        <div className="ndx-ai-promo__card">
          <img
            className="ndx-ai-promo__icon"
            src={botLogo}
            alt=""
            width={160}
            height={160}
            decoding="async"
            aria-hidden
          />

          <div className="ndx-ai-promo__copy">
            <p className="ndx-ai-promo__eyebrow">Free AI estimate</p>
            <p className="ndx-ai-promo__title">Estimate your next build</p>
            <p className="ndx-ai-promo__line">
              Answer a few questions and get a clear cost range for web, mobile, or AI — in minutes.
            </p>
          </div>

          <Link to="/estimate/" className="ndx-btn ndx-btn-primary ndx-ai-promo__cta">
            Start estimate
          </Link>
        </div>
      </div>
    </aside>
  );
}
