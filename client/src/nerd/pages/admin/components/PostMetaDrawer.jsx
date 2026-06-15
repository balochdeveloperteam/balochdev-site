import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TbX } from 'react-icons/tb';
import PostMetaPanel from './PostMetaPanel';

export default function PostMetaDrawer({ open, onClose, onSave, panelProps, saving = false }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, saving]);

  const drawer = (
    <AnimatePresence>
      {open && (
        <div className="ndx-admin-drawer-root" role="presentation">
          <motion.div
            className="ndx-admin-drawer-backdrop"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
              <button
                type="button"
                className="ndx-admin-drawer-close"
                onClick={onClose}
                disabled={saving}
                aria-label="Close settings"
              >
                <TbX aria-hidden />
              </button>
            </div>
            <div className="ndx-admin-drawer-body">
              <PostMetaPanel {...panelProps} variant="drawer" />
            </div>
            <div className="ndx-admin-drawer-foot">
              <button type="button" className="ndx-btn" disabled={saving} onClick={onClose}>
                Close
              </button>
              <button type="button" className="ndx-btn ndx-btn-primary" disabled={saving} onClick={onSave}>
                {saving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawer, document.body);
}
