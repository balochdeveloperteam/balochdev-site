import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';

const nav = [
  { to: '/services', label: 'Services' },
  { to: '/technologies', label: 'Technologies' },
  { to: '/apps', label: 'Apps' },
  { to: '/industries', label: 'Industries' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
];

export default function ShellHeader() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

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
            {nav.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ndx-header-right">
            <div className="ndx-nav-cta">
              <NavLink to="/contact" className="ndx-btn">
                Get in touch
              </NavLink>
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
        {nav.map(({ to, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
        <NavLink to="/contact" onClick={() => setOpen(false)}>
          Contact
        </NavLink>
        <NavLink to="/estimate" onClick={() => setOpen(false)}>
          AI estimate
        </NavLink>
        <NavLink to="/proposal" onClick={() => setOpen(false)}>
          Send proposal
        </NavLink>
        <NavLink to="/admin/login" onClick={() => setOpen(false)}>
          Admin
        </NavLink>
      </div>
    </>
  );
}
