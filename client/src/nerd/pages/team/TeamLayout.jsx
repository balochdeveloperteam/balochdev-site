import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Seo from '../../seo/Seo';
import { PRIVATE_ROUTES } from '../../seo/siteSeo';
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
];

export default function TeamLayout() {
  const { member, signOut } = useTeam();
  const location = useLocation();
  const canonicalPath = location.pathname.startsWith('/team') ? location.pathname : PRIVATE_ROUTES.TEAM_ROOT;

  return (
    <>
      <Seo title="Team workspace | BalochDev" description={TEAM_META} canonicalPath={canonicalPath} noindex />
      <section className="ndx-section ndx-team-section">
        <div className="ndx-container ndx-team-container">
          <div className="ndx-team-shell">
            <aside className="ndx-team-sidebar ndx-glass-section">
              <div className="ndx-team-sidebar-head">
                <p className="ndx-eyebrow">Workspace</p>
                <h1 className="ndx-team-sidebar-title">Team</h1>
              </div>

              <div className="ndx-team-user">
                <TeamAvatar name={member.full_name} avatarUrl={member.avatar_url} size={52} />
                <div>
                  <p className="ndx-team-user-name">{member.full_name}</p>
                  <p className="ndx-tech-blurb">{member.role_title}</p>
                  <AccessRoleBadge role={member.access_role} />
                </div>
              </div>

              <nav className="ndx-team-nav" aria-label="Team workspace">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `ndx-team-nav-link${isActive ? ' ndx-team-nav-link--active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <button type="button" className="ndx-btn ndx-team-signout" onClick={signOut}>
                Sign out
              </button>
            </aside>

            <div className="ndx-team-main">
              <Outlet />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
