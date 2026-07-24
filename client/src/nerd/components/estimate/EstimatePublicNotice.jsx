import { useEffect, useState } from 'react';
import { useBookCall } from '../bookCall/BookCallContext';

const STORAGE_KEY = 'balochdev-estimate-public-notice';

/**
 * Public AI estimate disclaimer — must acknowledge before using the chat.
 * Inspired by estimate.nerdheadz.com “Important Notice”.
 */
export default function EstimatePublicNotice() {
  const { openBookCall } = useBookCall();
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const acknowledge = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const onBookPrivate = () => {
    acknowledge();
    openBookCall();
  };

  if (!open) return null;

  return (
    <div className="ndx-estimate-notice" role="dialog" aria-modal="true" aria-labelledby="ndx-estimate-notice-title">
      <div className="ndx-estimate-notice__backdrop" aria-hidden="true" />
      <div className="ndx-estimate-notice__panel">
        <div className="ndx-estimate-notice__icon" aria-hidden="true">
          <span className="bx bx-error-circle" />
        </div>
        <h2 id="ndx-estimate-notice-title" className="ndx-estimate-notice__title">
          Important Notice
        </h2>
        <p className="ndx-estimate-notice__lead">
          This AI estimation tool is publicly accessible without login. Please be aware:
        </p>
        <ul className="ndx-estimate-notice__list">
          <li>
            <span className="bx bx-shield-x" aria-hidden="true" />
            <span>Do not share confidential business information, trade secrets, or proprietary details</span>
          </li>
          <li>
            <span className="bx bx-lock-open-alt" aria-hidden="true" />
            <span>Information shared here is not protected by an NDA</span>
          </li>
          <li>
            <span className="bx bx-calendar-check" aria-hidden="true" />
            <span>
              For sensitive projects, book a free private consultation with Baloch Dev — we can sign an NDA first
            </span>
          </li>
        </ul>
        <p className="ndx-estimate-notice__ack">
          By continuing, you acknowledge this is a public estimation tool.
        </p>
        <div className="ndx-estimate-notice__actions">
          <button type="button" className="ndx-estimate-notice__btn ndx-estimate-notice__btn--ghost" onClick={onBookPrivate}>
            <span className="bx bx-lock-alt" aria-hidden="true" />
            Book private consultation
          </button>
          <button type="button" className="ndx-estimate-notice__btn ndx-estimate-notice__btn--primary" onClick={acknowledge}>
            Continue to estimator
            <span className="bx bx-right-arrow-alt" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
