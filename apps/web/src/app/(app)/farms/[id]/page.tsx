'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Farm { id: string; name: string; product: string; city?: string; province?: string;
  areaHa?: number; soilType?: string; irrigationType?: string; cropDate?: string; createdAt: string }

export default function FarmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms/' + params.id, { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => { setFarm(d); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted">⏳</p></div>;
  if (!farm) return <div className="text-center mt-12"><p className="text-red-500 dark:text-red-400 dark:text-red-400">مزرعه یافت نشد</p></div>;

  const location = [farm.city, farm.province].filter(Boolean).join('، ');
  const irrMap: Record<string, string> = { DRIP: 'قطره‌ای', SPRINKLER: 'بارانی', SURFACE: 'سطحی', SUBSURFACE: 'زیرزمینی' };

  const toJalali = (iso: string): string => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    const gy = d.getFullYear(), gm = d.getMonth() + 1, gd = d.getDate();
    let jy = gy - 621, jm = gm + 3, jd = gd;
    if (gm < 3 || (gm === 3 && gd < 21)) { jy--; jm = gm + 9; }
    return jy + '/' + String(jm).padStart(2,'0') + '/' + String(jd).padStart(2,'0');
  };

  return (<>
    <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted dark:text-night-muted mb-3"><span>❮</span> بازگشت</button>

    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl">🌾</span>
      <div>
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">{farm.name}</h1>
        <p className="text-xs text-gray-400 dark:text-night-muted">{location || 'موقعیت ثبت نشده'}{farm.areaHa ? ' · ' + farm.areaHa + ' هکتار' : ''}</p>
      </div>
    </div>

    <div className="card h-36 mb-4 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="text-center">
        <span className="text-4xl block mb-1">🗺️</span>
        <p className="text-xs text-gray-500 dark:text-night-muted">نقشه مزرعه — به زودی</p>
        {farm.areaHa && <p className="text-[10px] text-gray-400 dark:text-night-muted mt-1">{farm.areaHa} هکتار</p>}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">محصول</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.product || 'گندم'}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">تاریخ کشت</div><div className="text-sm font-bold text-gray-800 mt-1">{toJalali(farm.cropDate || '')}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">نوع آبیاری</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.irrigationType ? irrMap[farm.irrigationType] || farm.irrigationType : '—'}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">نوع خاک</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.soilType || '—'}</div></div>
    </div>

    <div className="card"><div className="text-xs text-gray-500 dark:text-night-muted">تاریخ ثبت</div><div className="text-sm font-bold text-gray-700 mt-1">{toJalali(farm.createdAt)}</div></div>
  </>);
}
