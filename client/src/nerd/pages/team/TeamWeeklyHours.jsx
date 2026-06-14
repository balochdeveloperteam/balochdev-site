import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useTeam } from './TeamContext';
import RejectHoursModal from './components/RejectHoursModal';
import TeamAvatar from './components/TeamAvatar';
import { TeamBlockSkeleton } from './components/TeamSkeleton';
import WeeklyHoursStatusBadge from './components/WeeklyHoursStatusBadge';
import {
  DAY_FIELDS,
  addWeeks,
  appendManagerReview,
  formatWeekRange,
  friendlyHoursError,
  getCurrentWeekSunday,
  getWeekRange,
  isRedWeek,
  mergeNotes,
  parseHourInput,
  splitNotes,
  sumHours,
} from './utils/weeklyHoursUtils';

const HOURS_SELECT =
  'id, member_id, week_start_date, week_end_date, project_task, task_details, hours_sun, hours_mon, hours_tue, hours_wed, hours_thu, hours_fri, hours_sat, total_hours, notes, status, reviewed_by, reviewed_at';

function emptyDayHours() {
  return Object.fromEntries(DAY_FIELDS.map(({ key }) => [key, '']));
}

function rowToForm(row) {
  const days = {};
  for (const { key } of DAY_FIELDS) {
    const v = row?.[key];
    days[key] = v != null ? String(v) : '';
  }
  const { memberNotes } = splitNotes(row?.notes || '');
  return {
    projectTask: row?.project_task || '',
    taskDetails: row?.task_details || '',
    memberNotes,
    days,
  };
}

function MemberHoursForm({ member, showToast }) {
  const currentSunday = useMemo(() => getCurrentWeekSunday(), []);
  const currentWeek = useMemo(() => getWeekRange(currentSunday), [currentSunday]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    projectTask: '',
    taskDetails: '',
    memberNotes: '',
    days: emptyDayHours(),
  });

  const loadData = useCallback(async () => {
    if (!supabase || !member?.id) return;
    setLoading(true);

    const [currentRes, historyRes] = await Promise.all([
      supabase
        .from('weekly_hours')
        .select(HOURS_SELECT)
        .eq('member_id', member.id)
        .eq('week_start_date', currentWeek.weekStart)
        .maybeSingle(),
      supabase
        .from('weekly_hours')
        .select(HOURS_SELECT)
        .eq('member_id', member.id)
        .lt('week_start_date', currentWeek.weekStart)
        .order('week_start_date', { ascending: false })
        .limit(24),
    ]);

    if (currentRes.error) {
      showToast(friendlyHoursError(currentRes.error), 'error');
    } else {
      setCurrentRow(currentRes.data);
      setForm(rowToForm(currentRes.data));
    }

    if (!historyRes.error) {
      setHistory(historyRes.data || []);
    }

    setLoading(false);
  }, [member?.id, currentWeek.weekStart, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const status = currentRow?.status || 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';
  const isEditable = !isApproved;
  const { managerReviewText } = splitNotes(currentRow?.notes || '');
  const liveTotal = sumHours(
    Object.fromEntries(DAY_FIELDS.map(({ key }) => [key, parseHourInput(form.days[key])])),
  );

  const updateDay = (key, value) => {
    setForm((prev) => ({ ...prev, days: { ...prev.days, [key]: value } }));
  };

  const save = async (nextStatus) => {
    if (!supabase || !member?.id || saving) return;
    setSaving(true);

    const payload = {
      member_id: member.id,
      week_start_date: currentWeek.weekStart,
      week_end_date: currentWeek.weekEnd,
      project_task: form.projectTask.trim(),
      task_details: form.taskDetails.trim(),
      notes: mergeNotes(form.memberNotes, currentRow?.notes || ''),
      status: nextStatus,
    };
    for (const { key } of DAY_FIELDS) {
      payload[key] = parseHourInput(form.days[key]);
    }

    let result;
    if (currentRow?.id) {
      result = await supabase.from('weekly_hours').update(payload).eq('id', currentRow.id).select(HOURS_SELECT).single();
    } else {
      result = await supabase.from('weekly_hours').insert(payload).select(HOURS_SELECT).single();
    }

    if (result.error) {
      showToast(friendlyHoursError(result.error), 'error');
    } else {
      setCurrentRow(result.data);
      setForm(rowToForm(result.data));
      showToast(nextStatus === 'submitted' ? 'Hours submitted for review' : 'Draft saved', 'success');
    }
    setSaving(false);
  };

  if (loading) {
    return <TeamBlockSkeleton />;
  }

  return (
    <div className="ndx-team-hours-member">
      <div className="ndx-team-panel ndx-glass-section">
        <div className="ndx-team-hours-week-head">
          <div>
            <p className="ndx-team-dash-card-label">Current week</p>
            <h3 className="ndx-h3" style={{ margin: '0.25rem 0 0' }}>
              {formatWeekRange(currentWeek.weekStart, currentWeek.weekEnd)}
            </h3>
          </div>
          <div className="ndx-team-hours-week-badges">
            {isApproved ? <WeeklyHoursStatusBadge status="approved" /> : <WeeklyHoursStatusBadge status={status} />}
          </div>
        </div>

        {isRejected && managerReviewText ? (
          <div className="ndx-team-alert ndx-team-hours-rejection" role="alert">
            <strong>Rejected — manager feedback</strong>
            <p>{managerReviewText}</p>
          </div>
        ) : null}

        <fieldset className="ndx-team-hours-form" disabled={!isEditable || saving}>
          <label className="ndx-team-field">
            <span>Project / task</span>
            <input
              className="ndx-team-input"
              type="text"
              value={form.projectTask}
              onChange={(e) => setForm((p) => ({ ...p, projectTask: e.target.value }))}
              placeholder="What did you work on this week?"
            />
          </label>

          <label className="ndx-team-field">
            <span>Task details</span>
            <textarea
              className="ndx-team-input"
              rows={3}
              value={form.taskDetails}
              onChange={(e) => setForm((p) => ({ ...p, taskDetails: e.target.value }))}
              placeholder="Brief breakdown of deliverables or focus areas"
            />
          </label>

          <div className="ndx-team-field">
            <span>Daily hours</span>
            <div className="ndx-team-hours-days">
              {DAY_FIELDS.map(({ key, label }) => (
                <label key={key} className="ndx-team-hours-day">
                  <span>{label}</span>
                  <input
                    className="ndx-team-input ndx-team-hours-day-input"
                    type="number"
                    min="0"
                    step="0.25"
                    inputMode="decimal"
                    value={form.days[key]}
                    onChange={(e) => updateDay(key, e.target.value)}
                    placeholder="0"
                  />
                </label>
              ))}
            </div>
            <p className="ndx-team-hours-total">
              Total: <strong>{liveTotal.toFixed(2)}</strong> hrs
              {currentRow?.total_hours != null ? (
                <span className="ndx-team-hours-total-saved"> (saved: {Number(currentRow.total_hours).toFixed(2)})</span>
              ) : null}
            </p>
          </div>

          <label className="ndx-team-field">
            <span>Your notes</span>
            <textarea
              className="ndx-team-input"
              rows={2}
              value={form.memberNotes}
              onChange={(e) => setForm((p) => ({ ...p, memberNotes: e.target.value }))}
              placeholder="Optional context for your manager"
            />
          </label>
        </fieldset>

        {isEditable ? (
          <div className="ndx-team-form-actions ndx-team-hours-actions">
            <button type="button" className="ndx-btn" disabled={saving} onClick={() => save('pending')}>
              Save draft
            </button>
            <button type="button" className="ndx-btn ndx-btn-primary" disabled={saving} onClick={() => save('submitted')}>
              {isRejected ? 'Resubmit for review' : 'Submit for review'}
            </button>
          </div>
        ) : (
          <p className="ndx-team-note">This week is approved and locked. Contact a manager if you need changes.</p>
        )}
      </div>

      <div className="ndx-team-hours-history">
        <h3 className="ndx-h3">Past weeks</h3>
        {history.length === 0 ? (
          <div className="ndx-team-empty">
            <p className="ndx-tech-blurb">No previous weekly hours on file.</p>
          </div>
        ) : (
          <div className="ndx-team-hours-history-table-wrap">
            <table className="ndx-team-table ndx-team-hours-history-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Week">{formatWeekRange(row.week_start_date, row.week_end_date)}</td>
                    <td data-label="Total">{Number(row.total_hours || 0).toFixed(2)} hrs</td>
                    <td data-label="Status">
                      <WeeklyHoursStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewHoursPanel({ member, showToast }) {
  const currentSunday = useMemo(() => getCurrentWeekSunday(), []);
  const [selectedSunday, setSelectedSunday] = useState(currentSunday);
  const selectedWeek = useMemo(() => getWeekRange(selectedSunday), [selectedSunday]);
  const isCurrentWeek = selectedWeek.weekStart === getWeekRange(currentSunday).weekStart;

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [hoursRows, setHoursRows] = useState([]);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actingId, setActingId] = useState(null);

  const loadReview = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    const [membersRes, hoursRes] = await Promise.all([
      supabase.from('team_members').select('id, full_name, avatar_url').order('full_name', { ascending: true }),
      supabase.from('weekly_hours').select(HOURS_SELECT).eq('week_start_date', selectedWeek.weekStart),
    ]);

    if (membersRes.error) {
      showToast(friendlyHoursError(membersRes.error), 'error');
    } else {
      setMembers(membersRes.data || []);
    }

    if (hoursRes.error) {
      showToast(friendlyHoursError(hoursRes.error), 'error');
      setHoursRows([]);
    } else {
      setHoursRows(hoursRes.data || []);
    }

    setLoading(false);
  }, [selectedWeek.weekStart, showToast]);

  useEffect(() => {
    loadReview();
  }, [loadReview]);

  const hoursByMember = useMemo(() => {
    const map = new Map();
    for (const row of hoursRows) {
      map.set(row.member_id, row);
    }
    return map;
  }, [hoursRows]);

  const roster = useMemo(
    () =>
      members.map((m) => {
        const row = hoursByMember.get(m.id) || null;
        return { member: m, row, isRed: isRedWeek(row) };
      }),
    [members, hoursByMember],
  );

  const summary = useMemo(() => {
    let submitted = 0;
    let approved = 0;
    let pending = 0;
    let red = 0;
    for (const { row, isRed } of roster) {
      if (isRed) red += 1;
      if (!row) continue;
      if (row.status === 'submitted') submitted += 1;
      else if (row.status === 'approved') approved += 1;
      else if (row.status === 'pending') pending += 1;
    }
    return { submitted, approved, pending, red };
  }, [roster]);

  const goWeek = (delta) => {
    setSelectedSunday((prev) => addWeeks(prev, delta));
  };

  const approve = async (row) => {
    if (!supabase || !row?.id || actingId) return;
    setActingId(row.id);
    const { data, error } = await supabase
      .from('weekly_hours')
      .update({
        status: 'approved',
        reviewed_by: member.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', row.id)
      .select(HOURS_SELECT)
      .single();

    if (error) {
      showToast(friendlyHoursError(error), 'error');
    } else {
      setHoursRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      showToast('Hours approved', 'success');
    }
    setActingId(null);
  };

  const reject = async (row, reason) => {
    if (!supabase || !row?.id || actingId) return;
    setActingId(row.id);
    const notes = appendManagerReview(row.notes || '', reason);
    const { data, error } = await supabase
      .from('weekly_hours')
      .update({
        status: 'rejected',
        notes,
        reviewed_by: member.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', row.id)
      .select(HOURS_SELECT)
      .single();

    if (error) {
      showToast(friendlyHoursError(error), 'error');
    } else {
      setHoursRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      showToast('Hours rejected', 'success');
    }
    setActingId(null);
    setRejectTarget(null);
  };

  if (loading) {
    return <TeamBlockSkeleton />;
  }

  return (
    <div className="ndx-team-hours-review">
      <div className="ndx-team-hours-week-picker">
        <button type="button" className="ndx-btn ndx-team-hours-week-btn" onClick={() => goWeek(-1)} aria-label="Previous week">
          ←
        </button>
        <div className="ndx-team-hours-week-picker-label">
          <p className="ndx-team-dash-card-label">{isCurrentWeek ? 'Current week' : 'Selected week'}</p>
          <strong>{formatWeekRange(selectedWeek.weekStart, selectedWeek.weekEnd)}</strong>
        </div>
        <button
          type="button"
          className="ndx-btn ndx-team-hours-week-btn"
          onClick={() => goWeek(1)}
          disabled={isCurrentWeek}
          aria-label="Next week"
        >
          →
        </button>
      </div>

      <div className="ndx-team-hours-summary" aria-label="Week summary">
        <span className="ndx-team-hours-summary-item">
          <strong>{summary.submitted}</strong> submitted
        </span>
        <span className="ndx-team-hours-summary-item">
          <strong>{summary.approved}</strong> approved
        </span>
        <span className="ndx-team-hours-summary-item">
          <strong>{summary.pending}</strong> pending
        </span>
        <span className="ndx-team-hours-summary-item ndx-team-hours-summary-item--red">
          <strong>{summary.red}</strong> red
        </span>
      </div>

      {roster.length === 0 ? (
        <div className="ndx-team-empty">
          <p className="ndx-lead">No team members found.</p>
        </div>
      ) : null}

      <div className="ndx-team-hours-review-table-wrap">
        <table className="ndx-team-table ndx-team-hours-review-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Project / task</th>
              {DAY_FIELDS.map(({ label }) => (
                <th key={label} className="ndx-team-hours-col-day">
                  {label}
                </th>
              ))}
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roster.map(({ member: m, row, isRed }) => {
              const canReview = row && (row.status === 'submitted' || row.status === 'pending');
              const busy = row && actingId === row.id;
              return (
                <tr key={m.id} className={isRed ? 'ndx-team-hours-row--red' : ''}>
                  <td data-label="Member">
                    <div className="ndx-team-hours-member-cell">
                      <TeamAvatar name={m.full_name} avatarUrl={m.avatar_url} size={36} />
                      <span>{m.full_name}</span>
                      {isRed ? <span className="ndx-team-badge ndx-team-hours-red-badge">Red week</span> : null}
                    </div>
                  </td>
                  <td data-label="Project">{row?.project_task || '—'}</td>
                  {DAY_FIELDS.map(({ key, label }) => (
                    <td key={key} data-label={label} className="ndx-team-hours-col-day">
                      {row?.[key] != null ? Number(row[key]).toFixed(1) : '—'}
                    </td>
                  ))}
                  <td data-label="Total">{row ? `${Number(row.total_hours || 0).toFixed(2)}` : '—'}</td>
                  <td data-label="Status">
                    {row ? <WeeklyHoursStatusBadge status={row.status} /> : <span className="ndx-tech-blurb">Missing</span>}
                  </td>
                  <td data-label="Actions">
                    {canReview ? (
                      <div className="ndx-team-hours-review-actions">
                        <button
                          type="button"
                          className="ndx-btn ndx-btn-primary ndx-team-hours-btn-sm"
                          disabled={busy}
                          onClick={() => approve(row)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="ndx-btn ndx-team-hours-btn-sm"
                          disabled={busy}
                          onClick={() => setRejectTarget({ row, memberName: m.full_name })}
                        >
                          Reject
                        </button>
                      </div>
                    ) : row ? (
                      <WeeklyHoursStatusBadge status={row.status} />
                    ) : (
                      <span className="ndx-tech-blurb">No submission</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="ndx-team-hours-review-cards">
          {roster.map(({ member: m, row, isRed }) => {
            const canReview = row && (row.status === 'submitted' || row.status === 'pending');
            const busy = row && actingId === row.id;
            return (
              <article key={m.id} className={`ndx-card ndx-team-hours-review-card${isRed ? ' ndx-team-hours-review-card--red' : ''}`}>
                <div className="ndx-team-hours-review-card-head">
                  <TeamAvatar name={m.full_name} avatarUrl={m.avatar_url} size={40} />
                  <div>
                    <h4>{m.full_name}</h4>
                    {isRed ? <span className="ndx-team-badge ndx-team-hours-red-badge">Red week</span> : null}
                  </div>
                  {row ? <WeeklyHoursStatusBadge status={row.status} /> : null}
                </div>
                <p className="ndx-tech-blurb">
                  <strong>Project:</strong> {row?.project_task || '—'}
                </p>
                <div className="ndx-team-hours-review-card-days">
                  {DAY_FIELDS.map(({ key, label }) => (
                    <span key={key}>
                      {label}: {row?.[key] != null ? Number(row[key]).toFixed(1) : '—'}
                    </span>
                  ))}
                </div>
                <p className="ndx-team-hours-review-card-total">
                  Total: {row ? `${Number(row.total_hours || 0).toFixed(2)} hrs` : '—'}
                </p>
                {canReview ? (
                  <div className="ndx-team-hours-review-actions">
                    <button type="button" className="ndx-btn ndx-btn-primary ndx-team-hours-btn-sm" disabled={busy} onClick={() => approve(row)}>
                      Approve
                    </button>
                    <button
                      type="button"
                      className="ndx-btn ndx-team-hours-btn-sm"
                      disabled={busy}
                      onClick={() => setRejectTarget({ row, memberName: m.full_name })}
                    >
                      Reject
                    </button>
                  </div>
                ) : !row ? (
                  <p className="ndx-tech-blurb">No submission</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      {rejectTarget ? (
        <RejectHoursModal
          memberName={rejectTarget.memberName}
          onCancel={() => setRejectTarget(null)}
          onConfirm={(reason) => reject(rejectTarget.row, reason)}
        />
      ) : null}
    </div>
  );
}

export default function TeamWeeklyHours() {
  const { member, canManageTeam, showToast } = useTeam();
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState('mine');

  return (
    <div className="ndx-page-rich">
      <motion.div
        className="ndx-team-page-head"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="ndx-eyebrow">Ops</p>
        <h2 className="ndx-h2">Weekly hours</h2>
        <p className="ndx-lead">Submit your hours for the current week. Managers review team submissions here.</p>
      </motion.div>

      {canManageTeam ? (
        <div className="ndx-team-tabs" role="tablist" aria-label="Weekly hours views">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'mine'}
            className={`ndx-team-tab${tab === 'mine' ? ' ndx-team-tab--active' : ''}`}
            onClick={() => setTab('mine')}
          >
            My hours
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'review'}
            className={`ndx-team-tab${tab === 'review' ? ' ndx-team-tab--active' : ''}`}
            onClick={() => setTab('review')}
          >
            Review team
          </button>
        </div>
      ) : null}

      {tab === 'mine' ? <MemberHoursForm member={member} showToast={showToast} /> : null}
      {tab === 'review' && canManageTeam ? <ReviewHoursPanel member={member} showToast={showToast} /> : null}
    </div>
  );
}
