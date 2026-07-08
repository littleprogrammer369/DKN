'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bug, Shield, Upload, Sparkles, AlertTriangle, Camera, Plus } from 'lucide-react';

export default function PestsPage() {
  const router = useRouter();
  const [hasFarm, setHasFarm] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState({ product: '', pestType: '', severity: 'medium', notes: '', image: null as string | null });
  const [reports, setReports] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(async (d) => {
        const has = Array.isArray(d) && d.length > 0;
        setHasFarm(has);
        if (has) {
          try {
            const res = await fetch('/api/v1/weather/' + d[0].id + '/dashboard?city=' + encodeURIComponent(d[0].city || 'Saveh'), {
              headers: { Authorization: 'Bearer ' + token }
            });
            if (res.ok) setWeather(await res.json());
          } catch {}
        }
      }).catch(() => setHasFarm(false));
  }, [router]);

  if (hasFarm === null) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted text-sm">load</p></div>;
  if (!hasFarm) return (
    <div className="text-center mt-12">
      <div className="text-4xl mb-3">plant</div>
      <p className="text-sm text-gray-500 mb-4">Register a farm first</p>
      <button onClick={() => router.push('/setup')} className="btn-primary">Create Farm</button>
    </div>
  );

  const w = weather?.current;
  const tempRisk = w?.temperature > 35 ? 'high' : w?.temperature > 30 ? 'medium' : 'low';
  const humidityRisk = w?.humidity > 60 ? 'high' : w?.humidity > 40 ? 'medium' : 'low';

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-night-muted">پایش هوشمند</p>
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">آفات و بیماری‌ها</h1>
      </div>

      {/* Risk Card */}
      <div className="card dark:bg-night-card/80 mb-4">
        <div className="text-sm font-bold mb-3">وضعیت ریسک</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">ریسک تنش گرمایی</span>
            <span className={"text-xs font-bold px-2 py-0.5 rounded " + (tempRisk === 'high' ? 'bg-red-100 text-red-600' : tempRisk === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600')}>{tempRisk === 'high' ? 'بالا' : tempRisk === 'medium' ? 'متوسط' : 'پایین'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">ریسک قارچی (رطوبت)</span>
            <span className={"text-xs font-bold px-2 py-0.5 rounded " + (humidityRisk === 'high' ? 'bg-red-100 text-red-600' : humidityRisk === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600')}>{humidityRisk === 'high' ? 'بالا' : humidityRisk === 'medium' ? 'متوسط' : 'پایین'}</span>
          </div>
        </div>
      </div>

      {/* Report Form */}
      {showReport && (
        <div className="card mb-4">
          <div className="text-sm font-bold mb-3">گزارش جدید</div>
          <select className="input-glass mb-2" value={reportData.product} onChange={e => setReportData({...reportData, product: e.target.value})}>
            <option value="">انتخاب محصول</option>
            <option>گندم</option><option>جو</option><option>ذرت</option><option>پسته</option>
          </select>
          <select className="input-glass mb-2" value={reportData.pestType} onChange={e => setReportData({...reportData, pestType: e.target.value})}>
            <option value="">انتخاب نوع آفت</option>
            <option>زنگ</option><option>شته</option><option>سفیدک</option><option>سایر</option>
          </select>
          <div className="mb-2">
            <label className="text-xs text-gray-500 dark:text-night-muted mb-1 block">شدت آفت</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[{v:'low',l:'کم',c:'bg-green-500'},{v:'medium',l:'متوسط',c:'bg-amber-500'},{v:'high',l:'شدید',c:'bg-orange-500'},{v:'critical',l:'بحرانی',c:'bg-red-500'}].map(lv => (
                <button key={lv.v} type="button" onClick={() => setReportData({...reportData, severity: lv.v})}
                  className={`p-2 rounded-xl border-2 text-xs transition-all ${reportData.severity === lv.v ? 'border-brand-green bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-night-border'}`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${lv.c} mb-0.5`} /> {lv.l}
                </button>
              ))}
            </div>
          </div>
          <textarea className="input-glass mb-2" placeholder="یادداشت..." value={reportData.notes} onChange={e => setReportData({...reportData, notes: e.target.value})} />
          
          {/* Image upload */}
          <div className="mb-2">
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-night-muted cursor-pointer bg-gray-50 dark:bg-night-surface rounded-lg px-3 py-2 border border-dashed border-gray-300 dark:border-night-border">
              <span>{imagePreview ? '✅' : '📷'}</span>
              <span>{imagePreview ? 'عکس انتخاب شد' : 'آپلود عکس از آفت'}</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      setImagePreview(dataUrl);
                      setReportData({...reportData, image: dataUrl});
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
            </label>
            {imagePreview && (
              <div className="relative mt-2">
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                <button onClick={() => { setImagePreview(null); setReportData({...reportData, image: null}); }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={() => { setReports([{...reportData, date: new Date()} as never, ...reports]); setShowReport(false); }}>ثبت</button>
            <button className="btn-outline" onClick={() => setShowReport(false)}>انصراف</button>
          </div>
        </div>
      )}

      {/* My Reports */}
      <div className="section-title">گزارش‌های من</div>
      <div className="card">
        {reports.length > 0 ? reports.map((r, i) => (
          <div key={i} className="text-xs py-2 border-b last:border-0">{r.product} - {r.pestType}</div>
        )) : (
          <p className="text-xs text-gray-400 text-center py-4">هنوز گزارشی ثبت نشده</p>
        )}
      </div>

      <button onClick={() => setShowReport(true)} className="btn-primary mt-3 flex items-center justify-center gap-1">
        <Plus size={16} /> گزارش جدید
      </button>
    </>
  );
}
