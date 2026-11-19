import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const root = () => document.documentElement;
const read = (): Theme => (root().classList.contains('dark') ? 'dark' : 'light');

function saved(): Theme | null {
  try {
    const t = localStorage.getItem('theme');
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

/**
 * Theme lives on <html class="dark">. index.html sets it before first paint;
 * this hook keeps React in sync and follows the OS until the visitor picks one.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(read()));
    obs.observe(root(), { attributes: true, attributeFilter: ['class'] });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = (e: MediaQueryListEvent) => {
      if (!saved()) root().classList.toggle('dark', e.matches);
    };
    mq.addEventListener('change', onSystem);

    return () => {
      obs.disconnect();
      mq.removeEventListener('change', onSystem);
    };
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = read() === 'dark' ? 'light' : 'dark';
    root().classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode — theme still applies for this visit */
    }
  }, []);

  return { theme, toggle };
}
