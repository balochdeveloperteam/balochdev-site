import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useTeam } from './TeamContext';
import AccessRoleBadge from './components/AccessRoleBadge';
import MemberEditModal from './components/MemberEditModal';
import StatusBadge from './components/StatusBadge';
import TeamAvatar from './components/TeamAvatar';
import { TeamCardSkeleton } from './components/TeamSkeleton';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}

export default function TeamMembers() {
  const { session, isAdmin, canManageTeam, showToast } = useTeam();
  const reduceMotion = useReducedMotion();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const loadMembers = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('team_members')
      .select(
        'id, full_name, role_title, department, access_role, email, avatar_url, status, trial_start_date, trial_end_date, joined_date',
      )
      .order('full_name', { ascending: true });
    if (err) {
      setError(err.message);
      showToast('Could not load members', 'error');
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const showLimitedNote = !canManageTeam && members.length <= 1;

  return (
    <div className="ndx-page-rich">
      <motion.div
        className="ndx-team-page-head"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="ndx-eyebrow">Directory</p>
        <h2 className="ndx-h2">Members</h2>
        <p className="ndx-lead">Team roster — visibility follows your workspace role.</p>
      </motion.div>

      {showLimitedNote ? (
        <p className="ndx-team-note">
          You can only see your own profile here. Admins and managers see the full team directory.
        </p>
      ) : null}

      {error ? <p className="ndx-team-alert" role="alert">{error}</p> : null}

      {loading ? (
        <div className="ndx-team-grid">
          {[1, 2, 3, 4].map((n) => (
            <TeamCardSkeleton key={n} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="ndx-team-empty">
          <p className="ndx-lead">No team members found.</p>
        </div>
      ) : (
        <div className="ndx-team-grid">
          {members.map((m, index) => (
            <motion.article
              key={m.id}
              className="ndx-card ndx-team-member-card"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.04 }}
            >
              <div className="ndx-team-member-card-head">
                <TeamAvatar name={m.full_name} avatarUrl={m.avatar_url} size={56} />
                <div style={{ minWidth: 0 }}>
                  <h3>{m.full_name}</h3>
                  <p className="ndx-tech-blurb">{m.role_title}</p>
                  <p className="ndx-tech-blurb">{m.department}</p>
                </div>
              </div>
              <div className="ndx-team-member-meta">
                <AccessRoleBadge role={m.access_role} />
                <StatusBadge status={m.status} />
              </div>
              <p className="ndx-team-member-foot">
                Joined {formatDate(m.joined_date)}
                {m.email ? (
                  <>
                    <br />
                    {m.email}
                  </>
                ) : null}
              </p>
              {isAdmin ? (
                <button type="button" className="ndx-btn" onClick={() => setEditing(m)}>
                  Edit member
                </button>
              ) : null}
            </motion.article>
          ))}
        </div>
      )}

      {editing && session ? (
        <MemberEditModal
          member={editing}
          session={session}
          onClose={() => setEditing(null)}
          onSaved={loadMembers}
        />
      ) : null}
    </div>
  );
}
