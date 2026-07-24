import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useBookCall } from './BookCallContext';

const STORAGE_KEY = 'balochdev-book-prompt-dismissed';
const DELAY_MS = 45_000;

function isPrivatePath(pathname) {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/team') ||
    pathname.startsWith('/login')
  );
}

/** Soft delayed invite: discuss your project with the Baloch Dev CEO. */
export default function BookCallPrompt() {
  const { pathname } = useLocation();
  const { openBookCall } = useBookCall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isPrivatePath(pathname)) {
      setVisible(false);
      return undefined;
    }
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return undefined;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setVisible(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const onBook = () => {
    dismiss();
    openBookCall();
  };

  if (!visible || isPrivatePath(pathname)) return null;

  return (
    <div className="ndx-book-prompt" role="dialog" aria-labelledby="ndx-book-prompt-title">
      <button type="button" className="ndx-book-prompt__dismiss" onClick={dismiss} aria-label="Dismiss">
        <span className="bx bx-x" aria-hidden />
      </button>
      <p className="ndx-book-prompt__eyebrow">Quick question</p>
      <h2 id="ndx-book-prompt-title" className="ndx-book-prompt__title">
        Want to discuss your project with the Baloch Dev CEO?
      </h2>
      <p className="ndx-book-prompt__copy">
        Pick a 30‑minute slot — no pitch deck required. We will talk scope, timeline, and whether we are a fit.
      </p>
      <div className="ndx-book-prompt__row">
        <button type="button" className="ndx-btn ndx-btn-primary" onClick={onBook}>
          Book a call now
        </button>
        <button type="button" className="ndx-btn" onClick={dismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}
