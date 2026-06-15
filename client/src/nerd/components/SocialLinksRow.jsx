import { BALOCHDEV_SOCIAL_LINKS } from '../lib/socialLinks';

/**
 * @param {{ className?: string, iconClassName?: string, label?: string, showLabel?: boolean }} props
 */
export default function SocialLinksRow({
  className = '',
  iconClassName = 'ndx-social-link',
  label = "We're also on",
  showLabel = true,
}) {
  return (
    <div className={`ndx-social-links${className ? ` ${className}` : ''}`}>
      {showLabel ? <span className="ndx-social-links__label">{label}</span> : null}
      <div className="ndx-social-links__icons">
        {BALOCHDEV_SOCIAL_LINKS.map(({ id, label: linkLabel, url, Icon }) => (
          <a
            key={id}
            href={url}
            className={iconClassName}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={linkLabel}
            title={linkLabel}
          >
            <Icon size={16} aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}
