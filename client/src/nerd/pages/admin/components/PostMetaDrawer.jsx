import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TbX } from 'react-icons/tb';
import PostMetaPanel from './PostMetaPanel';

export default function PostMetaDrawer({ open, onClose, panelProps }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="ndx-admin-drawer-backdrop"
            aria-label="Close settings panel"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="ndx-admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Publishing and SEO settings"
            initial={reduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ndx-admin-drawer-head">
              <div>
                <p className="ndx-admin-drawer-eyebrow">Settings</p>
                <h3 className="ndx-admin-drawer-title">Publishing & SEO</h3>
              </div>
              <button type="button" className="ndx-admin-drawer-close" onClick={onClose} aria-label="Close">
                <TbX aria-hidden />
              </button>
            </div>
            <div className="ndx-admin-drawer-body">
              <PostMetaPanel {...panelProps} variant="drawer" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
