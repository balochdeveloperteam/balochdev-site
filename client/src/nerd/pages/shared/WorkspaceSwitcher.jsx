import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbChevronDown } from 'react-icons/tb';

export default function WorkspaceSwitcher({ current, showAdmin, showTeam }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!showAdmin && !showTeam) return null;

  const label = current === 'admin' ? 'Admin' : 'Team';

  return (
    <div className="ndx-workspace-switcher" ref={rootRef}>
      <button
        type="button"
        className="ndx-workspace-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ndx-workspace-switcher-label">Workspace</span>
        <span className="ndx-workspace-switcher-current">{label}</span>
        <TbChevronDown aria-hidden className="ndx-workspace-switcher-chevron" />
      </button>
      {open && (
        <div className="ndx-workspace-switcher-menu ndx-glass-section" role="listbox">
          {showAdmin && (
            <Link
              to="/admin/overview"
              className={`ndx-workspace-switcher-option${current === 'admin' ? ' is-current' : ''}`}
              role="option"
              aria-selected={current === 'admin'}
              onClick={() => setOpen(false)}
            >
              Content admin
            </Link>
          )}
          {showTeam && (
            <Link
              to="/team"
              className={`ndx-workspace-switcher-option${current === 'team' ? ' is-current' : ''}`}
              role="option"
              aria-selected={current === 'team'}
              onClick={() => setOpen(false)}
            >
              Team workspace
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
