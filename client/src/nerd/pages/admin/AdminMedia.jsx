import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TbCopy, TbPencil, TbTrash, TbUpload } from 'react-icons/tb';

import { apiUrl } from '../../../lib/api';
import AdminEditorModal from './components/editor/AdminEditorModal';
import { useAdmin } from './AdminContext';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

async function uploadToCloudinary(token, file) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', 'balochdev/blog');
  const res = await fetch(apiUrl('/api/uploads/image'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  if (!data.secureUrl) throw new Error('Upload succeeded but no URL returned');
  return data;
}

/** Brief auto-dismissing bottom-right notice. Replaces native alert() for copy/save/delete. */
function useTransientToast() {
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);
  const show = useCallback((text) => {
    setMessage(text);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setMessage(''), 2200);
  }, []);
  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);
  return { message, show };
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to legacy path */
    }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

function MediaTile({ asset, onEdit, onDelete, onCopy }) {
  return (
    <article className="ndx-admin-media-tile ndx-glass-section">
      <div className="ndx-admin-media-tile__thumb">
        <img src={asset.secure_url} alt={asset.alt || ''} loading="lazy" />
        <div className="ndx-admin-media-tile__actions">
          <button
            type="button"
            className="ndx-admin-media-icon-btn"
            onClick={() => onCopy(asset)}
            title="Copy URL"
            aria-label="Copy URL"
          >
            <TbCopy aria-hidden />
          </button>
          <button
            type="button"
            className="ndx-admin-media-icon-btn"
            onClick={() => onEdit(asset)}
            title="Edit alt + caption"
            aria-label="Edit alt and caption"
          >
            <TbPencil aria-hidden />
          </button>
          <button
            type="button"
            className="ndx-admin-media-icon-btn ndx-admin-media-icon-btn--danger"
            onClick={() => onDelete(asset)}
            title="Delete image"
            aria-label="Delete image"
          >
            <TbTrash aria-hidden />
          </button>
        </div>
      </div>
      <div className="ndx-admin-media-tile__meta">
        <p className="ndx-admin-media-tile__alt" title={asset.alt}>
          {asset.alt || <span className="ndx-admin-field-hint">No alt text</span>}
        </p>
        <p className="ndx-admin-media-tile__url" title={asset.secure_url}>
          {asset.secure_url}
        </p>
      </div>
    </article>
  );
}

export default function AdminMedia() {
  const { authFetch, token } = useAdmin();
  const reduceMotion = useReducedMotion();
  const fileInputRef = useRef(null);

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editAlt, setEditAlt] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useTransientToast();

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await authFetch('/api/media');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not load media');
      setAssets(Array.isArray(data.assets) ? data.assets : []);
    } catch (e) {
      setErr(e.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const onPickFile = useCallback(() => {
    if (!uploading) fileInputRef.current?.click();
  }, [uploading]);

  const onFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      if (!ALLOWED_MIME.includes(file.type)) {
        toast.show('Only JPEG, PNG, WebP, GIF.');
        return;
      }
      if (!token) {
        toast.show('You must be signed in.');
        return;
      }
      setUploading(true);
      setErr('');
      try {
        const cloud = await uploadToCloudinary(token, file);
        const recordRes = await authFetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cloudinary_public_id: cloud.publicId,
            secure_url: cloud.secureUrl,
            folder: 'balochdev/blog',
            width: cloud.width,
            height: cloud.height,
            format: cloud.format,
            alt: '',
            caption: '',
          }),
        });
        const recordData = await recordRes.json().catch(() => ({}));
        if (!recordRes.ok) throw new Error(recordData.error || 'Could not record asset');
        setAssets((prev) => {
          const without = prev.filter((a) => a.cloudinary_public_id !== recordData.asset.cloudinary_public_id);
          return [recordData.asset, ...without];
        });
        toast.show('Uploaded.');
      } catch (uploadErr) {
        setErr(uploadErr.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [authFetch, token, toast],
  );

  const onCopy = useCallback(
    async (asset) => {
      const ok = await copyToClipboard(asset.secure_url);
      toast.show(ok ? 'URL copied to clipboard.' : 'Could not copy — select manually.');
    },
    [toast],
  );

  const openEdit = useCallback((asset) => {
    setEditTarget(asset);
    setEditAlt(asset.alt || '');
    setEditCaption(asset.caption || '');
  }, []);

  const closeEdit = useCallback(() => {
    if (editSaving) return;
    setEditTarget(null);
  }, [editSaving]);

  const saveEdit = useCallback(async () => {
    if (!editTarget) return;
    setEditSaving(true);
    try {
      const res = await authFetch(`/api/media/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt: editAlt, caption: editCaption }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setAssets((prev) => prev.map((a) => (a.id === data.asset.id ? data.asset : a)));
      setEditTarget(null);
      toast.show('Saved.');
    } catch (e) {
      toast.show(e.message || 'Save failed');
    } finally {
      setEditSaving(false);
    }
  }, [authFetch, editAlt, editCaption, editTarget, toast]);

  const openDelete = useCallback((asset) => setDeleteTarget(asset), []);
  const closeDelete = useCallback(() => {
    if (!deleting) setDeleteTarget(null);
  }, [deleting]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/media/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.show('Image deleted.');
    } catch (e) {
      toast.show(e.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }, [authFetch, deleteTarget, toast]);

  const skeletonCount = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ndx-admin-page-head">
        <div>
          <p className="ndx-eyebrow">Media</p>
          <h2 className="ndx-h2">Image library</h2>
          <p className="ndx-admin-meta">
            Upload images once, reuse them across blog posts. Click <strong>Copy URL</strong> on any image and paste
            into the blog editor's <em>Insert image</em> modal.
          </p>
        </div>
        <div className="ndx-admin-page-head__actions">
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_MIME.join(',')}
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          <button
            type="button"
            className="ndx-btn ndx-btn-primary"
            onClick={onPickFile}
            disabled={uploading || !token}
          >
            <TbUpload aria-hidden /> {uploading ? 'Uploading…' : 'Upload image'}
          </button>
        </div>
      </div>

      {err ? <p className="ndx-admin-alert">{err}</p> : null}

      {loading ? (
        <div className="ndx-admin-media-grid">
          {skeletonCount.map((i) => (
            <div key={i} className="ndx-admin-media-tile ndx-admin-media-tile--skeleton" aria-hidden />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="ndx-admin-empty ndx-glass-section">
          <p className="ndx-eyebrow">Empty</p>
          <h3 className="ndx-h3 ndx-admin-empty-title">No images yet — upload one</h3>
          <p className="ndx-admin-empty-text">
            Use the <strong>Upload image</strong> button to add an image. It uploads to Cloudinary and appears here for
            reuse across blog posts.
          </p>
        </div>
      ) : (
        <div className="ndx-admin-media-grid">
          {assets.map((asset) => (
            <MediaTile key={asset.id} asset={asset} onCopy={onCopy} onEdit={openEdit} onDelete={openDelete} />
          ))}
        </div>
      )}

      <AdminEditorModal
        open={!!editTarget}
        title="Edit image details"
        onClose={closeEdit}
        footer={
          <>
            <button type="button" className="ndx-btn" onClick={closeEdit} disabled={editSaving}>
              Cancel
            </button>
            <button type="button" className="ndx-btn ndx-btn-primary" onClick={saveEdit} disabled={editSaving}>
              {editSaving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        {editTarget ? (
          <>
            <div className="ndx-admin-field">
              <span>Preview</span>
              <img
                src={editTarget.secure_url}
                alt={editTarget.alt || ''}
                className="ndx-admin-media-edit-preview"
              />
            </div>
            <label className="ndx-admin-field">
              <span>Alt text</span>
              <input
                className="ndx-admin-input"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Describe the image for SEO and accessibility"
                disabled={editSaving}
              />
            </label>
            <label className="ndx-admin-field">
              <span>Caption</span>
              <input
                className="ndx-admin-input"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Default caption suggested when inserting in the editor"
                disabled={editSaving}
              />
            </label>
          </>
        ) : null}
      </AdminEditorModal>

      <AdminEditorModal
        open={!!deleteTarget}
        title="Delete image?"
        onClose={closeDelete}
        footer={
          <>
            <button type="button" className="ndx-btn" onClick={closeDelete} disabled={deleting}>
              Cancel
            </button>
            <button
              type="button"
              className="ndx-btn ndx-btn--danger"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }
      >
        {deleteTarget ? (
          <>
            <p>
              This permanently removes the image from <strong>Cloudinary</strong> and the media library. Any post
              already referencing the URL will show a broken image. This cannot be undone.
            </p>
            <img
              src={deleteTarget.secure_url}
              alt={deleteTarget.alt || ''}
              className="ndx-admin-media-edit-preview"
            />
          </>
        ) : null}
      </AdminEditorModal>

      {toast.message ? (
        <div className="ndx-admin-toast" role="status" aria-live="polite">
          {toast.message}
        </div>
      ) : null}
    </motion.div>
  );
}
