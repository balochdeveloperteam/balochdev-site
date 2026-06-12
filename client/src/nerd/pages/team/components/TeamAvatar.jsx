function initials(name) {
  return String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

export default function TeamAvatar({ name, avatarUrl, size = 48 }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="ndx-team-avatar"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className="ndx-team-avatar ndx-team-avatar--initials"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
