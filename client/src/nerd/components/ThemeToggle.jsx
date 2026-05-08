import { useEffect, useState } from 'react';

const THEMES = ['light', 'dark', 'dusk'];
const LABELS = { light: 'Light', dark: 'Dark', dusk: 'Dusk' };

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      const fromDom = document.documentElement.getAttribute('data-theme');
      if (fromDom && ['light', 'dark', 'dusk'].includes(fromDom)) return fromDom;
      return localStorage.getItem('balochdev-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('balochdev-theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const cycle = () => {
    const i = THEMES.indexOf(theme);
    setTheme(THEMES[(i + 1) % THEMES.length]);
  };

  return (
    <button
      type="button"
      className="ndx-theme-toggle"
      onClick={cycle}
      aria-label={`Theme: ${LABELS[theme]}. Click to switch.`}
      title={`Theme: ${LABELS[theme]}`}
    >
      <span className="ndx-theme-toggle__swatch" data-mode={theme} />
      <span className="ndx-theme-toggle__label">{LABELS[theme]}</span>
    </button>
  );
}
