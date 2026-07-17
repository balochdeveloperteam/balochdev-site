import { Link } from 'react-router-dom';
import './AiEstimatePromo.css';

/**
 * Always-on product promo for the AI estimator.
 * Swap /brand/ai-estimate-promo.svg anytime — no CMS required.
 */
export default function AiEstimatePromo({ className = '' }) {
  return (
    <aside className={`ndx-ai-promo ${className}`.trim()} aria-label="AI project estimate">
      <div className="ndx-container ndx-ai-promo__inner">
        <img
          className="ndx-ai-promo__icon"
          src="/brand/ai-estimate-promo.svg"
          alt=""
          width={64}
          height={64}
          decoding="async"
        />
        <div className="ndx-ai-promo__copy">
          <p className="ndx-ai-promo__eyebrow">AI estimator</p>
          <p className="ndx-ai-promo__line">
            Get a catalog-based ballpark for web, mobile, or AI work in a short chat — free, no pitch deck.
          </p>
        </div>
        <Link to="/estimate" className="ndx-btn ndx-btn-primary ndx-ai-promo__cta">
          Try AI estimate
        </Link>
      </div>
    </aside>
  );
}
