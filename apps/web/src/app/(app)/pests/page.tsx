'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Bug, Shield, Upload, Sparkles, AlertTriangle, Camera, Plus, X, Eye, Pencil, Trash2, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Dropdown from '@/components/Dropdown';
import { toast } from '@/lib/toast';
import { cropLabel } from '@/lib/crops';
import { PEST_CATALOG, CATEGORIES, SEV, RISK, pestsForCrop, type Sev, type Pest } from '@/lib/pests';

const H = () => ({ Authorization: 'Bearer ' + (localStorage.getItem('token') || '') });
const faDate = (s?: string | null) => s ? new Date(s).toLocaleDateString('fa-IR') : '—';
function downscale(dataUrl: string, max = 1024, q = 0.7): Promise<string> {
  return new Promise((res) => { const img = new Image(); img.onload = () => { const r = Math.min(1, max / Math.max(img.width, img.height)); const w = Math.round(img.width * r), h = Math.round(img.height * r); const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d')!.drawImage(img, 0, 0, w, h); res(c.toDataURL('image/jpeg', q)); }; img.src = dataUrl; });
}

const emptyForm = () => ({ pestName: '', category: 'سایر', severity: 'MEDIUM' as Sev, description: '', chemical: '', image: null as string | null, probability: null as number | null });

export default function PestsPage() { return <Suspense fallback={<div className="p-6 text-center text-gray-500"><Loader2 className="animate-spin mx-auto" /></div>}><PestsInner /></Suspense>; }

function PestsInner() {
  const router = useRouter();
  const sp = useSearchParams(); const farmParam = sp.get('farm');
  const [farms, setFarms] = useState<any[]>([]);
  const [farmId, setFarmId] = useState('ALL');
  const [assessment, setAssessment] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [current, setCurrent] = useState<any>(null);
  const [form, setForm] = useState(emptyForm());
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: H() }).then(r => r.json()).then((d) => {
      const fl = Array.isArray(d) ? d : []; setFarms(fl);
      setFarmId((farmParam && fl.some((f) => f.id === farmParam)) ? farmParam : (fl[0]?.id || 'ALL'));
    }).catch(() => {});
  }, [router, farmParam]);

  const load = (id: string) => {
    setLoading(true);
    if (id === 'ALL') {
      fetch('/api/v1/pests/all', { headers: H() }).then(r => r.json()).then((d) => { setReports(Array.isArray(d) ? d : []); setAssessment(null); setLoading(false); }).catch(() => setLoading(false));
    } else {
      Promise.all([
        fetch('/api/v1/pests/assessment/' + id, { headers: H() }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/v1/pests/farm/' + id, { headers: H() }).then(r => r.ok ? r.json() : []).catch(() => []),
      ]).then(([a, list]) => { setAssessment(a); setReports(Array.isArray(list) ? list : []); setLoading(false); });
    }
  };
  useEffect(() => { if (farms.length || farmId === 'ALL') load(farmId); }, [farmId, farms.length]);

  const farm = farms.find((f) => f.id === farmId);
  const crop = farm?.product;
  const byCat = pestsForCrop(crop);

  const openCreate = (preset?: Partial<Pest & { severity?: Sev }>) => {
    setMode('create'); setCurrent(null);
    setForm({ ...emptyForm(), ...(preset ? { pestName: preset.name || '', category: preset.category || 'سایر', severity: preset.sev || preset.severity || 'MEDIUM', chemical: preset.chemical || '', description: preset.treatment ? 'درمان پیشنهادی: ' + preset.treatment : '' } : {}) });
    setPreview(null);
  };
  const openEdit = (r: any) => { setMode('edit'); setCurrent(r); setForm({ pestName: r.pestName, category: r.pestType || 'سایر', severity: r.severity || 'MEDIUM', description: r.description || '', chemical: r.chemical || '', image: r.image || null, probability: r.probability ?? null }); setPreview(r.image || null); };
  const openView = (r: any) => { setMode('view'); setCurrent(r); };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => { const ds = await downscale(String(ev.target?.result)); setPreview(ds); setForm((p) => ({ ...p, image: ds })); };
    reader.readAsDataURL(f);
  };
  const runDetect = async () => {
    if (!preview) return; setDetecting(true);
    try {
      const res = await fetch('/api/v1/pests/detect', { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json' }, body: JSON.stringify({ image: preview, mimeType: 'image/jpeg', farmId: farmId !== 'ALL' ? farmId : undefined }) });
      const d = await res.json();
      if (!d) { toast.error('تشخیص هوشمند در دسترس نیست (کلید/اتصال Gemini را بررسی کنید).'); }
      else { setForm((p) => ({ ...p, pestName: d.pestName || p.pestName, category: d.category || p.category, severity: d.severity || p.severity, description: d.description || p.description, chemical: d.chemical || p.chemical, probability: d.confidence ?? p.probability })); toast.success('تشخیص AI: ' + (d.pestName || 'نامشخص') + ' (' + (d.confidence ?? 0) + '٪)'); }
    } catch { toast.error('خطا در تشخیص هوشمند.'); }
    finally { setDetecting(false); }
  };

  const submit = async () => {
    if (!form.pestName.trim()) { toast.error('نام آفت/بیماری را وارد کنید.'); return; }
    if (farmId === 'ALL' && mode === 'create') { toast.error('برای ثبت گزارش یک مزرعه را انتخاب کنید.'); return; }
    setBusy(true);
    try {
      const body = { pestName: form.pestName.trim(), category: form.category, severity: form.severity, description: form.description || undefined, chemical: form.chemical || undefined, image: form.image || undefined, probability: form.probability ?? undefined };
      const url = mode === 'edit' ? '/api/v1/pests/farm/' + current.farmId + '/' + current.id : '/api/v1/pests/farm/' + farmId;
      const res = await fetch(url, { method: mode === 'edit' ? 'PATCH' : 'POST', headers: { ...H(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || 'خطا');
      toast.success(mode === 'edit' ? 'گزارش ویرایش شد' : 'گزارش ثبت شد');
      setMode(null); load(farmId);
    } catch (e: any) { toast.error(e?.message || 'ثبت ناموفق بود.'); }
    finally { setBusy(false); }
  };
  const del = async (r: any) => {
    if (!confirm('این گزارش حذف شود؟')) return;
    try { await fetch('/api/v1/pests/farm/' + r.farmId + '/' + r.id, { method: 'DELETE', headers: H() }); toast.success('حذف شد'); load(farmId); } catch { toast.error('حذف ناموفق بود.'); }
  };

  const likely = (() => {
    if (!crop || !assessment) return [];
    const set = new Set(); const out = [];
    const wantCats = new Set();
    if (assessment.fungal?.level !== 'low' && assessment.fungal?.level !== 'unknown') wantCats.add('قارچ و بیماری');
    if (assessment.heat?.level !== 'low' && assessment.heat?.level !== 'unknown') wantCats.add('حشرات');
    if (wantCats.size === 0) { wantCats.add('قارچ و بیماری'); wantCats.add('حشرات'); }
    for (const p of PEST_CATALOG) if (p.crops.includes(crop) && wantCats.has(p.category) && !set.has(p.name)) { set.add(p.name); out.push(p); }
    return out.slice(0, 6);
  })();

  const grouped = (() => { const m: Record<string, any[]> = {}; for (const r of reports) { const k = r.farm?.name || 'نامشخص'; (m[k] ||= []).push(r); } return m; })();

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-green" /></div>;

  const Modal = mode ? createPortal((
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/60" onClick={() => setMode(null)}>
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4 my-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <button onClick={() => setMode(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white/70"><X size={18} /></button>
          <h3 className="font-extrabold text-gray-900 dark:text-white">{mode === 'view' ? 'مشاهده گزارش' : mode === 'edit' ? 'ویرایش گزارش' : 'گزارش جدید'}</h3>
        </div>

        {mode !== 'view' && (
          <>
            <div>
              <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-night-muted cursor-pointer bg-white/5 rounded-lg px-3 py-2 border border-dashed border-white/15">
                {preview ? <CheckCircle2 size={14} className="text-green-500" /> : <Camera size={14} />}
                <span>{preview ? 'عکس انتخاب شد — برای تغییر کلیک کنید' : 'آپلود/عکس از آفت'}</span>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
              </label>
              {preview && <div className="relative mt-2"><img src={preview} alt="" className="w-full h-40 object-cover rounded-lg" /><button onClick={() => { setPreview(null); setForm((p) => ({ ...p, image: null })); }} className="absolute top-1 left-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={12} /></button></div>}
              <button type="button" onClick={runDetect} disabled={!preview || detecting} className="btn-outline w-full mt-2 flex items-center justify-center gap-1 disabled:opacity-40">{detecting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}تشخیص هوشمند با عکس</button>
              {form.probability != null && <p className="text-[11px] text-brand-green mt-1 text-right">اطمینان تشخیص: {form.probability}٪</p>}
            </div>

            <div>
              <div className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">نوع آفت/بیماری (بر اساس {crop ? cropLabel(crop) : 'محصول'})</div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => {
                  const items = byCat[cat];
                  if (!items?.length) return null;
                  return (
                    <div key={cat} className="rounded-xl bg-white/5 p-2">
                      <div className="text-[11px] font-bold text-brand-green mb-1">{cat}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((p) => {
                          const sel = form.pestName === p.name && form.category === cat;
                          return (
                            <button key={p.name} type="button" onClick={() => setForm((f) => ({ ...f, pestName: p.name, category: cat, chemical: f.chemical || p.chemical || '', description: f.description || ('درمان پیشنهادی: ' + p.treatment), severity: f.severity === 'MEDIUM' && p.sev ? p.sev : f.severity }))}
                              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${sel ? 'border-brand-green bg-brand-green/15 text-brand-green font-bold' : 'border-white/10 text-gray-500 dark:text-night-muted hover:border-brand-green/50'}`}>{p.name}</button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <input value={form.pestName} onChange={(e) => setForm((p) => ({ ...p, pestName: e.target.value, category: p.category === 'سایر' ? 'سایر' : p.category }))} placeholder="یا نام آفت/بیماری را دستی بنویسید…" className="input-glass text-right mt-2" />
            </div>

            <div>
              <div className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">شدت</div>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(SEV)).map((s) => (
                  <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, severity: s as Sev }))} className={`p-2 rounded-xl border-2 text-xs transition-all flex flex-col items-center gap-1 ${form.severity === s ? 'border-brand-green bg-white/10' : 'border-white/10'}`}>
                    <span className={`w-2 h-2 rounded-full ${SEV[s as Sev].dot}`} />{SEV[s as Sev].l}
                  </button>
                ))}
              </div>
            </div>
            <div><div className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">سم / روش درمان</div><input value={form.chemical} onChange={(e) => setForm((p) => ({ ...p, chemical: e.target.value }))} className="input-glass text-right" placeholder="مثلاً تیبوکونازول" /></div>
            <div><div className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 text-right">توضیحات</div><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-glass text-right" rows={2} placeholder="علائم مشاهده‌شده…" /></div>
            <button onClick={submit} disabled={busy} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">{busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}{mode === 'edit' ? 'ذخیره تغییرات' : 'ثبت گزارش'}</button>
          </>
        )}

        {mode === 'view' && current && (
          <div className="space-y-3 text-sm">
            {current.image && <img src={current.image} alt="" className="w-full h-44 object-cover rounded-xl" />}
            <Row k="آفت/بیماری" v={current.pestName} />
            <Row k="دسته" v={current.pestType} />
            <Row k="شدت" v={<span className={`text-[11px] px-2 py-0.5 rounded-full ${SEV[current.severity as Sev]?.cls}`}>{SEV[current.severity as Sev]?.l || current.severity}</span>} />
            <Row k="مزرعه" v={current.farm?.name || farm?.name || '—'} />
            <Row k="تاریخ" v={faDate(current.detectedAt)} />
            {current.probability != null && <Row k="اطمینان تشخیص" v={`${current.probability}٪`} />}
            {current.chemical && <Row k="سم/درمان" v={current.chemical} />}
            {current.description && <Row k="توضیحات" v={current.description} />}
          </div>
        )}
      </div>
    </div>
  ), document.body) : null;

  return (
    <div className="space-y-4 pb-2">
      <div className="text-right"><p className="text-xs text-gray-500 dark:text-night-muted">پایش هوشمند</p><h1 className="text-lg font-extrabold text-gray-900 dark:text-white">آفات و بیماری‌ها</h1></div>

      <Dropdown value={farmId} onChange={(v) => setFarmId(String(v))} options={[{ value: 'ALL', label: 'همه مزارع' }, ...farms.map((f) => ({ value: f.id, label: f.name }))]} placeholder="انتخاب مزرعه" />

      {assessment && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-end gap-1 font-bold text-gray-900 dark:text-white mb-3"><Shield size={16} className="text-brand-green" />وضعیت ریسک</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${RISK[assessment.heat.level as keyof typeof RISK].cls}`}>{RISK[assessment.heat.level as keyof typeof RISK].l}</span><span className="text-gray-600 dark:text-night-muted text-right">ریسک تنش گرمایی</span></div>
              <div className="text-[11px] text-gray-400 text-right">{assessment.heat.reason}</div>
              <div className="flex items-center justify-between"><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${RISK[assessment.fungal.level as keyof typeof RISK].cls}`}>{RISK[assessment.fungal.level as keyof typeof RISK].l}</span><span className="text-gray-600 dark:text-night-muted text-right">ریسک قارچی (رطوبت)</span></div>
              <div className="text-[11px] text-gray-400 text-right">{assessment.fungal.reason}</div>
            </div>
          </div>
          <div className="space-y-2">
            {assessment.alerts?.length ? assessment.alerts.map((a: any, i: number) => (
              <div key={i} className={`card p-3 border-2 ${a.severity === 'danger' ? 'border-red-500/40' : a.severity === 'warning' ? 'border-amber-500/40' : 'border-white/10'}`}>
                <div className="flex items-center justify-end gap-1 font-bold text-sm text-gray-900 dark:text-white">{a.title}{a.severity === 'danger' ? <AlertTriangle size={15} className="text-red-500" /> : <AlertCircle size={15} className="text-amber-500" />}</div>
                <div className="text-xs text-gray-500 dark:text-night-muted text-right mt-1">{a.body}</div>
              </div>
            )) : (
              <div className="card p-3 text-xs text-green-600 dark:text-green-400 text-right flex items-center justify-end gap-1">هشدار فعالی نیست — وضعیت پایدار است ✅</div>
            )}
          </div>
          {likely.length > 0 && (
            <div className="card p-3">
              <div className="text-xs font-bold text-gray-600 dark:text-night-muted mb-2 text-right">در این شرایط مراقب این‌ها باشید</div>
              <div className="flex flex-wrap gap-1.5 justify-end">{likely.map((p) => (
                <button key={p.name} onClick={() => openCreate(p)} className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-500 dark:text-night-muted hover:border-brand-green/50">{p.name}</button>
              ))}</div>
            </div>
          )}
        </>
      )}

      <div className="text-right text-sm font-bold text-gray-900 dark:text-white">گزارش‌ها{farmId === 'ALL' ? ' (همه مزارع)' : ''}</div>
      {reports.length === 0 ? (
        <div className="card p-6 text-center"><ImageIcon size={26} className="mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500 dark:text-night-muted">هنوز گزارشی ثبت نشده</p></div>
      ) : (
        <>
          {farmId === 'ALL' ? (
            Object.entries(grouped).map(([name, list]) => (
              <div key={name}>
                <div className="text-xs font-bold text-brand-green my-2 text-right">{name}</div>
                <div className="space-y-2">{list.map((r) => <ReportCard key={r.id} r={r} onEdit={openEdit} onView={openView} onDel={del} />)}</div>
              </div>
            ))
          ) : (
            <div className="space-y-2">{reports.map((r) => <ReportCard key={r.id} r={r} onEdit={openEdit} onView={openView} onDel={del} />)}</div>
          )}
        </>
      )}

      <button onClick={() => openCreate()} disabled={farmId === 'ALL'} className="btn-primary mt-2 flex items-center justify-center gap-1 disabled:opacity-50"><Plus size={16} />گزارش جدید</button>
      {Modal}
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) { return (<div className="flex items-center justify-between gap-2"><div className="text-gray-900 dark:text-white text-right">{v}</div><div className="text-xs text-gray-500 dark:text-night-muted shrink-0">{k}</div></div>); }

function ReportCard({ r, onEdit, onView, onDel }: { r: any; onEdit: (r: any) => void; onView: (r: any) => void; onDel: (r: any) => void }) {
  return (
    <div className="card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-1">
          <button onClick={() => onView(r)} title="مشاهده" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-brand-green flex items-center justify-center"><Eye size={15} /></button>
          <button onClick={() => onEdit(r)} title="ویرایش" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center"><Pencil size={15} /></button>
          <button onClick={() => onDel(r)} title="حذف" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/15 text-red-400 flex items-center justify-center"><Trash2 size={15} /></button>
        </div>
        <div className="text-right min-w-0">
          <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{r.pestName}</div>
          <div className="flex flex-wrap gap-1 mt-1 justify-end">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{r.pestType}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${SEV[r.severity as Sev]?.cls}`}>{SEV[r.severity as Sev]?.l || r.severity}</span>
            {r.farm?.product && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green">{cropLabel(r.farm.product)}</span>}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">{faDate(r.detectedAt)}</div>
        </div>
      </div>
    </div>
  );
}
