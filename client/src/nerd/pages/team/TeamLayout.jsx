import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Seo from '../../seo/Seo';
import { PRIVATE_ROUTES } from '../../seo/siteSeo';
import WorkspaceTopBar from '../shared/WorkspaceTopBar';
import { useTeam } from './TeamContext';
import AccessRoleBadge from './components/AccessRoleBadge';
import TeamAvatar from './components/TeamAvatar';
import './team.css';

const TEAM_META = 'BalochDev team workspace — not indexed.';

const NAV = [
  { to: '/team', label: 'Dashboard', end: true },
  { to: '/team/members', label: 'Members' },
  { to: '/team/my-role', label: 'My Role' },
  { to: '/team/policies', label: 'Policies' },
  { to: '/team/hours', label: 'Weekly Hours' },
];

function NavLinks({ className, itemClassName, showAdminLink }) {
  return (
    <nav className={className} aria-label="Team workspace">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `${itemClassName}${isActive ? ' ndx-team-nav-link--active' : ''}`
          }
        >
          {item.label}
        </NavLink>
      ))}
      {showAdminLink && (
        <Link to="/admin/overview" className={`${itemClassName} ndx-workspace-cross-link`}>
          Go to Admin →
        </Link>
      )}
    </nav>
  );
}

export default function TeamLayout() {
  const { member, signOut, canManageTeam } = useTeam();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const canonicalPath = location.pathname.startsWith('/team') ? location.pathname : PRIVATE_ROUTES.TEAM_ROOT;

  return (
    <>
      <Seo title="Team workspace | BalochDev" description={TEAM_META} canonicalPath={canonicalPath} noindex />
      <section className="ndx-section ndx-team-section ndx-page-rich">
        <div className="ndx-container ndx-team-container">
          <motion.div
            className="ndx-team-shell"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <aside className="ndx-team-sidebar ndx-glass-section">
              <div className="ndx-team-brand">
                <span className="ndx-team-brand-mark" aria-hidden>
                  BD
                </span>
                <div className="ndx-team-brand-text">
                  <p className="ndx-team-brand-label">BalochDev</p>
                  <h1 className="ndx-team-sidebar-title">Team workspace</h1>
                </div>
              </div>

              <div className="ndx-team-user">
                <TeamAvatar name={member.full_name} avatarUrl={member.avatar_url} size={52} />
                <div className="ndx-team-user-body">
                  <p className="ndx-team-user-name">{member.full_name}</p>
                  <p className="ndx-team-user-role">{member.role_title}</p>
                  <AccessRoleBadge role={member.access_role} />
                </div>
              </div>

              <NavLinks
                className="ndx-team-nav ndx-team-nav--sidebar"
                itemClassName="ndx-team-nav-link"
                showAdminLink={canManageTeam}
              />

              <button type="button" className="ndx-btn ndx-team-signout ndx-team-signout--sidebar" onClick={signOut}>
                Sign out
              </button>
            </aside>

            <NavLinks
              className="ndx-team-nav ndx-team-nav--mobile"
              itemClassName="ndx-team-nav-link"
              showAdminLink={canManageTeam}
            />

            <div className="ndx-team-main">
              <WorkspaceTopBar current="team" showAdmin={canManageTeam} showTeam />
              <Outlet />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
