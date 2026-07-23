import { NavLink } from 'react-router-dom';
import { useDataTheme } from '../hooks/useDataTheme';
import logoBlack from '../../assets/BalochDevLogo/logo_black.svg';
import logoWhite from '../../assets/BalochDevLogo/logo_white.svg';
import logoOrange from '../../assets/BalochDevLogo/logo_orange.svg';

/** light = ink on Mist, dark = white on charcoal, dusk = coral on purple. Swap `logoWhite` → `logoTeal` import for teal-on-dark. */
const THEME_MARK = {
  light: logoBlack,
  dark: logoWhite,
  dusk: logoOrange,
};

export default function BrandLogo({ variant = 'header' }) {
  const theme = useDataTheme();
  const isFooter = variant === 'footer';
  const isHero = variant === 'hero';
  const src = THEME_MARK[theme] || logoWhite;
  const imgSize = isHero ? 320 : isFooter ? 52 : 55;
  const className = [
    'ndx-brand-logo',
    isFooter ? 'ndx-brand-logo--footer' : '',
    isHero ? 'ndx-brand-logo--hero' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <NavLink to="/" className={className} aria-label="BalochDev home">
      <span className="ndx-brand-logo__mark-wrap" aria-hidden="true">
        <img
          src={src}
          alt=""
          width={imgSize}
          height={imgSize}
          className="ndx-brand-logo__mark-img"
          draggable={false}
        />
      </span>
      {!isHero ? (
        <span className="ndx-brand-logo__type">
          <span className="ndx-brand-logo__line1">
            <strong className="ndx-brand-logo__w700">B</strong>
            <span className="ndx-brand-logo__w400">aloch</span>
          </span>
          <span className="ndx-brand-logo__line2">
            <strong className="ndx-brand-logo__w700">D</strong>
            <span className="ndx-brand-logo__w400">ev</span>
            <strong className="ndx-brand-logo__w700 ndx-brand-logo__dot">.</strong>
          </span>
        </span>
      ) : null}
    </NavLink>
  );
}
