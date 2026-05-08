import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_Y = 'balochdev-vcta-y';
const STORAGE_OPEN = 'balochdev-vcta-open';

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Collapsible vertical “Book a call” rail: drag vertically, persist Y; chevrons expand/collapse. */
export default function VerticalBookCTA() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_OPEN) !== '0';
    } catch {
      return true;
    }
  });
  const [yPx, setYPx] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_Y);
      if (s != null) {
        const n = parseFloat(s);
        if (!Number.isNaN(n)) return n;
      }
    } catch {
      /* ignore */
    }
    return typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.38) : 320;
  });

  const dragRef = useRef(null);
  const startRef = useRef({ y0: 0, ptr0: 0, dragging: false });

  const persistY = useCallback((v) => {
    setYPx(v);
    try {
      localStorage.setItem(STORAGE_Y, String(v));
    } catch {
      /* ignore */
    }
  }, []);

  const onOpenToggle = () => {
    setOpen((o) => {
      const next = !o;
      try {
        localStorage.setItem(STORAGE_OPEN, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  useEffect(() => {
    const onResize = () => {
      setYPx((cur) => clamp(cur, 72, window.innerHeight - 72));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onPointerDown = (e) => {
    if (!dragRef.current) return;
    startRef.current = { y0: yPx, ptr0: e.clientY, dragging: true };
    dragRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!startRef.current.dragging) return;
    const dy = e.clientY - startRef.current.ptr0;
    const next = clamp(startRef.current.y0 + dy, 72, window.innerHeight - 72);
    persistY(next);
  };

  const onPointerUp = (e) => {
    startRef.current.dragging = false;
    if (dragRef.current?.hasPointerCapture?.(e.pointerId)) {
      dragRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <aside
      className={`ndx-vcta ${open ? 'ndx-vcta--open' : 'ndx-vcta--closed'}`}
      style={{ top: `${yPx}px` }}
      aria-label="Book a call"
    >
      <div
        ref={dragRef}
        className="ndx-vcta__drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        title="Drag to move"
        role="presentation"
      />

      {open ? (
        <Link to="/contact" className="ndx-vcta__link">
          Book a 30-minute call
        </Link>
      ) : null}

      <button type="button" className="ndx-vcta__toggle" onClick={onOpenToggle} aria-expanded={open}>
        <span className={`bx ${open ? 'bx-chevrons-left' : 'bx-chevrons-right'}`} aria-hidden />
        <span className="visually-hidden">{open ? 'Collapse' : 'Expand'} booking strip</span>
      </button>
    </aside>
  );
}
