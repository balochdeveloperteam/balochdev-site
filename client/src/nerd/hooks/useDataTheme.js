import { useEffect, useState } from 'react';

export function useDataTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const read = () => setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  return theme;
}
