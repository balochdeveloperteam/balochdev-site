import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTeam } from './TeamContext';
import AccessRoleBadge from './components/AccessRoleBadge';
import TeamAvatar from './components/TeamAvatar';

const TILES = [
  {
    to: '/team/members',
    label: 'Directory',
    title: 'Members',
    body: 'Browse the team roster, roles, and status badges.',
    link: true,
  },
  {
    to: '/team/my-role',
    label: 'Role card',
    title: 'My role',
    body: 'Your responsibilities and role definition.',
    link: true,
  },
  {
    to: '/team/policies',
    label: 'Handbook',
    title: 'Policies',
    body: 'Ethics, conduct, trial rules, and team guidelines.',
    link: true,
  },
  {
    label: 'Ops',
    title: 'Weekly hours',
    body: 'Submit and review weekly hour sheets.',
    soon: true,
  },
  {
    label: 'Tasks',
    title: 'Tasks',
    body: 'Assigned work, verification steps, and guides.',
    soon: true,
  },
];

export default function TeamDashboard() {
  const { member } = useTeam();
  const reduceMotion = useReducedMotion();
  const firstName = member.full_name.split(' ')[0];

  return (
    <div className="ndx-page-rich">
      <motion.div
        className="ndx-team-page-head"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="ndx-eyebrow">Dashboard</p>
        <h2 className="ndx-h2">Welcome back, {firstName}</h2>
        <p className="ndx-lead">Your private BalochDev team workspace — roster, role, and policies in one place.</p>
      </motion.div>

      <motion.div
        className="ndx-team-hero ndx-glass-section"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.05 }}
      >
        <div className="ndx-team-hero-top">
          <div className="ndx-team-hero-copy">
            <TeamAvatar name={member.full_name} avatarUrl={member.avatar_url} size={64} />
            <div className="ndx-team-hero-text">
              <h3 className="ndx-h3" style={{ marginBottom: '0.25rem' }}>
                {member.full_name}
              </h3>
              <p className="ndx-tech-blurb">{member.role_title}</p>
              <div className="ndx-team-hero-meta">
                <AccessRoleBadge role={member.access_role} />
                <span className="ndx-team-hero-dept">{member.department}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="ndx-team-dash-grid">
        {TILES.map((tile, index) => {
          const cardClass = [
            'ndx-card',
            'ndx-team-dash-card',
            tile.soon ? 'ndx-team-dash-card--soon ndx-team-dash-card--static' : '',
          ]
            .filter(Boolean)
            .join(' ');

          const inner = (
            <>
              <span className="ndx-team-dash-card-label">{tile.label}</span>
              <h3>{tile.title}</h3>
              <p>{tile.body}</p>
              {tile.soon ? (
                <span className="ndx-team-soon-pill">Coming soon</span>
              ) : (
                <span className="ndx-team-dash-card-arrow">Open →</span>
              )}
            </>
          );

          return (
            <motion.div
              key={tile.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.08 + index * 0.04 }}
            >
              {tile.link ? (
                <Link to={tile.to} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <div className={cardClass}>{inner}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
