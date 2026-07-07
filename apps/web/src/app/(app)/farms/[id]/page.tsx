'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

interface Farm { id: string; name: string; product: string; city?: string; province?: string;
  areaHa?: number; soilType?: string; irrigationType?: string; cropDate?: string; createdAt: string;
  lat?: number; lng?: number; }

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
    // Fix Leaflet default icon
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });
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
        <p className="text-xs text-gray-400 dark:text-night-muted">{location || 'موقعیت ثبت نشده'}{farm.areaHa ? ' · ' + String(farm.areaHa) + ' هکتار' : ''}</p>
      </div>
    </div>

    <div className="card h-48 mb-4 overflow-hidden p-0 relative">
      <MapContainer center={[35.7, 51.4]} zoom={13} className="h-full w-full z-0" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.r.png"
        />
        {farm.lat && farm.lng && (
          <Marker position={[farm.lat, farm.lng]}>
            <Popup>{farm.name}{farm.areaHa ? ` - ${farm.areaHa} ha` : ''}</Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-night-card/80 text-[10px] px-2 py-1 rounded-lg z-[1000]">
        {farm.city || ''}{farm.areaHa ? ` · ${farm.areaHa} ha` : ''}</div>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">محصول</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.product || 'گندم'}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">تاریخ کشت</div><div className="text-sm font-bold text-gray-800 mt-1">{toJalali(farm.cropDate || '')}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">نوع آبیاری</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.irrigationType ? irrMap[farm.irrigationType] || farm.irrigationType : '—'}</div></div>
      <div className="card text-center !mb-0"><div className="text-xs text-gray-500 dark:text-night-muted">نوع خاک</div><div className="text-sm font-bold text-gray-800 mt-1">{farm.soilType || '—'}</div></div>
    </div>

        <div className="card mb-4">
      <div className="text-xs font-bold mb-3">Farm Metrics</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-50/50 dark:bg-night-surface rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-brand-green">{farm.areaHa || '--'}</div>
          <div className="text-[9px] text-gray-500">Area (ha)</div>
        </div>
        <div className="bg-green-50/50 dark:bg-night-surface rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-brand-green">{farm.product || 'Wheat'}</div>
          <div className="text-[9px] text-gray-500">Product</div>
        </div>
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      <button onClick={() => router.push('/irrigation')} className="btn-outline flex-1 !text-xs">Irrigation</button>
      <button onClick={() => router.push('/pests')} className="btn-outline flex-1 !text-xs">Pests</button>
      <button onClick={() => router.push('/ai')} className="btn-outline flex-1 !text-xs">AI Advice</button>
    </div>
<div className="card"><div className="text-xs text-gray-500 dark:text-night-muted">تاریخ ثبت</div><div className="text-sm font-bold text-gray-700 mt-1">{toJalali(farm.createdAt)}</div></div>
  </>);
}
