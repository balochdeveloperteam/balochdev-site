import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TbX } from 'react-icons/tb';

export default function AdminEditorModal({
  open,
  title,
  children,
  onClose,
  footer,
  wide = false,
  ariaLabel,
}) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="ndx-admin-editor-modal-root" role="presentation">
      <div className="ndx-admin-editor-modal-backdrop" aria-hidden />
      <div
        ref={panelRef}
        className={`ndx-admin-editor-modal ndx-card${wide ? ' ndx-admin-editor-modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        <div className="ndx-admin-editor-modal-head">
          <h3 id={titleId} className="ndx-admin-editor-modal-title">
            {title}
          </h3>
          <button type="button" className="ndx-admin-editor-modal-x" onClick={onClose} aria-label="Close">
            <TbX aria-hidden />
          </button>
        </div>
        <div className="ndx-admin-editor-modal-body">{children}</div>
        {footer ? <div className="ndx-admin-editor-modal-foot">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
