'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Sprout, Bot, Droplet, Bug, User } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'farms', label: 'زمین‌ها', icon: Sprout, path: '/farms' },
  { id: 'ai', label: 'دستیار', icon: Bot, path: '/ai' },
  { id: 'irrigation', label: 'آبیاری', icon: Droplet, path: '/irrigation' },
  { id: 'pests', label: 'آفات', icon: Bug, path: '/pests' },
  { id: 'profile', label: 'پروفایل', icon: User, path: '/profile' },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 nav-glass rounded-[28px]" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <div className="flex items-center justify-around py-1.5 px-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={'flex flex-col items-center gap-1 py-0.5 px-3 rounded-2xl transition-all ' + (isActive ? 'bg-brand-green/15 scale-105' : 'hover:bg-white/10')}
              onClick={() => router.push(item.path)}
            >
              <Icon size={24} className={isActive ? 'text-brand-green' : 'text-gray-400 dark:text-night-muted'} strokeWidth={isActive ? 2.4 : 2} />
              <span className={'text-[11px] font-bold ' + (isActive ? 'text-brand-green' : 'text-gray-400 dark:text-night-muted')}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
