const STATUS_STYLES = {
  trial: { bg: 'rgba(250, 204, 21, 0.12)', color: '#facc15', label: 'Trial' },
  active: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', label: 'Active' },
  warned: { bg: 'rgba(248, 113, 113, 0.12)', color: '#f87171', label: 'Warned' },
  inactive: { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8', label: 'Inactive' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.active;
  return (
    <span
      className="ndx-team-badge"
      style={{ background: style.bg, color: style.color, borderColor: `${style.color}33` }}
    >
      {style.label}
    </span>
  );
}
