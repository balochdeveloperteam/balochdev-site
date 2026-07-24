import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';
import SocialLinksRow from './SocialLinksRow';
import BookCallButton from './bookCall/BookCallButton';

const nav = [
  {
    to: '/services',
    label: 'Services',
    children: [
      { to: '/services/practice/ai', label: 'AI & Intelligence' },
      { to: '/services/practice/build', label: 'Build · Product' },
      { to: '/services/practice/automate', label: 'Automate · Ops' },
      { to: '/services/practice/design', label: 'Design · Craft' },
      { to: '/services', label: 'View all services', viewAll: true },
    ],
  },
  {
    to: '/technologies',
    label: 'Technologies',
    children: [
      { to: '/technologies#ai', label: 'AI & Intelligence' },
      { to: '/technologies#frontend', label: 'Frontend' },
      { to: '/technologies#backend', label: 'Backends & APIs' },
      { to: '/technologies#data', label: 'Databases' },
      { to: '/technologies#ops', label: 'Deploy & Ops' },
      { to: '/technologies', label: 'View all technologies', viewAll: true },
    ],
  },
  {
    to: '/apps',
    label: 'Apps',
    children: [
      { to: '/apps', label: 'Mobile apps overview' },
      { to: '/services/android-app-development', label: 'Android development' },
      { to: '/services/mvp-development', label: 'MVP builds' },
      { to: '/apps', label: 'View all apps', viewAll: true },
    ],
  },
  {
    to: '/portfolio',
    label: 'Portfolio',
    children: [
      { to: '/projects/soroz', label: 'Soroz AI' },
      { to: '/projects/mango-restaurant', label: 'ManGo Restaurant' },
      { to: '/projects/theory-of-you', label: 'Theory of You' },
      { to: '/projects/doch', label: 'DOCH' },
      { to: '/projects/iinta', label: 'iinta.ca' },
      { to: '/projects/toledo-locks', label: 'Toledo & Co.' },
      { to: '/projects/shabash', label: 'Shbash' },
      { to: '/portfolio', label: 'View all portfolio', viewAll: true },
    ],
  },
  {
    to: '/about',
    label: 'About',
    children: [
      { to: '/about', label: 'About us' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact us' },
      { to: '/about', label: 'View all about', viewAll: true },
    ],
  },
  { to: '/blog', label: 'Blog' },
];

export default function ShellHeader() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(null);
  const [desktopMenu, setDesktopMenu] = useState(null);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
    setMobileOpen(null);
    setDesktopMenu(null);
  }, [loc.pathname, loc.hash, loc.search]);

  return (
    <>
      <div
        className={`ndx-mobile-backdrop ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        role="presentation"
      />
      <header className="ndx-header">
        <div className="ndx-header-inner">
          <BrandLogo />

          <nav className="ndx-nav ndx-nav-desktop" aria-label="Primary">
            {nav.map((item) =>
              item.children ? (
                <div
                  key={item.to}
                  className={`ndx-nav-item ndx-nav-item--has-menu${desktopMenu === item.to ? ' is-open' : ''}`}
                  onMouseEnter={() => setDesktopMenu(item.to)}
                  onMouseLeave={() => setDesktopMenu(null)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `ndx-nav-link${isActive ? ' active' : ''}`}
                    onClick={() => setDesktopMenu(null)}
                  >
                    {item.label}
                    <span className="bx bx-chevron-down ndx-nav-caret" aria-hidden />
                  </NavLink>
                  <div className="ndx-nav-dropdown" role="menu">
                    {item.children.map((child) => (
                      <NavLink
                        key={`${child.to}-${child.label}`}
                        to={child.to}
                        role="menuitem"
                        onClick={() => setDesktopMenu(null)}
                        className={({ isActive }) =>
                          `ndx-nav-dropdown__link${child.viewAll ? ' ndx-nav-dropdown__link--all' : ''}${
                            isActive && !child.viewAll ? ' active' : ''
                          }`
                        }
                      >
                        <span>{child.label}</span>
                        {child.viewAll ? <span className="bx bx-right-arrow-alt" aria-hidden /> : null}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `ndx-nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="ndx-header-right">
            <div className="ndx-nav-cta">
              <BookCallButton className="ndx-btn">Book a call</BookCallButton>
              <NavLink to="/estimate" className="ndx-btn ndx-btn-primary">
                AI estimate
              </NavLink>
              <button
                type="button"
                className="ndx-menu-toggle"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((v) => !v)}
              >
                <span className={`bx ${open ? 'bx-x' : 'bx-menu'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <aside className="ndx-theme-float" aria-label="Site theme">
        <ThemeToggle />
      </aside>

      <div className={`ndx-mobile-drawer ${open ? 'open' : ''}`} id="mobile-nav">
        <button
          type="button"
          className="ndx-mobile-drawer__close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <span className="bx bx-x" aria-hidden />
        </button>

        {nav.map((item) =>
          item.children ? (
            <div key={item.to} className="ndx-mobile-nav-group">
              <div className="ndx-mobile-nav-group__head">
                <NavLink to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
                <button
                  type="button"
                  className="ndx-mobile-nav-group__toggle"
                  aria-expanded={mobileOpen === item.to}
                  aria-label={`${mobileOpen === item.to ? 'Hide' : 'Show'} ${item.label} links`}
                  onClick={() => setMobileOpen((cur) => (cur === item.to ? null : item.to))}
                >
                  <span className={`bx ${mobileOpen === item.to ? 'bx-chevron-up' : 'bx-chevron-down'}`} aria-hidden />
                </button>
              </div>
              {mobileOpen === item.to ? (
                <div className="ndx-mobile-nav-group__list">
                  {item.children.map((child) => (
                    <NavLink
                      key={`${child.to}-${child.label}`}
                      to={child.to}
                      onClick={() => setOpen(false)}
                      className={child.viewAll ? 'ndx-mobile-nav-group__all' : undefined}
                    >
                      {child.label}
                      {child.viewAll ? ' →' : ''}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ),
        )}

        <div className="ndx-mobile-drawer__ctas">
          <BookCallButton
            className="ndx-btn ndx-btn-primary ndx-mobile-drawer__cta"
            onClick={() => setOpen(false)}
          >
            Book a call
          </BookCallButton>
          <NavLink
            to="/estimate"
            className="ndx-btn ndx-mobile-drawer__cta"
            onClick={() => setOpen(false)}
          >
            AI estimate
          </NavLink>
          <NavLink
            to="/proposal"
            className="ndx-btn ndx-mobile-drawer__cta"
            onClick={() => setOpen(false)}
          >
            Send proposal
          </NavLink>
        </div>

        <div className="ndx-mobile-drawer__social">
          <BrandLogo />
          <SocialLinksRow
            className="ndx-social-links--drawer"
            label="Follow us"
            showLabel
          />
        </div>

        <NavLink to="/login" className="ndx-mobile-drawer__admin" onClick={() => setOpen(false)}>
          Admin
        </NavLink>
      </div>
    </>
  );
}
