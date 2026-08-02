import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Seo from '../../seo/Seo';
import { PRIVATE_ROUTES } from '../../seo/siteSeo';
import AccessRoleBadge from '../team/components/AccessRoleBadge';
import WorkspaceTopBar from '../shared/WorkspaceTopBar';
import { useAdmin } from './AdminContext';
import './admin.css';

const ADMIN_META = 'BalochDev admin CMS — not indexed.';

const NAV = [
  { to: '/admin/overview', label: 'Overview', end: false },
  { to: '/admin/posts', label: 'Blog Posts', end: false },
  { to: '/admin/ads', label: 'Ads', end: false },
  { to: '/admin/media', label: 'Media', end: false },
  { to: '/admin/analytics', label: 'Analytics', soon: true },
];

function NavItems({ className, itemClassName, crossLinkClassName, showTeamLink }) {
  return (
    <nav className={className} aria-label="Admin workspace">
      {NAV.map((item) =>
        item.soon ? (
          <span key={item.label} className={`${itemClassName} ndx-admin-nav-link--soon`} aria-disabled="true">
            {item.label}
            <span className="ndx-admin-soon">Soon</span>
          </span>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${itemClassName}${isActive ? ' ndx-admin-nav-link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ),
      )}
      {showTeamLink && (
        <Link to="/team/" className={`${crossLinkClassName || itemClassName} ndx-workspace-cross-link`}>
          Go to Team workspace →
        </Link>
      )}
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const { profile, signOut, canAccessTeam, canAccessAdmin } = useAdmin();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isEditor = location.pathname.includes('/admin/posts/');
  const canonicalPath = location.pathname.startsWith('/admin')
    ? location.pathname
    : PRIVATE_ROUTES.ADMIN_ROOT;

  return (
    <>
      <Seo title="Admin CMS | BalochDev" description={ADMIN_META} canonicalPath={canonicalPath} noindex />
      <section className={`ndx-section ndx-admin-section ndx-page-rich${isEditor ? ' ndx-admin-section--editor' : ''}`}>
        <div className="ndx-container ndx-admin-container">
          <motion.div
            className="ndx-admin-shell"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <aside className="ndx-admin-sidebar ndx-glass-section">
              <div className="ndx-admin-brand">
                <span className="ndx-admin-brand-mark" aria-hidden>
                  BD
                </span>
                <div className="ndx-admin-brand-text">
                  <p className="ndx-admin-brand-label">BalochDev</p>
                  <h1 className="ndx-admin-sidebar-title">Content admin</h1>
                </div>
              </div>

              <NavItems
                className="ndx-admin-nav ndx-admin-nav--sidebar"
                itemClassName="ndx-admin-nav-link"
                showTeamLink={canAccessTeam}
              />

              <div className="ndx-admin-sidebar-footer">
                <div className="ndx-admin-user">
                  <p className="ndx-admin-welcome">
                    Welcome, <strong>{profile?.name || 'Admin'}</strong>
                  </p>
                  {profile?.role && <AccessRoleBadge role={profile.role} />}
                </div>
                <button
                  type="button"
                  className="ndx-btn ndx-admin-signout ndx-admin-signout--sidebar"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </div>
            </aside>

            <NavItems
              className="ndx-admin-nav ndx-admin-nav--mobile"
              itemClassName="ndx-admin-nav-link"
              showTeamLink={canAccessTeam}
            />

            <div className="ndx-admin-main ndx-page-rich">
              <WorkspaceTopBar current="admin" showAdmin={canAccessAdmin} showTeam={canAccessTeam} />
              {children}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
