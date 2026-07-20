'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'day' | 'night';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'day', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'day' | 'night'>('day');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('dkn-theme') as 'day' | 'night' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const t = saved || (prefersDark ? 'night' : 'day');
    setTheme(t);
    document.documentElement.classList.toggle('dark', t === 'night');
  }, []);

  const toggle = () => {
    const next = theme === 'day' ? 'night' : 'day';
    setTheme(next);
    localStorage.setItem('dkn-theme', next);
    document.documentElement.classList.toggle('dark', next === 'night');
  };

  if (!mounted) return <>{children}</>;

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
