import { CAL_URL, openCalInNewTab } from '../../lib/bookCall';
import { useBookCall } from './BookCallContext';

/**
 * Primary CTA: opens in-page Cal.com modal.
 * Pass `newTab` to open https://cal.com/baloch-dev/30min in a separate tab instead.
 */
export default function BookCallButton({
  children = 'Book a call',
  className = 'ndx-btn',
  newTab = false,
  type = 'button',
  ...rest
}) {
  const { openBookCall } = useBookCall();

  if (newTab) {
    return (
      <a
        href={CAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { onClick, ...btnRest } = rest;
  return (
    <button
      type={type}
      className={className}
      {...btnRest}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) openBookCall();
      }}
    >
      {children}
    </button>
  );
}

export { openCalInNewTab };
