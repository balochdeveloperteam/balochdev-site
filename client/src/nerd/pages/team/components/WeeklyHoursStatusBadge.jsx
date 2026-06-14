const STATUS_STYLES = {
  pending: { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8', label: 'Pending' },
  submitted: { bg: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', label: 'Submitted' },
  approved: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', label: 'Approved' },
  rejected: { bg: 'rgba(248, 113, 113, 0.12)', color: '#f87171', label: 'Rejected' },
};

export default function WeeklyHoursStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className="ndx-team-badge"
      style={{ background: style.bg, color: style.color, borderColor: `${style.color}33` }}
    >
      {style.label}
    </span>
  );
}
