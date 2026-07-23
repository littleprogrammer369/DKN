'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowRight, Pencil, MapPin, Calendar, CalendarClock, Droplet, Bug, Sparkles, Layers, Loader2 } from 'lucide-react';
import { cropLabel, cropIcon } from '@/lib/crops';
import SatelliteCard from '@/components/SatelliteCard';
import { fa, formatJalali } from "@/lib/jalali";
import SatelliteChart from '@/components/SatelliteChart';

const FarmMap = dynamic(() => import('./FarmMap'), { ssr: false });

// ── Helpers & tiny UI atoms ──────────────────────────────────────────

const IRR_MAP: Record<string, string> = {
  DRIP: 'قطره‌ای', SPRINKLER: 'بارانی', SURFACE: 'سطحی', SUBSURFACE: 'زیرزمینی',
};
function MiniStat({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div className="flex-1 text-center px-1">
      <div className="flex items-center justify-center gap-1 text-base font-extrabold text-gray-900 dark:text-white">
        {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />}
        <span className={value === '—' ? 'opacity-50' : ''}>{value}</span>
      </div>
      <div className="text-[11px] text-gray-500 dark:text-night-muted mt-0.5 truncate">{label}</div>
    </div>
  );
}

function SpecRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-night-muted">
        <span className="w-7 h-7 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center">
          <Icon size={15} />
        </span>
        {label}
      </span>
      <span className={`font-bold text-gray-900 dark:text-white ${value === '—' ? 'opacity-50' : ''}`}>{value}</span>
    </div>
  );
}

function ActionCard({ icon: Icon, title, sub, color, onClick }: { icon: any; title: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="card flex flex-col items-center gap-1 p-3 text-center hover:border-brand-green/40 hover:scale-[1.02] transition-all">
      <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '1a', color }}>
        <Icon size={18} />
      </span>
      <span className="text-xs font-bold text-gray-800 dark:text-white">{title}</span>
      <span className="text-[10px] text-gray-500 dark:text-night-muted">{sub}</span>
    </button>
  );
}

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

  const [satellite, setSatellite] = useState<any>(null);
  const [satHistory, setSatHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!farm?.id) return;
    const token = localStorage.getItem('token');
    const headers = { Authorization: 'Bearer ' + (token || '') };
    fetch('/api/v1/satellite/' + farm.id, { headers })
      .then(r => (r.ok ? r.json() : null)).then(setSatellite).catch(() => {});
    fetch('/api/v1/satellite/' + farm.id + '/history?days=90', { headers })
      .then(r => (r.ok ? r.json() : [])).then(d => setSatHistory(Array.isArray(d) ? d : [])).catch(() => {});
  }, [farm?.id]);

  if (loading) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted"><Loader2 className="animate-spin" size={16} /></p></div>;
  if (!farm) return <div className="text-center mt-12"><p className="text-red-500 dark:text-red-400 dark:text-red-400">مزرعه یافت نشد</p></div>;

  const location = [farm.city, farm.province].filter(Boolean).join('، ');
  const CropIcon = cropIcon(farm.product);
  const ndvi = satellite?.ndvi ?? null;
  const ndviColor = ndvi == null ? undefined : ndvi >= 0.6 ? '#16a34a' : ndvi >= 0.4 ? '#3b82f6' : ndvi >= 0.2 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-4 pb-4">
      {/* Back */}

      <button type="button" onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-4 hover:text-brand-green transition-colors">
        <ArrowRight size={16} /> بازگشت
      </button>

      {/* Hero */}

      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
            <CropIcon size={22} />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white truncate">{farm.name}</h1>
              {farm.areaHa != null && (
                <span className="shrink-0 text-[11px] font-bold text-brand-green bg-brand-green/10 rounded-full px-2 py-0.5 whitespace-nowrap">
                  {fa(farm.areaHa)} هکتار
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-night-muted truncate mt-0.5">{location || 'موقعیت ثبت نشده'}</p>
          </div>
          <button type="button" onClick={() => router.push('/setup?edit=' + farm.id)}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-brand-green/40 bg-brand-green/5 hover:bg-brand-green/15 text-brand-green px-3 py-2 text-sm font-bold transition-colors"
            aria-label="ویرایش مزرعه">
            <Pencil size={15} /> ویرایش
          </button>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-white/5 mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
          <MiniStat label="مساحت (هکتار)" value={fa(farm.areaHa)} />
          <MiniStat label="محصول" value={cropLabel(farm.product)} />
          <MiniStat label="شاخص NDVI" value={ndvi == null ? '—' : fa(ndvi)} dot={ndviColor} />
        </div>
      </div>

      {/* Map */}

      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-night-border">
        <FarmMap name={farm.name}
          center={farm.lat != null && farm.lng != null ? [farm.lat, farm.lng] : null}
          boundary={farm.boundary ?? null} />
      </div>

      {/* Quick actions (farm-scoped) */}

      <div className="grid grid-cols-3 gap-2">
        <ActionCard icon={Droplet} title="آبیاری" sub="برنامه و ثبت" color="#0ea5e9" onClick={() => router.push('/irrigation?farm=' + farm.id)} />
        <ActionCard icon={Bug} title="آفات" sub="گزارش و ریسک" color="#f59e0b" onClick={() => router.push('/pests?farm=' + farm.id)} />
        <ActionCard icon={Sparkles} title="مشاوره AI" sub="پرسش هوشمند" color="#16a34a" onClick={() => router.push('/ai?farm=' + farm.id)} />
      </div>

      {/* Spec list — high contrast values */}

      <div className="card p-4">
        <h2 className="font-bold text-gray-900 dark:text-white text-right mb-1">اطلاعات مزرعه</h2>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          <SpecRow icon={Calendar} label="تاریخ کشت" value={formatJalali(farm.cropDate)} />
          <SpecRow icon={Droplet} label="روش آبیاری" value={farm.irrigationType ? (IRR_MAP[farm.irrigationType] || farm.irrigationType) : '—'} />
          <SpecRow icon={Layers} label="نوع خاک" value={farm.soilType || '—'} />
          <SpecRow icon={MapPin} label="موقعیت" value={location || '—'} />
          <SpecRow icon={CalendarClock} label="تاریخ ثبت" value={formatJalali(farm.createdAt)} />
        </div>
      </div>

      {/* Satellite */}

      <div className="space-y-3">
        <SatelliteCard data={satellite} />
        <SatelliteChart data={satHistory} />
      </div>
    </div>
  );
}
