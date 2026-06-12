import { useEffect, useState } from 'react';
import { apiUrl } from '../../../../lib/api';
import { supabase } from '../../../../lib/supabase';
import { useTeamToast } from './TeamToast';

const inputClass = 'ndx-team-input';

/**
 * @param {{ member: object, session: object, onClose: () => void, onSaved: () => void }} props
 */
export default function MemberEditModal({ member, session, onClose, onSaved }) {
  const { showToast } = useTeamToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    role_title: member.role_title || '',
    department: member.department || '',
    access_role: member.access_role || 'member',
    status: member.status || 'active',
    trial_start_date: member.trial_start_date || '',
    trial_end_date: member.trial_end_date || '',
    avatar_url: member.avatar_url || '',
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      body.append('folder', 'balochdev/members');
      const res = await fetch(apiUrl('/api/uploads/image'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      set('avatar_url', data.secureUrl);
      showToast('Avatar uploaded', 'success');
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    try {
      const payload = {
        role_title: form.role_title.trim(),
        department: form.department.trim(),
        access_role: form.access_role,
        status: form.status,
        trial_start_date: form.trial_start_date || null,
        trial_end_date: form.trial_end_date || null,
        avatar_url: form.avatar_url || null,
      };
      const { error } = await supabase.from('team_members').update(payload).eq('id', member.id);
      if (error) throw error;
      showToast('Member updated', 'success');
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message || 'Could not save member', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ndx-team-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="ndx-team-modal ndx-card"
        role="dialog"
        aria-labelledby="member-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="member-edit-title" className="ndx-h3">
          Edit {member.full_name}
        </h2>
        <form onSubmit={onSubmit} className="ndx-team-form">
          <label className="ndx-team-field">
            <span>Role title</span>
            <input
              className={inputClass}
              value={form.role_title}
              onChange={(e) => set('role_title', e.target.value)}
              required
            />
          </label>
          <label className="ndx-team-field">
            <span>Department</span>
            <input
              className={inputClass}
              value={form.department}
              onChange={(e) => set('department', e.target.value)}
              required
            />
          </label>
          <label className="ndx-team-field">
            <span>Access role</span>
            <select
              className={inputClass}
              value={form.access_role}
              onChange={(e) => set('access_role', e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>
          </label>
          <label className="ndx-team-field">
            <span>Status</span>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            >
              <option value="trial">Trial</option>
              <option value="active">Active</option>
              <option value="warned">Warned</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <div className="ndx-team-field-row">
            <label className="ndx-team-field">
              <span>Trial start</span>
              <input
                type="date"
                className={inputClass}
                value={form.trial_start_date}
                onChange={(e) => set('trial_start_date', e.target.value)}
              />
            </label>
            <label className="ndx-team-field">
              <span>Trial end</span>
              <input
                type="date"
                className={inputClass}
                value={form.trial_end_date}
                onChange={(e) => set('trial_end_date', e.target.value)}
              />
            </label>
          </div>
          <label className="ndx-team-field">
            <span>Avatar</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onAvatarChange} />
            {uploading ? <p className="ndx-tech-blurb">Uploading…</p> : null}
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="" className="ndx-team-modal-avatar-preview" />
            ) : null}
          </label>
          <div className="ndx-team-form-actions">
            <button type="button" className="ndx-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ndx-btn ndx-btn-primary" disabled={saving || uploading}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
