'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Droplet, Cloud, CloudRain, CloudLightning, Snowflake, Sun, Plus, History, Sparkles, Loader2, X } from 'lucide-react';
import Dropdown from '@/components/Dropdown';
import { toast } from '@/lib/toast';
import { fa } from '@/lib/jalali';
import { jalaliToGregorian, JALALI_MONTHS, getJalaliToday } from '@/lib/utils';

function wmoIcon(code?: number | null) {
  if (code == null) return Cloud;
  if (code <= 1) return Sun;
  if (code <= 48) return Cloud;
  if (code <= 57) return CloudRain;
  if (code <= 67 || (code >= 80 && code <= 82)) return CloudRain;
  if ((code >= 71 && code <= 77) || code >= 85) return Snowflake;
  if (code >= 95) return CloudLightning;
  return Cloud;
}
const METHOD_OPTIONS = [
  { value: 'DRIP', label: 'قطره‌ای' }, { value: 'SPRINKLER', label: 'بارانی' },
  { value: 'SURFACE', label: 'سطحی' }, { value: 'SUBSURFACE', label: 'زیرزمینی' },
];
const methodLabel = (v?: string | null) => METHOD_OPTIONS.find(m => m.value === v)?.label || v || '—';
function LogModal({ open, onClose, onCreate, initial }: any) {
  const [amount, setAmount] = useState(''); const [duration, setDuration] = useState('');
  const [method, setMethod] = useState('DRIP'); const [notes, setNotes] = useState('');
  const [sYear, setSYear] = useState<any>(''); const [sMonth, setSMonth] = useState<any>(''); const [sDay, setSDay] = useState<any>('');
  const [sHour, setSHour] = useState<any>(''); const [sMin, setSMin] = useState<any>('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) {
      setAmount(initial?.amount != null ? String(initial.amount) : '');
      setDuration(initial?.duration != null ? String(initial.duration) : '');
      setMethod(initial?.method || 'DRIP'); setNotes('');
      setSYear(''); setSMonth(''); setSDay(''); setSHour(''); setSMin('');
    }
  }, [open, initial]);
  if (!open) return null;

  const p2 = (n: number) => String(n).padStart(2, '0');
  const jt = getJalaliToday();
  const yearOpts = Array.from({ length: 5 }, (_, i) => jt.year - 1 + i).map(y => ({ value: y, label: fa(y) }));
  const monthOpts = JALALI_MONTHS.map((m, i) => ({ value: i + 1, label: m }));
  const dayOpts = Array.from({ length: 31 }, (_, i) => i + 1).map(d => ({ value: d, label: fa(d) }));
  const hourOpts = Array.from({ length: 24 }, (_, i) => i).map(h => ({ value: h, label: fa(p2(h)) }));
  const minOpts = Array.from({ length: 12 }, (_, i) => i * 5).map(m => ({ value: m, label: fa(p2(m)) }));

  // scheduled is empty (= apply now) unless a full شمسی date is chosen
  const scheduled = (sYear && sMonth && sDay)
    ? `${jalaliToGregorian(Number(sYear), Number(sMonth), Number(sDay)).toISOString().slice(0, 10)}T${p2(sHour !== '' ? Number(sHour) : 0)}:${p2(sMin !== '' ? Number(sMin) : 0)}`
    : '';

  const submit = async () => {
    setBusy(true);
    try { await onCreate({ amount: amount ? Number(amount) : null, duration: duration ? Number(duration) : null, method, notes: notes || undefined, scheduledAt: scheduled || undefined }); onClose(); }
    finally { setBusy(false); }
  };
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/60" onClick={onClose}>
      <div className="card w-full max-w-md max-h-[88vh] overflow-y-auto p-5 space-y-4 my-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white/70"><X size={18} /></button>
          <h3 className="font-bold text-gray-900 dark:text-white">ثبت آبیاری</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">حجم آب (مترمکعب)</label><input value={amount} onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" className="input-glass text-right" placeholder="مثلاً 12" /></div>
          <div><label className="block text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">مدت (دقیقه)</label><input value={duration} onChange={e => setDuration(e.target.value.replace(/[^\d]/g, ''))} inputMode="numeric" className="input-glass text-right" placeholder="مثلاً 30" /></div>
        </div>
        <div><label className="block text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">روش آبیاری</label><Dropdown value={method} onChange={v => setMethod(String(v))} options={METHOD_OPTIONS} /></div>

        {/* برنامه‌ریزی — تاریخ شمسی + ساعت (همه Dropdown، بدون کنترل بومی) */}
        <div>
          <label className="block text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">تاریخ برنامه‌ریزی (شمسی) — اختیاری</label>
          <div className="grid grid-cols-3 gap-2">
            <Dropdown value={sYear}  onChange={setSYear}  options={yearOpts}  placeholder="سال" />
            <Dropdown value={sMonth} onChange={setSMonth} options={monthOpts} placeholder="ماه" />
            <Dropdown value={sDay}   onChange={setSDay}   options={dayOpts}   placeholder="روز" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">ساعت برنامه‌ریزی — اختیاری</label>
          <div className="grid grid-cols-2 gap-2">
            <Dropdown value={sHour} onChange={setSHour} options={hourOpts} placeholder="ساعت" />
            <Dropdown value={sMin}  onChange={setSMin}  options={minOpts}  placeholder="دقیقه" />
          </div>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-night-muted text-right">اگر تاریخ شمسی را پر کنی، آبیاری به‌جای ثبت آنی، برای آن زمان برنامه‌ریزی می‌شود.</p>

        <div><label className="block text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">یادداشت (اختیاری)</label><input value={notes} onChange={e => setNotes(e.target.value)} className="input-glass text-right" placeholder="مثلاً بعد از کوددهی" /></div>
        <button onClick={submit} disabled={busy} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">{busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}{scheduled ? 'برنامه‌ریزی آبیاری' : 'ثبت آبیاری'}</button>
      </div>
    </div>,
    document.body
  );
}
function IrrigationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const farmParam = searchParams.get('farm');
  const [farms, setFarms] = useState<any[]>([]);
  const [farmId, setFarmId] = useState('');
  const [dash, setDash] = useState<any>(null);
  const [rec, setRec] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const headers = { Authorization: 'Bearer ' + (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : '') };

  const loadFarmData = (id: string) => Promise.all([
    fetch('/api/v1/weather/' + id + '/dashboard', { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch('/api/v1/irrigation/recommend/' + id, { headers }).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch('/api/v1/irrigation/history/' + id, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
  ]).then(([d, rc, h]) => { setDash(d); setRec(rc); setHistory(Array.isArray(h) ? h : []); setLoading(false); });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers }).then(r => r.json()).then((all: any) => {
      const list = Array.isArray(all) ? all : []; setFarms(list);
      const initial = (farmParam && list.some((f: any) => f.id === farmParam)) ? farmParam : (list[0]?.id || '');
      setFarmId(initial);
      if (initial) loadFarmData(initial); else setLoading(false);
    }).catch(() => setLoading(false));
  }, [router, farmParam]);

  const createLog = async (body: any) => {
    try {
      const res = await fetch('/api/v1/irrigation/log/' + farmId, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(body.scheduledAt ? 'آبیاری برنامه‌ریزی شد 💧' : 'آبیاری ثبت شد 💧');
      loadFarmData(farmId);
    } catch { toast.error('ثبت آبیاری ناموفق بود.'); }
  };

  if (loading) return <div className="p-6 text-center text-gray-500 dark:text-night-muted"><Loader2 className="animate-spin mx-auto" /></div>;
  if (farms.length === 0) return (<div className="card m-4 p-6 text-center"><p className="mb-3 text-gray-600 dark:text-night-muted">ابتدا یک مزرعه ثبت کنید</p><button onClick={() => router.push('/setup')} className="btn-primary">ساخت مزرعه</button></div>);

  const farm = farms.find((f: any) => f.id === farmId) || farms[0];
  const weather = dash?.current; const forecast = dash?.forecast || []; const last = dash?.lastIrrigation;
  const daysSince = last ? Math.floor((Date.now() - new Date(last.date).getTime()) / 86400000) : null;
  const WIcon = wmoIcon(weather?.weatherCode);
  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">توصیه آبیاری</h1>
        {farms.length > 1 && <div className="w-44"><Dropdown value={farmId} onChange={v => { const id = String(v); setFarmId(id); setLoading(true); loadFarmData(id); }} options={farms.map((f: any) => ({ value: f.id, label: f.name }))} /></div>}
      </div>
      <p className="text-sm text-gray-500 dark:text-night-muted text-right">{farm.name}{farm.city ? ` — ${[farm.city, farm.province].filter(Boolean).join('، ')}` : ''}</p>

      {rec && (
        <div className={`card p-4 border-2 ${rec.recommend ? 'border-brand-green/50' : 'border-white/10'}`}>
          <div className="flex items-start justify-between gap-3">
            <button onClick={() => rec.recommend && setModalOpen(true)} disabled={!rec.recommend} className="shrink-0 btn-primary !w-auto !px-4 disabled:opacity-40 flex items-center gap-1"><Droplet size={16} />{rec.recommend ? 'ثبت این آبیاری' : 'نیاز نیست'}</button>
            <div className="text-right min-w-0">
              <div className="font-bold text-gray-900 dark:text-white">{rec.recommend ? 'آبیاری توصیه می‌شود' : 'فعلاً آبیاری لازم نیست'}</div>
              <div className="text-xs text-gray-500 dark:text-night-muted mt-1">{rec.reason}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-night-muted justify-end">
                <span>اطمینان {fa(rec.confidence)}٪</span><span>زمان {rec.recommendedAt}</span><span>{methodLabel(rec.method)}</span>
                {rec.recommend && <span>{fa(rec.amount)} مترمکعب · {fa(rec.duration)} دقیقه</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        {weather ? (
          <div className="flex items-center justify-between">
            <div className="text-left"><div className="text-3xl font-extrabold text-gray-900 dark:text-white">{Math.round(weather.temperature)}°</div><div className="text-xs text-gray-500 dark:text-night-muted">{weather.weatherText}</div></div>
            <WIcon size={40} className="text-brand-green" />
            <div className="flex gap-4 text-right text-sm">
              <div><div className="font-bold text-gray-900 dark:text-white">{fa(weather.humidity)}٪</div><div className="text-xs text-gray-500 dark:text-night-muted">رطوبت</div></div>
              <div><div className="font-bold text-gray-900 dark:text-white">{fa(weather.windSpeed)}</div><div className="text-xs text-gray-500 dark:text-night-muted">باد</div></div>
            </div>
          </div>
        ) : (<div className="text-sm text-gray-500 dark:text-night-muted text-right">داده هواشناسی در دسترس نیست. (Open‑Meteo نیاز به کلید ندارد؛ دسترسی خروجی سرور به api.open-meteo.com را بررسی کنید.)</div>)}
      </div>

      {forecast.length > 0 && (
        <div className="card p-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-right mb-3">پیش‌بینی ۶ روزه</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {forecast.slice(0, 6).map((d: any, i: number) => { const I = wmoIcon(d.weatherCode); return (
              <div key={i} className="rounded-xl bg-white/40 dark:bg-white/[0.03] border border-white/10 p-2 text-center">
                <div className="text-[11px] text-gray-500 dark:text-night-muted">{new Date(d.date).toLocaleDateString('fa-IR', { weekday: 'short' })}</div>
                <I size={20} className="mx-auto my-1 text-brand-green" />
                <div className="text-xs font-bold text-gray-900 dark:text-white">{d.tempMax != null ? Math.round(d.tempMax) : '--'}°</div>
                <div className="text-[10px] text-gray-500 dark:text-night-muted">{d.dayPrecipitation != null ? `${fa(d.dayPrecipitation)}٪` : ''}</div>
              </div>); })}
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-night-muted mb-2"><span>سیکل آبیاری</span><span>{daysSince != null ? `${fa(daysSince)} روز پیش` : 'ثبت‌نشده'}</span></div>
        <div className="prog-bg"><div className="prog-fill" style={{ width: `${daysSince != null ? Math.min(100, Math.round((daysSince / 7) * 100)) : 0}%` }} /></div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setModalOpen(true)} className="btn-primary flex-1 flex items-center justify-center gap-1"><Plus size={16} />ثبت آبیاری جدید</button>
        <button onClick={() => router.push('/ai?farm=' + farm.id + '&q=irrigation')} className="btn-outline flex-1 flex items-center justify-center gap-1"><Sparkles size={16} />مشاوره AI</button>
      </div>

      <div className="card p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-right mb-3 flex items-center justify-end gap-1"><History size={16} />تاریخچه آبیاری</h3>
        {history.length === 0 ? (<div className="text-sm text-gray-500 dark:text-night-muted text-center py-4">هنوز هیچ آبیاری ثبت نشده</div>) : (
          <div className="space-y-2">
            {history.map((h: any) => (
              <div key={h.id} className="flex items-center justify-between rounded-xl bg-white/40 dark:bg-white/[0.03] border border-white/10 p-3">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${h.isApplied ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>{h.isApplied ? 'انجام شده' : 'برنامه‌ریزی'}</span>
                <div className="text-right text-sm">
                  <div className="font-bold text-gray-900 dark:text-white">{h.amount != null ? `${fa(h.amount)} مترمکعب` : '—'}{h.duration != null ? ` · ${fa(h.duration)} دقیقه` : ''}</div>
                  <div className="text-xs text-gray-500 dark:text-night-muted">{methodLabel(h.method)} · {new Date(h.appliedAt || h.scheduledAt || h.createdAt).toLocaleDateString('fa-IR')}{h.notes ? ` · ${h.notes}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LogModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createLog} initial={rec?.recommend ? { amount: rec.amount, duration: rec.duration, method: rec.method } : null} />
    </div>
  );
}

export default function IrrigationPage() {
  return <Suspense fallback={<div className="p-6 text-center text-gray-500 dark:text-night-muted"><Loader2 className="animate-spin mx-auto" /></div>}><IrrigationInner /></Suspense>;
}
