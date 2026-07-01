'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Farm { id: string; name: string; city?: string; province?: string; areaHa?: number; product?: string }
interface User { firstName?: string; lastName?: string; phone?: string }

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    const saved = localStorage.getItem('user');
    if (saved) try { setUser(JSON.parse(saved)); } catch {}
    Promise.all([
      fetch('/api/v1/auth/profile', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
    ]).then(([u, f]) => {
      if (u.firstName) { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }
      setFarms(Array.isArray(f) ? f : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex items-center justify-center h-40"><p className="text-gray-400 text-sm">⏳</p></div>;

  if (farms.length === 0) {
    return (<>
      <div className="text-center mt-12">
        <div className="text-7xl mb-4">🌾</div>
        <h1 className="text-lg font-extrabold text-gray-800 mb-2">{user?.firstName ? user.firstName + ' عزیز،' : 'سلام!'} خوش آمدی</h1>
        <p className="text-sm text-gray-500 mb-6">هنوز هیچ مزرعه‌ای ثبت نکردی</p>
        <button onClick={() => router.push('/setup')} className="btn-primary">🌱 ساخت اولین مزرعه</button>
      </div>
    </>);
  }

  const farm = farms[0];
  const loc = [farm.city, farm.province].filter(Boolean).join('، ') || 'موقعیت ثبت نشده';

  return (<>
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-xs text-gray-500">خوش آمدی 👋</p>
        <h1 className="text-lg font-extrabold text-gray-800">{user?.firstName || 'کشاورز'}</h1>
      </div>
      <button className="w-10 h-10 rounded-full glass flex items-center justify-center">🔔</button>
    </div>

    <div onClick={() => router.push('/farms')} className="glass-deep px-4 py-3 mb-4 flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌾</span>
        <div>
          <div className="text-sm font-bold text-gray-800">{farm.name}</div>
          <div className="text-[10px] text-gray-400">{loc}{farm.areaHa ? ' · ' + farm.areaHa + ' هکتار' : ''}</div>
        </div>
      </div>
      <span className="text-gray-400">❮</span>
    </div>

    <div className="card mb-4">
      <div className="text-sm font-bold text-gray-700 mb-3">📊 اطلاعات مزرعه</div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div><div className="text-xl font-extrabold text-brand-green">{farm.areaHa || '---'}</div><div className="text-[10px] text-gray-500">هکتار</div></div>
        <div><div className="text-xl font-extrabold text-brand-green">{farm.product || 'گندم'}</div><div className="text-[10px] text-gray-500">محصول</div></div>
      </div>
    </div>

    <div className="section-title">دسترسی سریع</div>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div onClick={() => router.push('/irrigation')} className="card text-center cursor-pointer hover:shadow-lg transition-all">
        <div className="text-3xl mb-1">💧</div>
        <div className="text-xs font-bold text-gray-700">توصیه آبیاری</div>
        <div className="text-[10px] text-gray-500">ثبت و بررسی</div>
      </div>
      <div className="card text-center opacity-50">
        <div className="text-3xl mb-1">🛰️</div>
        <div className="text-xs font-bold text-gray-700">تصویر ماهواره</div>
        <div className="text-[10px] text-gray-400">به زودی</div>
      </div>
      <div onClick={() => router.push('/pests')} className="card text-center cursor-pointer hover:shadow-lg transition-all">
        <div className="text-3xl mb-1">🧬</div>
        <div className="text-xs font-bold text-gray-700">پیش‌بینی آفات</div>
        <div className="text-[10px] text-gray-500">ثبت گزارش</div>
      </div>
      <div className="card text-center opacity-50">
        <div className="text-3xl mb-1">📅</div>
        <div className="text-xs font-bold text-gray-700">برداشت</div>
        <div className="text-[10px] text-gray-400">به زودی</div>
      </div>
    </div>
  </>);
}
