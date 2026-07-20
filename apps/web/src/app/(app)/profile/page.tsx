'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Camera, LogOut, Sun, Moon, MessageCircle, HelpCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'day'|'night'>('day');
  const [loaded, setLoaded] = useState(false);

  if (typeof window !== 'undefined' && !loaded) {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/'); return null; }
    setUser(JSON.parse(u));
    setTheme((localStorage.getItem('dkn-theme') as any) || 'day');
    setLoaded(true);
  }
  if (!loaded || !user) return <div className="flex justify-center py-10"><p className="text-gray-400 text-sm">در حال بارگذاری...</p></div>;

  const toggleTheme = () => {
    const next = theme === 'day' ? 'night' : 'day';
    setTheme(next);
    localStorage.setItem('dkn-theme', next);
    document.documentElement.classList.toggle('dark', next === 'night');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-night-text mb-6">پروفایل</h1>

      <div className="card text-center mb-4 shadow-glow">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-glow">
            {user.firstName?.[0] || 'ک'}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-glow"><Camera size={14} /></button>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-night-text">{user.firstName} {user.lastName || ''}</h2>
        <p className="text-sm text-gray-500 dark:text-night-muted mt-1">@{user.username || user.phone}</p>
        <p className="text-xs text-gray-400 dark:text-night-muted/70 mt-2">عضو از {new Date(user.createdAt).toLocaleDateString('fa-IR')}</p>
      </div>

      <div className="card mb-4 shadow-glow">
        <h3 className="text-sm font-medium text-gray-500 dark:text-night-muted mb-3">اطلاعات تماس</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><User size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">{user.firstName} {user.lastName || ''}</span></div>
          <div className="flex items-center gap-3"><Phone size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">{user.phone}</span></div>
          {user.email && <div className="flex items-center gap-3"><Mail size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">{user.email}</span></div>}
        </div>
      </div>

      <div className="card mb-4 shadow-glow">
        <h3 className="text-sm font-medium text-gray-500 dark:text-night-muted mb-3">تنظیمات</h3>
        <button onClick={toggleTheme} className="w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-2">{theme === 'day' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-blue-400" />}<span className="text-sm text-gray-700 dark:text-night-text">تم {theme === 'day' ? 'روز' : 'شب'}</span></div>
          <span className="text-xs text-gray-400">{theme === 'day' ? <Sun size={14} className='text-amber-500' /> : <Moon size={14} className='text-blue-400' />}</span>
        </button>
      </div>

      <div className="card mb-4 shadow-glow">
        <h3 className="text-sm font-medium text-gray-500 dark:text-night-muted mb-3">پشتیبانی</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 py-2"><MessageCircle size={18} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">چت آنلاین</span></div>
          <div className="flex items-center gap-3 py-2"><Phone size={18} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">۰۲۱-۱۲۳۴۵۶۷۸</span></div>
          <div className="flex items-center gap-3 py-2"><HelpCircle size={18} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-night-text">سوالات متداول</span></div>
        </div>
      </div>

      <button onClick={() => { if (confirm('آیا مطمئن هستید؟')) handleLogout(); }}
        className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl p-4 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium">
        <LogOut size={18} /> خروج از حساب
      </button>
    </div>
  );
}