import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { apiUrl } from '../../../lib/api';
import { AD_PLACEMENTS } from '../../lib/adPlacements';
import { useAdmin } from './AdminContext';

function emptyForm() {
  return {
    id: null,
    image_url: '',
    image_alt: '',
    link_url: '',
    advertiser_name: '',
    notes: '',
    is_active: true,
    starts_at_local: '',
    ends_at_local: '',
  };
}

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value) {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function adToForm(ad) {
  if (!ad) return emptyForm();
  return {
    id: ad.id,
    image_url: ad.image_url || '',
    image_alt: ad.image_alt || '',
    link_url: ad.link_url || '',
    advertiser_name: ad.advertiser_name || '',
    notes: ad.notes || '',
    is_active: ad.is_active !== false,
    starts_at_local: toLocalInput(ad.starts_at),
    ends_at_local: toLocalInput(ad.ends_at),
  };
}

async function uploadAdImage(token, file) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', 'balochdev/ads');
  const res = await fetch(apiUrl('/api/uploads/image'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Upload failed');
  }
  return res.json();
}

function PlacementCard({ placement, ad, token, authFetch, onSaved, onDeleted }) {
  const [form, setForm] = useState(() => adToForm(ad));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setForm(adToForm(ad));
  }, [ad]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    setErr('');
    try {
      const data = await uploadAdImage(token, file);
      setField('image_url', data.secureUrl);
    } catch (uploadErr) {
      setErr(uploadErr.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onSave = async () => {
    setErr('');
    setMsg('');
    if (!form.image_url.trim()) {
      setErr('Upload an image before saving.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        placement: placement.id,
        image_url: form.image_url.trim(),
        image_alt: form.image_alt.trim(),
        link_url: form.link_url.trim(),
        advertiser_name: form.advertiser_name.trim(),
        notes: form.notes.trim(),
        is_active: form.is_active,
        starts_at: fromLocalInput(form.starts_at_local),
        ends_at: fromLocalInput(form.ends_at_local),
      };
      const path = form.id ? `/api/ads/admin/${form.id}` : '/api/ads/admin';
      const method = form.id ? 'PUT' : 'POST';
      const res = await authFetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setForm(adToForm(data.ad));
      setMsg('Saved.');
      onSaved();
    } catch (saveErr) {
      setErr(saveErr.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!form.id) {
      setForm(emptyForm());
      return;
    }
    if (!window.confirm(`Remove the ${placement.label} ad?`)) return;
    setSaving(true);
    setErr('');
    try {
      const res = await authFetch(`/api/ads/admin/${form.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setForm(emptyForm());
      setMsg('');
      onDeleted();
    } catch (deleteErr) {
      setErr(deleteErr.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const hasAd = Boolean(form.image_url);

  return (
    <article className="ndx-admin-ad-card ndx-glass-section">
      <header className="ndx-admin-ad-card__head">
        <div>
          <h3 className="ndx-admin-ad-card__title">{placement.label}</h3>
          <p className="ndx-admin-ad-card__desc">{placement.description}</p>
        </div>
        <label className="ndx-admin-ad-toggle">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setField('is_active', e.target.checked)}
          />
          Active
        </label>
      </header>

      <p className="ndx-admin-field-hint ndx-admin-ad-specs">
        <strong>Image specs:</strong> {placement.specs}
      </p>

      {hasAd ? (
        <img src={form.image_url} alt="" className="ndx-admin-ad-preview" />
      ) : (
        <div className="ndx-admin-ad-empty">No ad in this slot yet.</div>
      )}

      <div className="ndx-admin-field">
        <label>Image</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onUpload} />
        {uploading ? <span className="ndx-admin-field-hint">Uploading…</span> : null}
      </div>

      <div className="ndx-admin-field">
        <label htmlFor={`${placement.id}-alt`}>Image alt text</label>
        <input
          id={`${placement.id}-alt`}
          className="ndx-admin-input"
          value={form.image_alt}
          onChange={(e) => setField('image_alt', e.target.value)}
          placeholder="Describe the ad for accessibility"
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor={`${placement.id}-link`}>Click URL</label>
        <input
          id={`${placement.id}-link`}
          className="ndx-admin-input"
          value={form.link_url}
          onChange={(e) => setField('link_url', e.target.value)}
          placeholder="https://… (optional — no link if empty)"
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor={`${placement.id}-advertiser`}>Advertiser name</label>
        <input
          id={`${placement.id}-advertiser`}
          className="ndx-admin-input"
          value={form.advertiser_name}
          onChange={(e) => setField('advertiser_name', e.target.value)}
          placeholder="Internal label (optional)"
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor={`${placement.id}-starts`}>Starts at</label>
        <input
          id={`${placement.id}-starts`}
          type="datetime-local"
          className="ndx-admin-input ndx-admin-input--datetime"
          value={form.starts_at_local}
          onChange={(e) => setField('starts_at_local', e.target.value)}
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor={`${placement.id}-ends`}>Ends at</label>
        <input
          id={`${placement.id}-ends`}
          type="datetime-local"
          className="ndx-admin-input ndx-admin-input--datetime"
          value={form.ends_at_local}
          onChange={(e) => setField('ends_at_local', e.target.value)}
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor={`${placement.id}-notes`}>Internal notes</label>
        <textarea
          id={`${placement.id}-notes`}
          className="ndx-admin-textarea"
          rows={2}
          value={form.notes}
          onChange={(e) => setField('notes', e.target.value)}
          placeholder="Invoice ref, contact, etc."
        />
      </div>

      {err ? <p className="ndx-admin-alert">{err}</p> : null}
      {msg ? <p className="ndx-admin-save-ok">{msg}</p> : null}

      <div className="ndx-admin-ad-card__actions">
        <button type="button" className="ndx-btn ndx-btn-primary" onClick={onSave} disabled={saving || uploading}>
          {form.id ? 'Save changes' : 'Add ad'}
        </button>
        {hasAd || form.id ? (
          <button type="button" className="ndx-btn" onClick={onDelete} disabled={saving}>
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default function AdminAds() {
  const { authFetch, token } = useAdmin();
  const [placements, setPlacements] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const reduceMotion = useReducedMotion();

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await authFetch('/api/ads/admin');
      if (!res.ok) throw new Error('Could not load ads');
      const data = await res.json();
      setPlacements(data.placements || {});
    } catch (e) {
      setErr(e.message || 'Failed to load ads');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ndx-admin-page-head">
        <div>
          <p className="ndx-eyebrow">Ads</p>
          <h2 className="ndx-h2">Blog ad placements</h2>
          <p className="ndx-admin-meta">Manage hero and sidebar ads on the public blog. One live ad per slot (most recently updated wins if multiple are active).</p>
        </div>
      </div>

      {err ? <p className="ndx-admin-alert">{err}</p> : null}
      {loading ? <p className="ndx-lead">Loading placements…</p> : null}

      <div className="ndx-admin-ad-grid">
        {AD_PLACEMENTS.map((placement) => (
          <PlacementCard
            key={placement.id}
            placement={placement}
            ad={placements[placement.id]}
            token={token}
            authFetch={authFetch}
            onSaved={load}
            onDeleted={load}
          />
        ))}
      </div>
    </motion.div>
  );
}
