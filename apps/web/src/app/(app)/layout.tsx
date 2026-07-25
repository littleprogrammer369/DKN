'use client';

import { ThemeProvider } from '@/lib/theme';
import NavBar from '@/components/NavBar';
import ThemeToggle from '@/components/ThemeToggle';
import { Sprout } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="h-full overflow-y-auto px-4 pt-4 pb-24 transition-colors duration-300 max-w-[420px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl"><Sprout size={20} /></span>
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

