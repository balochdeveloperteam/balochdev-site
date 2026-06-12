const ROLE_STYLES = {
  admin: { bg: 'rgba(249, 115, 22, 0.15)', color: 'var(--ndx-accent)', label: 'Admin' },
  manager: { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', label: 'Manager' },
  member: { bg: 'rgba(148, 163, 184, 0.12)', color: 'var(--ndx-text-muted)', label: 'Member' },
};

export default function AccessRoleBadge({ role }) {
  const style = ROLE_STYLES[role] || ROLE_STYLES.member;
  return (
    <span
      className="ndx-team-badge"
      style={{ background: style.bg, color: style.color, borderColor: `${style.color}33` }}
    >
      {style.label}
    </span>
  );
}
