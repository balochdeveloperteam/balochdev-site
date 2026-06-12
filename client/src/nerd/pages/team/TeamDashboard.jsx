import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTeam } from './TeamContext';
import AccessRoleBadge from './components/AccessRoleBadge';
import TeamAvatar from './components/TeamAvatar';

export default function TeamDashboard() {
  const { member } = useTeam();
  const reduceMotion = useReducedMotion();

  return (
    <div className="ndx-page-rich">
      <motion.div
        className="ndx-team-page-head"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="ndx-eyebrow">Dashboard</p>
        <h2 className="ndx-h2">
          Welcome back, {member.full_name.split(' ')[0]}
        </h2>
        <p className="ndx-lead">Your private team workspace at BalochDev.</p>
      </motion.div>

      <div className="ndx-card ndx-glass-section" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <TeamAvatar name={member.full_name} avatarUrl={member.avatar_url} size={72} />
          <div>
            <h3 className="ndx-h3" style={{ marginBottom: '0.25rem' }}>
              {member.full_name}
            </h3>
            <p className="ndx-tech-blurb">{member.role_title}</p>
            <p className="ndx-tech-blurb">{member.department}</p>
            <AccessRoleBadge role={member.access_role} />
          </div>
        </div>
      </div>

      <div className="ndx-card-grid">
        <div className="ndx-card ndx-team-coming-soon">
          <h3>Weekly hours</h3>
          <p className="ndx-tech-blurb">Submit and review weekly hour sheets — coming in the next release.</p>
        </div>
        <div className="ndx-card ndx-team-coming-soon">
          <h3>Tasks</h3>
          <p className="ndx-tech-blurb">Assigned tasks, verification, and guides — coming soon.</p>
        </div>
        <Link to="/team/my-role" className="ndx-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>My role</h3>
          <p className="ndx-tech-blurb">View your responsibilities and role definition.</p>
        </Link>
        <Link to="/team/policies" className="ndx-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Policies</h3>
          <p className="ndx-tech-blurb">Team handbook, ethics, and conduct guidelines.</p>
        </Link>
      </div>
    </div>
  );
}
