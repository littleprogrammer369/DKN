'use client';

import { ThemeProvider } from '@/lib/theme';
import NavBar from '@/components/NavBar';
import ThemeToggle from '@/components/ThemeToggle';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="h-full overflow-y-auto px-4 pt-4 pb-24 transition-colors duration-300 max-w-[420px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-emblem-light.svg" alt="داده کشت نوین" className="h-10 w-auto shrink-0 object-contain select-none pointer-events-none dark:hidden" draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-emblem-dark.svg" alt="داده کشت نوین" className="h-10 w-auto shrink-0 object-contain select-none pointer-events-none hidden dark:block" draggable={false} />
            <span className="text-sm font-bold text-gray-700 dark:text-night-text/80">داده کشت نوین</span>
          </div>
          <ThemeToggle />
        </div>
        {children}
      </div>
      <NavBar />
    </ThemeProvider>
  );
}

