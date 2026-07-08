'use client';

import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { id: 'dashboard', label: 'داشبورد', icon: '◉', path: '/dashboard' },
  { id: 'farms', label: 'زمین‌ها', icon: '⬡', path: '/farms' },
  { id: 'ai', label: 'دستیار', icon: '✦', path: '/ai' },
  { id: 'irrigation', label: 'آبیاری', icon: 'Droplet', path: '/irrigation' },
  { id: 'pests', label: 'آفات', icon: '🔍', path: '/pests' },
  { id: 'profile', label: 'پروفایل', icon: 'User', path: '/profile' },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="nav-bar">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <button
            key={item.id}
            className={`nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
          >
            <span className={`text-lg ${isActive ? 'text-brand-green' : ''}`}>{item.icon}</span>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-brand-green' : 'text-gray-400 dark:text-night-muted'}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
