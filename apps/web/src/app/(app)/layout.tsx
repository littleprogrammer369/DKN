'use client';

import NavBar from '@/components/NavBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-full overflow-y-auto px-4 pt-4 pb-24">
        {children}
      </div>
      <NavBar />
    </>
  );
}
