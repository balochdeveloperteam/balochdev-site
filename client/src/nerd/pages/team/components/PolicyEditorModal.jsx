import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useTeamToast } from './TeamToast';

const inputClass = 'ndx-team-input';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'ethics', label: 'Ethics' },
  { value: 'data_safety', label: 'Data safety' },
  { value: 'social_boundaries', label: 'Social boundaries' },
  { value: 'trial', label: 'Trial' },
  { value: 'conduct', label: 'Conduct' },
];

/**
 * @param {{ policy?: object | null, onClose: () => void, onSaved: () => void }} props
 */
export default function PolicyEditorModal({ policy, onClose, onSaved }) {
  const { showToast } = useTeamToast();
  const isEdit = Boolean(policy?.id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: policy?.slug || '',
    title: policy?.title || '',
    category: policy?.category || 'general',
    content: policy?.content || '',
    ordering: policy?.ordering ?? 0,
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        category: form.category,
        content: form.content,
        ordering: Number(form.ordering) || 0,
      };
      if (!payload.slug || !payload.title) throw new Error('Slug and title are required');

      const query = isEdit
        ? supabase.from('policies').update(payload).eq('id', policy.id)
        : supabase.from('policies').insert(payload);
      const { error } = await query;
      if (error) throw error;
      showToast(isEdit ? 'Policy updated' : 'Policy created', 'success');
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message || 'Could not save policy', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ndx-team-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="ndx-team-modal ndx-card ndx-team-modal--wide"
        role="dialog"
        aria-labelledby="policy-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="policy-edit-title" className="ndx-h3">
          {isEdit ? 'Edit policy' : 'New policy'}
        </h2>
        <form onSubmit={onSubmit} className="ndx-team-form">
          <div className="ndx-team-field-row">
            <label className="ndx-team-field">
              <span>Slug</span>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                required
                placeholder="code-of-conduct"
              />
            </label>
            <label className="ndx-team-field">
              <span>Ordering</span>
              <input
                type="number"
                className={inputClass}
                value={form.ordering}
                onChange={(e) => set('ordering', e.target.value)}
              />
            </label>
          </div>
          <label className="ndx-team-field">
            <span>Title</span>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </label>
          <label className="ndx-team-field">
            <span>Category</span>
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="ndx-team-field">
            <span>Content (markdown)</span>
            <textarea
              className={inputClass}
              rows={12}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="## Section heading&#10;&#10;Policy text here…"
            />
          </label>
          <div className="ndx-team-form-actions">
            <button type="button" className="ndx-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ndx-btn ndx-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save policy' : 'Create policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
