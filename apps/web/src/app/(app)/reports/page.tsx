'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Download, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import Dropdown from '@/components/Dropdown';
import { fa, formatJalali } from '@/lib/jalali';

const H = () => ({ Authorization: 'Bearer ' + (localStorage.getItem('token') || '') });

function ReportsPageInner() {
  const sp = useSearchParams(); const farmParam = sp.get('farm');
  const [farms, setFarms] = useState<any[]>([]);
  const [farmId, setFarmId] = useState('');
  const [report, setReport] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async (id: string) => {
    setLoading(true);
    const [r, l] = await Promise.all([
      fetch(`/api/v1/reports/${id}`, { headers: H() }).then(x => x.ok ? x.json() : null).catch(() => null),
      fetch(`/api/v1/reports/${id}/list`, { headers: H() }).then(x => x.ok ? x.json() : []).catch(() => []),
    ]);
    setReport(r); setList(Array.isArray(l) ? l : []); setLoading(false);
  };
  useEffect(() => {
    fetch('/api/v1/farms', { headers: H() }).then(r => r.json()).then((f: any) => {
      const fl = Array.isArray(f) ? f : []; setFarms(fl);
      setFarmId((farmParam && fl.some((x: any) => x.id === farmParam)) ? farmParam : (fl[0]?.id || ''));
    }).catch(() => setLoading(false));
  }, [farmParam]);
  useEffect(() => { if (farmId) load(farmId); }, [farmId]);

  const generate = async (type: string) => {
    setBusy(type);
    try {
      const res = await fetch(`/api/v1/reports/${farmId}/generate`, { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) });
      if (!res.ok) throw new Error();
      toast.success('گزارش ساخته شد'); load(farmId);
    } catch { toast.error('ساخت گزارش ناموفق بود'); } finally { setBusy(null); }
  };

  if (loading && !report) return <div className="space-y-3 animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-24 rounded-2xl bg-white/5" />)}</div>;

  const r = report || {};
  const recs: string[] = r.recommendations || [];
  const typeFa = (t: string) => (t === 'weekly' ? 'هفتگی' : t === 'monthly' ? 'ماهانه' : 'دستی');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => farmId && load(farmId)} className="w-9 h-9 rounded-xl bg-white/5 dark:bg-night-surface flex items-center justify-center"><FileText size={16} className="text-gray-400" /></button>
        <div className="text-right"><p className="text-base font-extrabold text-gray-900 dark:text-white">گزارش‌ها</p><p className="text-[11px] text-gray-500">گزارش دوره‌ای و PDF</p></div>
      </div>
      {farms.length > 0 && <Dropdown value={farmId} onChange={v => setFarmId(String(v))} options={farms.map((f: any) => ({ value: f.id, label: f.name }))} placeholder="انتخاب مزرعه" />}

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => generate('weekly')} disabled={!!busy} className="card p-3 text-center text-xs font-bold text-gray-900 dark:text-white disabled:opacity-50 flex items-center justify-center gap-1">{busy === 'weekly' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}هفتگی</button>
        <button onClick={() => generate('monthly')} disabled={!!busy} className="card p-3 text-center text-xs font-bold text-gray-900 dark:text-white disabled:opacity-50 flex items-center justify-center gap-1">{busy === 'monthly' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}ماهانه</button>
        <button onClick={() => window.print()} className="card p-3 text-center text-xs font-bold text-brand-green flex items-center justify-center gap-1"><Download size={14} />PDF</button>
      </div>

      <div data-print="report" className="card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="text-[11px] text-gray-400">{formatJalali(new Date().toISOString())}</div>
          <div className="text-right"><div className="text-lg font-extrabold text-gray-900 dark:text-white">گزارش مزرعهٔ {r.farmName || '—'}</div><div className="text-[11px] text-gray-400">دوره: {r.period || '۳۰ روز گذشته'}</div></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          {([['سلامت', r.healthScore != null ? `${fa(r.healthScore)}٪` : '—'], ['NDVI', r.avgNdvi != null ? fa(r.avgNdvi) : '—'], ['آبیاری‌ها', fa(r.totalIrrigations ?? 0)], ['مصرف آب', fa(r.totalWaterUsed ?? 0)], ['تهدید فعال', fa(r.activeThreats ?? 0)]] as any).map(([k, v]: any) => (
            <div key={k} className="rounded-xl bg-white/5 p-3"><div className="text-base font-extrabold text-gray-900 dark:text-white">{v}</div><div className="text-[10px] text-gray-400">{k}</div></div>))}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">توصیه‌ها</div>
          {recs.length ? <ul className="space-y-1">{recs.map((t: string, i: number) => (<li key={i} className="text-xs text-gray-600 dark:text-night-muted flex items-start gap-1.5"><CheckCircle2 size={13} className="text-brand-green mt-0.5 shrink-0" />{t}</li>))}</ul> : <p className="text-xs text-gray-400">توصیه‌ای موجود نیست.</p>}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">گزارش‌های ذخیره‌شده</div>
          {list.length ? <div className="space-y-2">{list.map((x: any) => (<div key={x.id} className="rounded-xl bg-white/5 p-3 flex items-center justify-between"><FileText size={14} className="text-brand-green" /><div className="text-right"><div className="text-xs font-bold text-gray-900 dark:text-white">{typeFa(x.type)}</div><div className="text-[10px] text-gray-400">{formatJalali(x.createdAt)}</div></div></div>))}</div> : <p className="text-xs text-gray-400">هنوز گزارشی ذخیره نشده؛ با دکمه‌های بالا بسازید.</p>}
        </div>
      </div>
    </div>
  );
}
export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="space-y-3 animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-24 rounded-2xl bg-white/5" />)}</div>}>
      <ReportsPageInner />
    </Suspense>
  );
}
