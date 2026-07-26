'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sprout, Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, Thermometer, Bug, Sparkles, Bot,
  AlertTriangle, AlertCircle, Info, Satellite, RefreshCw, Bell, ClipboardList, Plus, Loader2, User,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { toast } from '@/lib/toast';
import Dropdown from '@/components/Dropdown';
import { fa, gregorianToJalaliParts } from '@/lib/jalali';
import { cropLabel } from '@/lib/crops';
import { JALALI_MONTHS } from '@/lib/utils';

const DAY = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
const H = () => ({ Authorization: 'Bearer ' + (localStorage.getItem('token') || '') });

function wmoIcon(code?: number | null) {
  if (code == null) return { I: CloudSun, c: 'text-gray-400' };
  if (code <= 1) return { I: Sun, c: 'text-amber-400' };
  if (code <= 3) return { I: CloudSun, c: 'text-amber-300' };
  if (code <= 48) return { I: Cloud, c: 'text-gray-300' };
  if (code <= 67 || (code >= 80 && code <= 82)) return { I: CloudRain, c: 'text-sky-400' };
  if ((code >= 71 && code <= 77) || code >= 85) return { I: Cloud, c: 'text-cyan-200' };
  if (code >= 95) return { I: CloudRain, c: 'text-indigo-300' };
  return { I: Cloud, c: 'text-gray-300' };
}

function NotifBell() {
  const [n, setN] = useState(0); const [open, setOpen] = useState(false); const [list, setList] = useState<any[]>([]);
  const ref = useRef<HTMLButtonElement>(null); const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => { fetch('/api/v1/notifications/unread-count', { headers: H() }).then(r => r.ok ? r.json() : 0).then((d: any) => setN(typeof d === 'number' ? d : (d?.count ?? 0))).catch(() => {}); }, []);
  const toggle = async () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 6, left: Math.max(8, r.right - 320) });
    const willOpen = !open; setOpen(willOpen);
    if (willOpen) {
      const l = await fetch('/api/v1/notifications', { headers: H() }).then(r => r.ok ? r.json() : []).catch(() => []);
      setList(Array.isArray(l) ? l : []);
      fetch('/api/v1/notifications/read-all', { method: 'POST', headers: H() }).catch(() => {}); setN(0);
    }
  };
  return (
    <div className="relative">
      <button ref={ref} onClick={toggle} className="relative w-9 h-9 rounded-xl bg-white/5 dark:bg-night-surface flex items-center justify-center hover:bg-white/10">
        <Bell size={16} className="text-gray-400" />
        {n > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{fa(n)}</span>}
      </button>
      {open && pos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div style={{ position: 'fixed', top: pos.top, left: pos.left }} className="z-50 w-80 max-h-80 overflow-y-auto card p-2 text-right">
            <div className="text-xs font-bold text-gray-900 dark:text-white px-2 py-1">اعلان‌ها</div>
            {list.length === 0 ? <div className="text-[11px] text-gray-500 px-2 py-3 text-center">اعلان جدیدی نیست</div> :
              list.slice(0, 8).map((x: any) => (
                <div key={x.id} className="px-2 py-2 rounded-lg hover:bg-white/5">
                  <div className="text-xs font-bold text-gray-800 dark:text-white/90">{x.title}</div>
                  <div className="text-[11px] text-gray-500">{x.body}</div>
                </div>))}
          </div>
        </>
      )}
    </div>
  );
}

function DashboardInner() {
  const router = useRouter();
  const sp = useSearchParams(); const farmParam = sp.get('farm');
  const [user, setUser] = useState<any>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [farmId, setFarmId] = useState<string>('');
  const [panel, setPanel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBase = async () => {
    const [u, f] = await Promise.all([
      fetch('/api/v1/auth/profile', { headers: H() }).then(r => r.json()).catch(() => ({})),
      fetch('/api/v1/farms', { headers: H() }).then(r => r.json()).catch(() => []),
    ]);
    if (u?.firstName) { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }
    const fl = Array.isArray(f) ? f : []; setFarms(fl);
    setFarmId((farmParam && fl.some((x: any) => x.id === farmParam)) ? farmParam : (fl[0]?.id || ''));
  };
  const loadPanel = async (id: string) => { setLoading(true); const d = await fetch('/api/v1/weather/panel/' + id, { headers: H() }).then(r => r.ok ? r.json() : null).catch(() => null); setPanel(d); setLoading(false); };
  useEffect(() => { loadBase().catch(() => setLoading(false)); }, []);
  useEffect(() => { if (farmId) loadPanel(farmId); }, [farmId]);

  if (loading && !panel) return <div className="space-y-3 animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card h-24 rounded-2xl bg-white/5" />)}</div>;

  const c = panel?.current; const forecast = panel?.forecast || []; const series = panel?.series || []; const stats = panel?.seriesStats;
  const sat = panel?.satellite; const irr = panel?.irrigation; const pests = panel?.pests; const kpis = panel?.kpis || {};
  const alerts = panel?.alerts || []; const rec = panel?.recommendation || { label: 'توصیه هوش مصنوعی', title: '—', body: '' };
  const health = panel?.healthScore ?? null; const w = wmoIcon(c?.weatherCode); const W = w.I;
  const trend = (sat?.trend || []).map((s: any) => ({ d: s.date ? fa(gregorianToJalaliParts(s.date).day) : '', ndvi: s.ndvi, evi: s.evi }));
  const healthColor = health == null ? '#94a3b8' : health >= 70 ? '#22c55e' : health >= 40 ? '#f59e0b' : '#ef4444';
  const irrPct = irr?.daysSince != null ? Math.min(100, Math.round((irr.daysSince / (irr.cycleDays || 7)) * 100)) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-right min-w-0">
          <p className="text-base font-extrabold text-gray-900 dark:text-white truncate">سلام {user?.firstName || 'کشاورز'}</p>
          <p className="text-[11px] text-gray-500 dark:text-night-muted">{(() => { const d = new Date(); const j = gregorianToJalaliParts(d); return `خوش آمدید · ${DAY[d.getDay()]}، ${fa(j.day)} ${JALALI_MONTHS[j.month - 1]} ${fa(j.year)}`; })()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => farmId && loadPanel(farmId)} className="w-9 h-9 rounded-xl bg-white/5 dark:bg-night-surface flex items-center justify-center hover:bg-white/10"><RefreshCw size={15} className="text-gray-400" /></button>
          <NotifBell />
          <button onClick={() => router.push('/profile')} className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">{user?.firstName?.[0] || <User size={14} />}</button>
        </div>
      </div>

      {/* Farm selector */}
      {farms.length > 0 && <Dropdown value={farmId} onChange={v => setFarmId(String(v))} options={farms.map((f: any) => ({ value: f.id, label: f.name }))} placeholder="انتخاب مزرعه" />}

      {!panel || panel.error ? (
        <div className="card p-6 text-center text-sm text-gray-500">برای این مزرعه داده‌ای در دسترس نیست.</div>
      ) : (
        <>
          {/* SMART SUMMARY */}
          <div className="card p-3 shadow-glow space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 dark:bg-night-surface/60 border border-white/5 p-4 text-right">
                <div className="text-[11px] text-gray-400">دما (امروز)</div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{c ? Math.round(c.temperature) + '°C' : '--'}</div>
              </div>
              <div className="rounded-2xl bg-white/5 dark:bg-night-surface/60 border border-white/5 p-4 text-right">
                <div className="text-[11px] text-gray-400">سلامت مزرعه</div>
                <div className="text-2xl font-extrabold mt-1" style={{ color: healthColor }}>{health != null ? fa(health) + '٪' : '—'}</div>
                <div className="prog-bg mt-2"><div className="prog-fill" style={{ width: (health ?? 0) + '%', background: healthColor }} /></div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 dark:bg-night-surface/60 border border-white/5 p-4 flex items-center justify-between gap-3">
              <div className="text-right min-w-0">
                <div className="text-[11px] text-gray-400">{rec.label}</div>
                <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">{rec.title}</div>
                {rec.body && <div className="text-[11px] text-gray-400 mt-0.5">{rec.body}</div>}
              </div>
              <div className="w-11 h-11 rounded-xl bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0"><Bot size={20} /></div>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((a: any, i: number) => { const danger = a.severity === 'danger'; const warn = a.severity === 'warning'; const I = danger ? AlertCircle : warn ? AlertTriangle : Info; return (
                <div key={i} className={'card p-3 border flex items-start gap-2 ' + (danger ? 'border-red-500/30 text-red-600 dark:text-red-300' : warn ? 'border-amber-500/30 text-amber-700 dark:text-amber-300' : 'border-brand-green/30 text-brand-green')}>
                  <I size={16} className="mt-0.5 shrink-0" /><div className="text-right"><span className="text-sm font-bold">{a.title}</span> <span className="text-[11px] opacity-90">{a.body}</span></div>
                </div>); })}
            </div>
          )}

          {/* Weather: current + 5-day */}
          {c && (
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="text-right"><div className="text-3xl font-extrabold text-gray-900 dark:text-white">{Math.round(c.temperature)}°</div><div className="text-xs text-gray-500">{c.weatherText}{c.apparentTemperature != null ? ' · احساسی ' + Math.round(c.apparentTemperature) + '°' : ''}</div></div>
                <W size={44} className={w.c} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
                <div><Droplets size={14} className="mx-auto mb-1 text-sky-400" /><div className="text-xs font-bold text-gray-900 dark:text-white">{c.humidity ?? '--'}٪</div><div className="text-[9px] text-gray-400">رطوبت</div></div>
                <div><Wind size={14} className="mx-auto mb-1 text-teal-400" /><div className="text-xs font-bold text-gray-900 dark:text-white">{c.windSpeed ?? '--'}</div><div className="text-[9px] text-gray-400">باد</div></div>
                <div><CloudRain size={14} className="mx-auto mb-1 text-sky-300" /><div className="text-xs font-bold text-gray-900 dark:text-white">{c.precipitation ?? 0}</div><div className="text-[9px] text-gray-400">بارش</div></div>
              </div>
              {forecast.length > 0 && (
                <div className="grid grid-cols-5 gap-1.5 mt-3">
                  {forecast.slice(0, 5).map((d: any, i: number) => { const f = wmoIcon(d.weatherCode); const F = f.I; return (
                    <div key={i} className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-2">
                      <div className="text-[9px] text-gray-500">{DAY[new Date(d.date).getDay()]}</div><F size={16} className={f.c} />
                      <div className="text-[11px] font-bold text-gray-900 dark:text-white">{d.tempMax != null ? Math.round(d.tempMax) : '--'}°</div>
                      <div className="text-[9px] text-sky-400">{d.dayPrecipitation != null ? fa(d.dayPrecipitation) + '٪' : ''}</div>
                    </div>); })}
                </div>
              )}
            </div>
          )}

          {/* Vegetation / satellite */}
          <div className="card p-4">
            <div className="flex items-center gap-1.5 justify-between mb-3 text-sm font-bold text-gray-900 dark:text-white"><span>پوشش گیاهی</span><Satellite size={15} className="text-brand-green" /></div>
            {sat?.latest ? (
              <>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {([['NDVI', sat.latest.ndvi], ['EVI', sat.latest.evi], ['NDWI', sat.latest.ndwi], ['MSI', sat.latest.msi]] as any).map(([k, v]: any) => (
                    <div key={k} className="rounded-xl bg-white/5 p-2"><div className="text-sm font-extrabold text-brand-green">{v != null ? fa(v) : '—'}</div><div className="text-[9px] text-gray-400">{k}</div></div>))}
                </div>
                {trend.length > 1 && <div style={{ width: '100%', height: 160 }} className="mt-3"><ResponsiveContainer><LineChart data={trend} margin={{ top: 8, right: 10, left: 0, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" /><XAxis dataKey="d" tick={{ fontSize: 9, fill: '#94a3b8' }} tickMargin={6} height={26} /><YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: '#94a3b8' }} tickMargin={6} width={28} /><Tooltip contentStyle={{ background: 'rgba(10,26,18,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} /><Line type="monotone" dataKey="ndvi" stroke="#22c55e" dot={false} strokeWidth={2} name="NDVI" /><Line type="monotone" dataKey="evi" stroke="#38bdf8" dot={false} strokeWidth={2} name="EVI" /></LineChart></ResponsiveContainer></div>}
              </>
            ) : (
              <div className="text-center py-4"><Satellite size={26} className="mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500">دادهٔ ماهواره‌ای هنوز موجود نیست.</p><p className="text-[11px] text-gray-400 mt-1">پس از تعیین محدودهٔ مزرعه، شاخص‌ها اینجا نمایش داده می‌شوند.</p></div>
            )}
          </div>

          {/* Irrigation + Pests */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => router.push('/irrigation')} className="card p-4 text-right hover:shadow-glow-lg transition-all">
              <Droplets size={18} className="text-sky-400" />
              <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-2">آبیاری</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{irr?.daysSince != null ? `${fa(irr.daysSince)} روز پیش` : 'ثبت‌نشده'}</div>
              <div className="prog-bg mt-2"><div className="prog-fill" style={{ width: `${irrPct}%` }} /></div>
            </button>
            <button onClick={() => router.push('/pests')} className="card p-4 text-right hover:shadow-glow-lg transition-all">
              <Bug size={18} className={pests?.highOrCritical ? 'text-red-400' : 'text-brand-green'} />
              <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-2">آفات</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{pests?.active ? `${fa(pests.active)} گزارش` : 'وضعیت پایدار'}</div>
            </button>
          </div>

          {/* 30-day trend */}
          {series.length > 1 && (
            <div className="card p-4 space-y-3">
              <div className="text-right text-sm font-bold text-gray-900 dark:text-white">روند ۳۰ روزه</div>
              <div style={{ width: '100%', height: 190 }}><ResponsiveContainer><LineChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" /><XAxis dataKey="date" tickFormatter={v => fa(gregorianToJalaliParts(v).day)} tick={{ fontSize: 9, fill: '#94a3b8' }} tickMargin={8} minTickGap={26} height={30} /><YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickMargin={6} width={30} /><Tooltip contentStyle={{ background: 'rgba(10,26,18,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} /><Line type="monotone" dataKey="tmax" stroke="#f59e0b" dot={false} strokeWidth={2} name="بیشینه" /><Line type="monotone" dataKey="tmin" stroke="#38bdf8" dot={false} strokeWidth={2} name="کمینه" /></LineChart></ResponsiveContainer></div>
              {stats && <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-gray-400">
                <div className="rounded-lg bg-white/5 p-2"><div className="text-sm font-extrabold text-sky-400">{fa(stats.rainyDays)}</div>روز بارانی</div>
                <div className="rounded-lg bg-white/5 p-2"><div className="text-sm font-extrabold text-sky-300">{fa(stats.minTemp)}°</div>حداقل</div>
                <div className="rounded-lg bg-white/5 p-2"><div className="text-sm font-extrabold text-amber-400">{fa(stats.maxTemp)}°</div>حداکثر</div>
                <div className="rounded-lg bg-white/5 p-2"><div className="text-sm font-extrabold text-green-400">{fa(stats.avgTemp)}°</div>میانگین</div>
              </div>}
            </div>
          )}

          {/* AI entry + Reports/Farms */}
          <button onClick={() => router.push('/ai?farm=' + farmId)} className="card p-4 w-full flex items-center justify-between gap-3 hover:shadow-glow-lg transition-all">
            <div className="text-right min-w-0">
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">پرسش از دستیار هوشمند</div>
              <div className="text-[11px] text-gray-400">تحلیل اختصاصی این مزرعه</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0"><Sparkles size={18} /></div>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => router.push('/reports')} className="card p-4 text-right hover:shadow-glow-lg transition-all">
              <ClipboardList size={18} className="text-brand-green" />
              <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-2">گزارش‌ها</div>
              <div className="text-[10px] text-gray-400 mt-0.5">مشاهده و دانلود PDF</div>
            </button>
            <button onClick={() => router.push('/farms')} className="card p-4 text-right hover:shadow-glow-lg transition-all">
              <Sprout size={18} className="text-brand-green" /><div className="text-sm font-extrabold text-gray-900 dark:text-white mt-2">مزارع</div>
              <div className="text-[10px] text-gray-400 mt-1">{fa(kpis.farmsCount ?? 0)} مزرعه · <span className="text-brand-green">افزودن</span></div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="space-y-3 animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card h-24 rounded-2xl bg-white/5" />)}</div>}>
      <DashboardInner />
    </Suspense>
  );
}
