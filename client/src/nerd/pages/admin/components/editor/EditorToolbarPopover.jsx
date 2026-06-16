import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';

export default function EditorToolbarPopover({
  open,
  onClose,
  anchorRef,
  children,
  className = '',
  placement = 'bottom-start',
}) {
  const popoverRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !popoverRef.current) return undefined;

    let cancelled = false;

    const update = () => {
      computePosition(anchorRef.current, popoverRef.current, {
        placement,
        middleware: [offset(6), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        if (!cancelled) setCoords({ top: y, left: x });
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, placement, children]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (event) => {
      const anchor = anchorRef.current;
      const popover = popoverRef.current;
      if (anchor?.contains(event.target) || popover?.contains(event.target)) return;
      onCloseRef.current();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={`ndx-blog-editor-toolbar-popover ${className}`.trim()}
      style={{ top: coords.top, left: coords.left }}
      role="dialog"
      aria-modal="false"
    >
      {children}
    </div>,
    document.body,
  );
}
