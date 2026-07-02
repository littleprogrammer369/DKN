'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onlyDigits, getJalaliToday, jalaliToGregorian, JALALI_MONTHS } from '@/lib/utils';

export default function SetupPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [soilType, setSoilType] = useState('');
  const [irrigationType, setIrrigationType] = useState('');
  const [cropYear, setCropYear] = useState(0);
  const [cropMonth, setCropMonth] = useState(0);
  const [cropDay, setCropDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch('/api/v1/auth/profile', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(r => r.json()).then(u => { if (u.firstName) setUserName(u.firstName); }).catch(() => {});
    const today = getJalaliToday();
    setCropYear(today.year); setCropMonth(today.month); setCropDay(today.day);
  }, []);

  const handleCreate = async () => {
    if (!farmName) return;
    setLoading(true); setError('');
    try {
      const body: any = { name: farmName, city: city || undefined, areaHa: area ? parseFloat(area) : undefined, soilType: soilType || undefined, irrigationType: irrigationType || undefined };
      if (cropYear && cropMonth && cropDay) body.cropDate = jalaliToGregorian(cropYear, cropMonth, cropDay);
      const res = await fetch('/api/v1/farms', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') }, body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'error'); }
      router.push('/dashboard');
    } catch (err: any) { setError(err.message || 'error');
    } finally { setLoading(false); }
  };

  const years = Array.from({ length: 20 }, (_, i) => 1390 + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col px-1">
      <div className="text-center mb-6 mt-4">
        <div className="text-5xl mb-3">🌱</div>
        <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">{userName ? userName + ' عزیز،' : ''} به داده کشت نوین خوش آمدی!</h1>
        <p className="text-sm text-gray-500 dark:text-night-muted mt-2">بیا اولین مزرعه‌ات رو بسازیم</p>
      </div>
      {step === 1 ? (<>
        <div className="card">
          <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">اسم مزرعه *</label>
          <input placeholder="مثلاً: مزرعه گندم شمالی" value={farmName} onChange={e => setFarmName(e.target.value)} className="input-glass text-right" autoFocus />
        </div>
        <div className="card">
          <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">شهر / استان</label>
          <input placeholder="مثلاً: ساوه، مرکزی" value={city} onChange={e => setCity(e.target.value)} className="input-glass text-right" />
        </div>
        <div className="card">
          <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">مساحت (هکتار)</label>
          <input type="tel" inputMode="decimal" placeholder="مثلاً: 3.5" value={area}
            onChange={e => setArea(onlyDigits(e.target.value.replace('.','')).length > 0 ? e.target.value.replace(/[^\d.]/g,'') : '')}
            className="input-glass text-right" />
        </div>
        {error && <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</div>}
        <button onClick={() => setStep(2)} disabled={!farmName} className="btn-primary mb-3">ادامه</button>
        <button onClick={() => router.push('/dashboard')} className="btn-outline">بعداً می‌سازم</button>
      </>) : (<>
        <div className="card">
          <label className="text-xs font-bold text-gray-600 mb-1 block">تاریخ کشت (شمسی)</label>
          <div className="flex gap-2">
            <select value={cropYear} onChange={e => setCropYear(Number(e.target.value))} className="input-glass flex-1 text-center">
              <option value="0">سال</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={cropMonth} onChange={e => setCropMonth(Number(e.target.value))} className="input-glass flex-1 text-center">
              <option value="0">ماه</option>
              {JALALI_MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
            <select value={cropDay} onChange={e => setCropDay(Number(e.target.value))} className="input-glass flex-1 text-center">
              <option value="0">روز</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="card">
          <label className="text-xs font-bold text-gray-600 mb-1 block">نوع خاک</label>
          <select value={soilType} onChange={e => setSoilType(e.target.value)} className="input-glass text-right">
            <option value="">انتخاب کنید</option>
            <option value="رسی">رسی</option><option value="شنی">شنی</option><option value="لومی">لومی</option><option value="سیلتی">سیلتی</option><option value="مخلوط">مخلوط</option>
          </select>
        </div>
        <div className="card">
          <label className="text-xs font-bold text-gray-600 mb-1 block">روش آبیاری</label>
          <select value={irrigationType} onChange={e => setIrrigationType(e.target.value)} className="input-glass text-right">
            <option value="">انتخاب کنید</option>
            <option value="DRIP">قطره‌ای</option><option value="SPRINKLER">بارانی</option><option value="SURFACE">سطحی</option><option value="SUBSURFACE">زیرزمینی</option>
          </select>
        </div>
        {error && <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</div>}
        <div className="flex gap-2">
          <button onClick={() => setStep(1)} className="btn-outline flex-1">بازگشت</button>
          <button onClick={handleCreate} disabled={loading} className="btn-primary flex-1">{loading ? '⏳' : 'ساخت مزرعه'}</button>
        </div>
      </>)}
    </div>
  );
}
