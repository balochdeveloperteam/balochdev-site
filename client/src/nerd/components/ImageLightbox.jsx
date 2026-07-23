import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./ImageLightbox.css";

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        d="M6.5 6.5l11 11M17.5 6.5l-11 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevron({ dir }) {
  const d = dir === "prev" ? "M14.5 6.5L9 12l5.5 5.5" : "M9.5 6.5L15 12l-5.5 5.5";
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Fullscreen gallery lightbox — big image + prev/next.
 * @param {{ images: string[], index: number, alt?: string, onClose: () => void, onIndexChange: (i: number) => void }} props
 */
export default function ImageLightbox({ images, index, alt = "Screenshot", onClose, onIndexChange }) {
  const total = images?.length ?? 0;
  const safeIndex = total ? ((index % total) + total) % total : 0;
  const src = total ? images[safeIndex] : null;

  const go = useCallback(
    (delta) => {
      if (!total) return;
      onIndexChange((safeIndex + delta + total) % total);
    },
    [onIndexChange, safeIndex, total],
  );

  useEffect(() => {
    if (!src) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [src, onClose, go]);

  if (!src || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="ndx-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      onClick={onClose}
    >
      <button type="button" className="ndx-lightbox__close" aria-label="Close" onClick={onClose}>
        <IconClose />
      </button>

      {total > 1 ? (
        <>
          <button
            type="button"
            className="ndx-lightbox__nav ndx-lightbox__nav--prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <IconChevron dir="prev" />
          </button>
          <button
            type="button"
            className="ndx-lightbox__nav ndx-lightbox__nav--next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <IconChevron dir="next" />
          </button>
        </>
      ) : null}

      <div
        className="ndx-lightbox__stage"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={`${alt} ${safeIndex + 1}`} className="ndx-lightbox__img" />
        {total > 1 ? (
          <p className="ndx-lightbox__counter">
            {safeIndex + 1} / {total}
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
