/**
 * Shared FAQ accordion — animated open/close used across home + marketing pages.
 * Pass { q, a } items; optional FAQPage JSON-LD via faqPageJsonLd().
 */
import { useId, useState } from 'react';

/**
 * @param {{ q: string, a: string }[]} items
 * @returns {object} schema.org FAQPage
 */
export function faqPageJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/**
 * @param {{
 *   items: { q: string, a: string }[],
 *   className?: string,
 *   defaultOpenIndex?: number | null,
 *   allowMultiple?: boolean,
 * }} props
 */
export default function FaqAccordion({
  items,
  className = '',
  defaultOpenIndex = 0,
  allowMultiple = false,
}) {
  const baseId = useId();
  const [openSet, setOpenSet] = useState(() => {
    if (defaultOpenIndex == null || defaultOpenIndex < 0) return new Set();
    return new Set([defaultOpenIndex]);
  });

  const toggle = (index) => {
    setOpenSet((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={`ndx-faq-stack ${className}`.trim()}>
      {items.map((item, index) => {
        const open = openSet.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-btn-${index}`;
        return (
          <div
            key={item.q}
            className={`ndx-faq-item${open ? ' is-open' : ''}`}
          >
            <button
              type="button"
              id={buttonId}
              className="ndx-faq-q"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(index)}
            >
              <span className="ndx-faq-q__text">{item.q}</span>
              <span className="ndx-faq-q__icon" aria-hidden>
                <i className="bx bx-plus" />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="ndx-faq-a-wrap"
            >
              <div className="ndx-faq-a-inner">
                <div className="ndx-faq-a">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
