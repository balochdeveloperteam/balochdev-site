import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

import { CAL_LINK, CAL_NAMESPACE, CAL_URL } from '../../lib/bookCall';
import { useBookCall } from './BookCallContext';

export default function BookCallModal() {
  const { open, closeBookCall } = useBookCall();

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      if (cancelled) return;
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeBookCall();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeBookCall]);

  if (!open) return null;

  return (
    <div className="ndx-book-modal" role="dialog" aria-modal="true" aria-labelledby="ndx-book-modal-title">
      <button type="button" className="ndx-book-modal__backdrop" aria-label="Close booking" onClick={closeBookCall} />
      <div className="ndx-book-modal__panel">
        <header className="ndx-book-modal__head">
          <div>
            <p className="ndx-book-modal__eyebrow">30‑minute call</p>
            <h2 id="ndx-book-modal-title" className="ndx-book-modal__title">
              Book time with Baloch Dev
            </h2>
          </div>
          <div className="ndx-book-modal__actions">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ndx-book-modal__ext"
            >
              Open in new tab
            </a>
            <button type="button" className="ndx-book-modal__close" onClick={closeBookCall} aria-label="Close">
              <span className="bx bx-x" aria-hidden />
            </button>
          </div>
        </header>
        <div className="ndx-book-modal__cal">
          <Cal
            namespace={CAL_NAMESPACE}
            calLink={CAL_LINK}
            style={{ width: '100%', height: '100%', minHeight: '100%', overflow: 'auto' }}
            config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
          />
        </div>
      </div>
    </div>
  );
}
