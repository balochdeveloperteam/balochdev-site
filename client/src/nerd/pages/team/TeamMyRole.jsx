import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useTeam } from './TeamContext';
import { TeamBlockSkeleton } from './components/TeamSkeleton';

const emptyForm = { title: '', description: '', ordering: 0 };

export default function TeamMyRole() {
  const { member, canManageTeam, isAdmin, showToast } = useTeam();
  const reduceMotion = useReducedMotion();
  const [allMembers, setAllMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(member?.id || '');
  const [selectedMember, setSelectedMember] = useState(member);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const canEdit = canManageTeam;

  const loadMembers = useCallback(async () => {
    if (!supabase || !canManageTeam) return;
    const { data } = await supabase
      .from('team_members')
      .select('id, full_name, role_title, department')
      .order('full_name', { ascending: true });
    setAllMembers(data || []);
  }, [canManageTeam]);

  const loadResponsibilities = useCallback(
    async (memberId) => {
      if (!supabase || !memberId) return;
      setLoading(true);
      setError('');
      const { data, error: err } = await supabase
        .from('member_responsibilities')
        .select('id, title, description, ordering')
        .eq('member_id', memberId)
        .order('ordering', { ascending: true });
      if (err) {
        setError(err.message);
        showToast('Could not load responsibilities', 'error');
        setRows([]);
      } else {
        setRows(data || []);
      }
      setLoading(false);
    },
    [showToast],
  );

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    const id = canManageTeam ? selectedId : member?.id;
    if (!id) return;
    if (canManageTeam) {
      const picked = allMembers.find((m) => m.id === id) || member;
      setSelectedMember(picked);
    } else {
      setSelectedMember(member);
    }
    loadResponsibilities(id);
  }, [selectedId, member, canManageTeam, allMembers, loadResponsibilities]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!supabase || !canEdit) return;
    const targetId = canManageTeam ? selectedId : member.id;
    const payload = {
      member_id: targetId,
      title: form.title.trim(),
      description: form.description.trim(),
      ordering: Number(form.ordering) || 0,
    };
    if (!payload.title) {
      showToast('Title is required', 'error');
      return;
    }
    try {
      const query = editingId
        ? supabase.from('member_responsibilities').update(payload).eq('id', editingId)
        : supabase.from('member_responsibilities').insert(payload);
      const { error: err } = await query;
      if (err) throw err;
      showToast(editingId ? 'Responsibility updated' : 'Responsibility added', 'success');
      resetForm();
      loadResponsibilities(targetId);
    } catch (err) {
      showToast(
        err.message ||
          (isAdmin ? 'Could not save' : 'Could not save — manager write may need a DB policy update'),
        'error',
      );
    }
  };

  const onEditRow = (row) => {
    setEditingId(row.id);
    setForm({ title: row.title, description: row.description || '', ordering: row.ordering ?? 0 });
  };

  const onDelete = async (rowId) => {
    if (!supabase || !canEdit) return;
    if (!window.confirm('Delete this responsibility?')) return;
    const targetId = canManageTeam ? selectedId : member.id;
    const { error: err } = await supabase.from('member_responsibilities').delete().eq('id', rowId);
    if (err) {
      showToast(err.message || 'Could not delete', 'error');
      return;
    }
    showToast('Deleted', 'success');
    if (editingId === rowId) resetForm();
    loadResponsibilities(targetId);
  };

  const memberOptions = useMemo(() => {
    if (!canManageTeam) return [];
    return allMembers.length ? allMembers : member ? [member] : [];
  }, [allMembers, canManageTeam, member]);

  return (
    <div className="ndx-page-rich">
      <motion.div
        className="ndx-team-page-head"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="ndx-eyebrow">Role card</p>
        <h2 className="ndx-h2">My role & responsibilities</h2>
        <p className="ndx-lead">
          {canEdit
            ? 'View or manage responsibility rows for each team member.'
            : 'Your role definition and assigned responsibilities.'}
        </p>
      </motion.div>

      {canManageTeam ? (
        <label className="ndx-team-field" style={{ maxWidth: 360 }}>
          <span>Team member</span>
          <select
            className="ndx-team-input"
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              resetForm();
            }}
          >
            {memberOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {selectedMember ? (
        <div className="ndx-card ndx-glass-section ndx-team-panel">
          <h3 className="ndx-h3">{selectedMember.full_name}</h3>
          <p className="ndx-tech-blurb">{selectedMember.role_title}</p>
          <p className="ndx-tech-blurb">{selectedMember.department}</p>
        </div>
      ) : null}

      {error ? <p className="ndx-team-alert" role="alert">{error}</p> : null}

      {loading ? (
        <TeamBlockSkeleton />
      ) : rows.length === 0 ? (
        <div className="ndx-team-empty" style={{ marginBottom: '1.25rem' }}>
          <p className="ndx-lead">No responsibilities listed yet.</p>
          {canEdit ? (
            <p className="ndx-tech-blurb">Add the first row below — you can paste policy text later.</p>
          ) : null}
        </div>
      ) : (
        <div className="ndx-team-resp-list">
          {rows.map((row, index) => (
            <motion.article
              key={row.id}
              className="ndx-team-resp-item"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: reduceMotion ? 0 : index * 0.03 }}
            >
              <div className="ndx-team-resp-item-head">
                <p className="ndx-team-resp-title">{row.title}</p>
                <span className="ndx-team-resp-order">#{row.ordering}</span>
              </div>
              {row.description ? <p className="ndx-team-resp-desc">{row.description}</p> : null}
              {canEdit ? (
                <div className="ndx-team-resp-actions" style={{ marginTop: '0.75rem' }}>
                  <button type="button" className="ndx-btn" onClick={() => onEditRow(row)}>
                    Edit
                  </button>
                  <button type="button" className="ndx-btn" onClick={() => onDelete(row.id)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      )}

      {canEdit ? (
        <div className="ndx-card ndx-team-form-card">
          <h3 className="ndx-h3">{editingId ? 'Edit responsibility' : 'Add responsibility'}</h3>
          <form onSubmit={onSave} className="ndx-team-form" style={{ marginTop: '0.75rem' }}>
            <label className="ndx-team-field">
              <span>Title</span>
              <input
                className="ndx-team-input"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </label>
            <label className="ndx-team-field">
              <span>Description</span>
              <textarea
                className="ndx-team-input"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label className="ndx-team-field">
              <span>Ordering</span>
              <input
                type="number"
                className="ndx-team-input"
                value={form.ordering}
                onChange={(e) => setForm((f) => ({ ...f, ordering: e.target.value }))}
                style={{ maxWidth: 120 }}
              />
            </label>
            <div className="ndx-team-form-actions">
              {editingId ? (
                <button type="button" className="ndx-btn" onClick={resetForm}>
                  Cancel edit
                </button>
              ) : null}
              <button type="submit" className="ndx-btn ndx-btn-primary">
                {editingId ? 'Save changes' : 'Add row'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
