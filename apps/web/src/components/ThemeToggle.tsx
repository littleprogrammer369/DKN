'use client';

import { useTheme } from '@/lib/theme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label={theme === 'day' ? 'حالت شب' : 'حالت روز'}
      title={theme === 'day' ? 'حالت شب' : 'حالت روز'}
    >
      <span className="animate-theme-swirl inline-block">
        {theme === 'day' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
