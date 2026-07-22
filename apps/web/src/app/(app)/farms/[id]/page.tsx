'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowRight, Wheat, Sprout, Droplet, Bug, Sparkles, MapPin, Calendar, Pencil, Loader2 } from 'lucide-react';

const FarmMap = dynamic(() => import('./FarmMap'), { ssr: false });

interface Farm { id: string; name: string; product: string; city?: string; province?: string;
  areaHa?: number; soilType?: string; irrigationType?: string; cropDate?: string; createdAt: string;
  lat?: number; lng?: number; boundary?: [number, number][]; }

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

  if (loading) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted"><Loader2 className="animate-spin" size={16} /></p></div>;
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
    <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-3"><ArrowRight size={16} /> بازگشت</button>

    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><Sprout className="text-green-600" size={22} /></div>
      <div className="flex-1">
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">{farm.name}</h1>
        <p className="text-xs text-gray-400 dark:text-night-muted">{location || 'موقعیت ثبت نشده'}{farm.areaHa ? ' · ' + String(farm.areaHa) + ' هکتار' : ''}</p>
      </div>
      <button
        type="button"
        onClick={() => router.push('/setup?edit=' + farm.id)}
        className="btn-outline w-auto shrink-0 !py-1.5 !px-3 !text-xs flex items-center gap-1"
      >
        <Pencil size={14} /> ویرایش
      </button>
    </div>

    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-night-border mb-4">
      <FarmMap
        name={farm.name}
        center={farm.lat != null && farm.lng != null ? [farm.lat, farm.lng] : null}
        boundary={farm.boundary ?? null}
      />
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">محصول</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.product || 'گندم'}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">تاریخ کشت</div><div className="text-sm font-bold text-gray-800 mt-1">{toJalali(farm.cropDate || '')}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">نوع آبیاری</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.irrigationType ? irrMap[farm.irrigationType] || farm.irrigationType : '—'}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">نوع خاک</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.soilType || '—'}</div></div>
    </div>

        <div className="card mb-4">
      <div className="text-xs font-bold mb-3">معیارهای مزرعه</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-50/50 dark:bg-night-surface rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-brand-green">{farm.areaHa || '--'}</div>
          <div className="text-[9px] text-gray-500">مساحت (هکتار)</div>
        </div>
        <div className="bg-green-50/50 dark:bg-night-surface rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-brand-green">{farm.product || 'گندم'}</div>
          <div className="text-[9px] text-gray-500">محصول</div>
        </div>
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      <button onClick={() => router.push('/irrigation?farm=' + farm.id)} className="btn-outline flex-1 !text-xs flex items-center justify-center gap-1"><Droplet size={14} /> آبیاری</button>
      <button onClick={() => router.push('/pests?farm=' + farm.id)} className="btn-outline flex-1 !text-xs flex items-center justify-center gap-1"><Bug size={14} /> آفات</button>
      <button onClick={() => router.push('/ai?farm=' + farm.id)} className="btn-outline flex-1 !text-xs flex items-center justify-center gap-1"><Sparkles size={14} /> مشاوره AI</button>
    </div>
<div className="card"><div className="text-xs text-gray-500 dark:text-night-muted">تاریخ ثبت</div><div className="text-sm font-bold text-gray-700 mt-1">{toJalali(farm.createdAt)}</div></div>
  </>);
}
