import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTeam } from './TeamContext';
import { TeamBlockSkeleton } from './components/TeamSkeleton';

const emptyForm = { title: '', description: '', ordering: 0 };

export default function TeamMyRole() {
  const { member, canManageTeam, isAdmin, showToast } = useTeam();
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
    <div>
      <div className="ndx-team-page-head">
        <p className="ndx-eyebrow">Role card</p>
        <h2 className="ndx-h2">My role & responsibilities</h2>
        <p className="ndx-lead">
          {canEdit
            ? 'View or manage responsibility rows for each team member.'
            : 'Your role definition and assigned responsibilities.'}
        </p>
      </div>

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
        <div className="ndx-card ndx-glass-section" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
          <h3 className="ndx-h3">{selectedMember.full_name}</h3>
          <p className="ndx-tech-blurb">{selectedMember.role_title}</p>
          <p className="ndx-tech-blurb">{selectedMember.department}</p>
        </div>
      ) : null}

      {error ? (
        <p role="alert" style={{ color: '#fecaca', marginBottom: '1rem' }}>
          {error}
        </p>
      ) : null}

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
        <div className="ndx-team-table-wrap ndx-card" style={{ marginBottom: '1.25rem' }}>
          <table className="ndx-team-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                {canEdit ? <th /> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.ordering}</td>
                  <td>{row.title}</td>
                  <td>{row.description}</td>
                  {canEdit ? (
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button type="button" className="ndx-btn" style={{ marginRight: '0.5rem' }} onClick={() => onEditRow(row)}>
                        Edit
                      </button>
                      <button type="button" className="ndx-btn" onClick={() => onDelete(row.id)}>
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canEdit ? (
        <div className="ndx-card" style={{ padding: '1rem' }}>
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
