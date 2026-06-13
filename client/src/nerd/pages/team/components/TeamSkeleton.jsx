export function TeamCardSkeleton() {
  return (
    <div className="ndx-card ndx-team-skeleton-card" aria-hidden>
      <div className="ndx-team-skeleton ndx-team-skeleton--circle" />
      <div className="ndx-team-skeleton ndx-team-skeleton--line" style={{ width: '60%' }} />
      <div className="ndx-team-skeleton ndx-team-skeleton--line" style={{ width: '40%' }} />
    </div>
  );
}

export function TeamBlockSkeleton() {
  return (
    <div className="ndx-team-skeleton-block ndx-card ndx-team-skeleton-card" aria-hidden>
      <div className="ndx-team-skeleton ndx-team-skeleton--line" style={{ width: '28%' }} />
      <div className="ndx-team-skeleton ndx-team-skeleton--line" style={{ width: '92%' }} />
      <div className="ndx-team-skeleton ndx-team-skeleton--line" style={{ width: '78%' }} />
      <div className="ndx-team-skeleton ndx-team-skeleton--line" style={{ width: '65%' }} />
    </div>
  );
}
