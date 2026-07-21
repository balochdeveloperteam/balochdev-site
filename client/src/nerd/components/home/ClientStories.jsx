import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AGGREGATE_RATING,
  initialsFromName,
  projectReviews,
} from '../../data/projectReviews';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

export default function ClientStories() {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const reviews = projectReviews;

  useEffect(() => {
    if (reducedMotion || reviews.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [reducedMotion, reviews.length]);

  if (!reviews.length) return null;

  return (
    <section className="ndx-section ndx-section-tight ndx-home-reviews">
      <div className="ndx-container">
        <div className="ndx-home-reviews__layout">
          <div className="ndx-home-reviews__stories">
            <p className="ndx-eyebrow">Client stories</p>

            <div
              className={`ndx-home-reviews__stage${reducedMotion ? ' ndx-home-reviews__stage--static' : ''}`}
              aria-live="polite"
            >
              {reviews.map((r, i) => {
                const active = i === index;
                return (
                  <blockquote
                    key={r.id}
                    className={`ndx-home-reviews__quote${active ? ' is-active' : ''}`}
                    aria-hidden={!active}
                  >
                    <p>“{r.quote}”</p>
                    <footer className="ndx-home-reviews__author">
                      <span className="ndx-home-reviews__avatar" aria-hidden>
                        {initialsFromName(r.name)}
                      </span>
                      <span className="ndx-home-reviews__who">
                        <strong>{r.name}</strong>
                        <span>
                          {r.role} — {r.company}
                        </span>
                        <Link
                          to={`/projects/${r.projectSlug}`}
                          className="ndx-home-reviews__project"
                          tabIndex={active ? 0 : -1}
                        >
                          Project · {r.company}
                        </Link>
                      </span>
                    </footer>
                  </blockquote>
                );
              })}
            </div>

            <div className="ndx-home-reviews__dots" role="tablist" aria-label="Client stories">
              {reviews.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Story ${i + 1} of ${reviews.length}`}
                  className={`ndx-home-reviews__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>

          <aside className="ndx-home-reviews__rating" aria-label="Aggregate rating">
            <p className="ndx-home-reviews__rating-label">Aggregate rating</p>
            <p className="ndx-home-reviews__rating-score">
              {AGGREGATE_RATING.score}
              <span>/{AGGREGATE_RATING.outOf}</span>
            </p>
            <p className="ndx-home-reviews__stars" aria-hidden>
              ★★★★★
            </p>
            <p className="ndx-home-reviews__rating-note">{AGGREGATE_RATING.label}</p>
            <div className="ndx-home-reviews__platforms">
              {AGGREGATE_RATING.platforms.map((p) =>
                p.href ? (
                  <a key={p.name} href={p.href} className="ndx-home-reviews__pill" target="_blank" rel="noreferrer">
                    {p.name}
                  </a>
                ) : (
                  <span key={p.name} className="ndx-home-reviews__pill ndx-home-reviews__pill--soon" title="Link coming soon">
                    {p.name}
                  </span>
                ),
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
