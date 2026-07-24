'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getJalaliToday, jalaliToGregorian, JALALI_MONTHS } from '@/lib/utils';
import { CROPS } from '@/lib/crops';
import {
  Sprout, Wheat, Loader2, Navigation, LocateFixed,
  ChevronRight, ChevronLeft,
  Trash2, Undo2,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import Dropdown from '@/components/Dropdown';
import { toast } from '@/lib/toast';
import { gregorianToJalaliParts } from '@/lib/jalali';

// ── Dynamic Leaflet map (ssr:false) ──
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const PolygonDrawer = dynamic(() => import('./PolygonDrawer'), { ssr: false });
import { computePolygonMetrics } from './PolygonDrawer';
import type { LatLng, PolygonMetrics } from './PolygonDrawer';

// ── Iranian provinces ──
const PROVINCES = [
  'تهران', 'اصفهان', 'مرکزی', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'مازندران', 'گیلان', 'کرمان', 'یزد', 'سیستان و بلوچستان', 'خوزستان',
  'همدان', 'لرستان', 'قم', 'البرز', 'گلستان', 'بوشهر', 'هرمزگان',
  'کردستان', 'زنجان', 'قزوین', 'سمنان', 'آذربایجان غربی', 'کرمانشاه',
  'کهگیلویه و بویراحمد', 'ایلام', 'چهارمحال و بختیاری', 'خراسان شمالی',
  'خراسان جنوبی', 'اردبیل',
];

const SOIL_OPTIONS = [
  { value: 'رسی', label: 'رسی' }, { value: 'لومی', label: 'لومی' },
  { value: 'سیلتی', label: 'سیلتی' }, { value: 'مخلوط', label: 'مخلوط' },
];
const IRR_OPTIONS = [
  { value: 'DRIP', label: 'قطره‌ای' }, { value: 'SPRINKLER', label: 'بارانی' },
  { value: 'SURFACE', label: 'سطحی' }, { value: 'SUBSURFACE', label: 'زیرزمینی' },
];

function SetupPageInner() {
  const router = useRouter();
  const editId = useSearchParams().get('edit');
  const [userName, setUserName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [cropType, setCropType] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [area, setArea] = useState('');
  const [soilType, setSoilType] = useState('');
  const [irrigationType, setIrrigationType] = useState('');
  const [cropYear, setCropYear] = useState(0);
  const [cropMonth, setCropMonth] = useState(0);
  const [cropDay, setCropDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [geoLoading, setGeoLoading] = useState(false);
  const [boundary, setBoundary] = useState<LatLng[]>([]);
  const [hectares, setHectares] = useState(0);
  const [center, setCenter] = useState<LatLng | null>(null);
  const [focus, setFocus] = useState<LatLng | null>(null);
  const [editing, setEditing] = useState(false);

  const handleBoundaryChange = (pts: LatLng[], m: PolygonMetrics) => {
    setBoundary(pts);
    setHectares(m.hectares);
    setCenter(m.center);
    if (pts.length >= 3) setArea(m.hectares.toFixed(2));
  };
  const undoPoint = () => {
    const next = boundary.slice(0, -1);
    const m = computePolygonMetrics(next);
    setBoundary(next);
    setHectares(m.hectares);
    setCenter(m.center);
    if (next.length >= 3) setArea(m.hectares.toFixed(2));
  };
  const clearBoundary = () => { setBoundary([]); setHectares(0); setCenter(null); };

  useEffect(() => {
    fetch('/api/v1/auth/profile', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(r => r.json()).then(u => { if (u.firstName) setUserName(u.firstName); }).catch(() => {});
    const today = getJalaliToday();
    setCropYear(today.year); setCropMonth(today.month); setCropDay(today.day);
  }, []);

  // Load existing farm for editing
  useEffect(() => {
    if (!editId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    fetch('/api/v1/farms/' + editId, { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then((farm: any) => {
        if (!farm || farm.error) return;
        setEditing(true);
        setFarmName(farm.name || '');
        setCity(farm.city || '');
        setProvince(farm.province || '');
        setArea(farm.areaHa ? String(farm.areaHa) : '');
        setSoilType(farm.soilType || '');
        setIrrigationType(farm.irrigationType || '');
        setCropType(farm.product || '');
        if (farm.cropDate) {
          const j = gregorianToJalaliParts(farm.cropDate);
          setCropYear(j.year); setCropMonth(j.month); setCropDay(j.day);
        }
        const pts: LatLng[] = (farm.boundary || []).map((p: any) => [p[0], p[1]]);
        setBoundary(pts);
        if (pts.length >= 3) {
          const m = computePolygonMetrics(pts);
          setHectares(m.hectares);
          setCenter(m.center);
          setFocus(m.center);
        } else if (farm.lat != null && farm.lng != null) {
          setCenter([farm.lat, farm.lng]);
          setFocus([farm.lat, farm.lng]);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [editId]);

  // Fix Leaflet default icon for bundlers
  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    });
  }, []);

  const locate = () => {
    setGeoLoading(true);
    if (!navigator.geolocation) { toast.error('مرورگر از موقعیت‌یاب پشتیبانی نمی‌کند.'); setGeoLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setFocus([pos.coords.latitude, pos.coords.longitude]); toast.success('موقعیت شما روی نقشه اعمال شد 📍'); setGeoLoading(false); },
      () => { toast.error('دسترسی به موقعیت مکانی داده نشد.'); setGeoLoading(false); },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleCreate = async () => {
    if (!farmName) return;
    setLoading(true); setError('');
    try {
      const body: any = {
        name: farmName,
        city: city || undefined,
        areaHa: area ? parseFloat(area) : undefined,
        soilType: soilType || undefined,
        irrigationType: irrigationType || undefined,
      };
      if (cropYear && cropMonth && cropDay) body.cropDate = jalaliToGregorian(cropYear, cropMonth, cropDay);
      if (province) body.province = province;
      if (cropType) body.cropType = cropType;
      if (center) { body.lat = center[0]; body.lng = center[1]; }
      if (boundary.length >= 3) { body.boundary = boundary; }
      if (hectares > 0) { body.areaHa = Number(hectares.toFixed(2)); }
      const url = editing ? '/api/v1/farms/' + editId : '/api/v1/farms';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') }, body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'error'); }
      router.push(editing ? '/farms/' + editId : '/dashboard');
    } catch (err: any) { setError(err.message || 'error');
    } finally { setLoading(false); }
  };

  const years = Array.from({ length: 20 }, (_, i) => 1390 + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const Stepper = () => (
    <div className="mb-5">
      <div className="flex items-center justify-center">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step > s ? 'bg-brand-green text-white'
              : step === s ? 'bg-brand-green text-white ring-4 ring-brand-green/20 scale-110'
              : 'bg-white/10 text-gray-400 dark:text-night-muted border border-white/10'
            }`}>
              {step > s ? '✓' : s}
            </div>
            {i < 2 && (
              <div className={`w-10 h-0.5 mx-1 rounded ${step > s ? 'bg-brand-green' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-night-muted mt-2">
        مرحله {step} از 3
      </p>
    </div>
  );

  return (
    <>
      <div className="flex flex-col px-1">
      {/* ── Welcome header ── */}
      <div className="text-center mb-4 mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 mb-3">
          <Sprout size={32} className="text-brand-green" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">
          {editing ? 'ویرایش مزرعه' : (userName || 'کشاورز عزیز') + '، به داده کشت نوین خوش آمدی!'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-night-muted mt-2">
          {editing ? 'مشخصات مزرعه را ویرایش کن' : 'بیا اولین مزرعه‌ات رو بسازیم'}
        </p>
      </div>

      {/* ── Stepper ── */}
      <Stepper />


      {/* ── Step 1: Farm name, crop type, area ── */}
      {step === 1 && (
        <div className="card p-5 space-y-5">
          {/* Farm name */}
          <div>
            <label className="flex items-center justify-end gap-1 text-sm font-bold text-gray-700 dark:text-night-text mb-2">
              اسم مزرعه <span className="text-red-500">*</span>
            </label>
            <input
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="مثلاً: مزرعه گندم شمالی"
              className="input-glass text-right"
              autoFocus
            />
          </div>

          {/* Crop type — single row of 3 */}
          <div>
            <label className="flex items-center justify-end gap-1 text-sm font-bold text-gray-700 dark:text-night-text mb-2">
              نوع محصول <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CROPS.map((crop) => {
                const Icon = crop.icon;
                const sel = cropType === crop.value;
                return (
                  <button
                    key={crop.value}
                    type="button"
                    onClick={() => setCropType(crop.value)}
                    className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                      sel
                        ? 'border-brand-green bg-brand-green/10 shadow-glow'
                        : 'border-white/10 bg-white/40 dark:bg-white/[0.03] hover:border-brand-green/50'
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${sel ? 'bg-brand-green text-white' : 'bg-brand-green/10 text-brand-green'}`}>
                      <Icon size={20} />
                    </span>
                    <span className={`text-xs font-bold ${sel ? 'text-brand-green' : 'text-gray-600 dark:text-night-text'}`}>{crop.label}</span>
                    {sel && (
                      <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px]">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-night-text mb-2 text-right">مساحت (هکتار)</label>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="مثلاً: 3.5"
              className="input-glass text-right"
              inputMode="decimal"
            />
            <p className="text-[11px] text-gray-400 dark:text-night-muted mt-1.5 text-right">
              اختیاری — مرحله بعد می‌تونی محدوده زمین رو روی نقشه بکشی تا خودکار محاسبه بشه.
            </p>
          </div>

          {error && <div className="text-sm text-red-500 text-right">{error}</div>}

          <button onClick={() => setStep(2)} disabled={!farmName}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
            ادامه <ChevronLeft size={16} />
          </button>
          <button onClick={() => router.push('/dashboard')} className="btn-outline">فعلاً رد می‌کنم</button>
        </div>
      )}


      {/* ── Step 2: City, Province, Map ── */}
      {step === 2 && (
        <div className="card p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-night-text mb-2 text-right">شهر <span className="text-red-500">*</span></label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="مثل: ساوه"
                className="input-glass text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-night-text mb-2 text-right">استان <span className="text-red-500">*</span></label>
              <Dropdown value={province || ''} onChange={(v) => setProvince(String(v))} placeholder="انتخاب استان"
                options={PROVINCES.map(p => ({ value: p, label: p }))} />
            </div>
          </div>

          {/* Map — Polygon boundary drawing */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-night-text mb-2">
              محدوده زمین روی نقشه <span className="text-red-500">*</span>
            </label>
            <p className="text-[10px] text-gray-400 dark:text-night-muted mb-2">
              روی گوشه‌های زمین ضربه بزن تا محدوده مشخص شود (حداقل ۳ نقطه).
            </p>

            <div className="relative bg-gray-100 dark:bg-night-surface border border-gray-200 dark:border-night-border rounded-xl overflow-hidden h-64 mb-2">
              {typeof window !== 'undefined' ? (
                <>
                  <button type="button" onClick={(e) => { e.stopPropagation(); locate(); }}
                    className="absolute top-2 right-2 z-[1100] w-9 h-9 rounded-lg bg-white dark:bg-night-card shadow-md border border-gray-200 dark:border-night-border text-brand-green flex items-center justify-center hover:scale-105 transition-transform"
                    aria-label="موقعیت من">
                    {geoLoading ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
                  </button>
                  <MapContainer
                  center={[32.4279, 53.6880]}
                  zoom={5}
                  className="w-full h-full z-0"
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <PolygonDrawer
                    points={boundary}
                    onChange={handleBoundaryChange}
                    focus={focus}
                  />
                </MapContainer>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-night-muted text-sm">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                type="button"
                onClick={undoPoint}
                disabled={boundary.length === 0}
                className="btn-outline !py-1.5 !px-3 !text-xs flex items-center gap-1 disabled:opacity-40"
              >
                <Undo2 size={14} />
                حذف نقطه
              </button>
              <button
                type="button"
                onClick={clearBoundary}
                disabled={boundary.length === 0}
                className="btn-outline !py-1.5 !px-3 !text-xs flex items-center gap-1 text-red-500 border-red-200 dark:border-red-800 disabled:opacity-40"
              >
                <Trash2 size={14} />
                پاک کردن
              </button>
              <button
                type="button"
                onClick={locate}
                disabled={geoLoading}
                className="btn-outline !py-1.5 !px-3 !text-xs flex items-center gap-1"
              >
                {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                مکان من
              </button>
            </div>

            {/* Live area badge */}
            {boundary.length >= 3 && (
              <div className="text-center mb-2">
                <div className="inline-block bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2 text-xs">
                  <span className="font-bold text-brand-green">
                    مساحت محاسبه‌شده: {hectares.toLocaleString('fa-IR', { maximumFractionDigits: 2 })} هکتار
                  </span>
                  <br />
                  <span className="text-gray-500 dark:text-night-muted">
                    {boundary.length} نقطه
                    {center ? ` | مرکز: ${center[0].toFixed(4)}, ${center[1].toFixed(4)}` : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Hint when not enough points */}
            {boundary.length > 0 && boundary.length < 3 && (
              <p className="text-[10px] text-amber-500 dark:text-amber-400 text-center mb-2">
                برای محاسبه مساحت، حداقل ۳ نقطه لازم است.
              </p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center mb-3">{error}</div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="btn-outline flex-1 flex items-center justify-center gap-2">
              <ChevronRight size={18} />
              بازگشت
            </button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              ادامه <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      )}


      {/* ── Step 3: Crop date, soil, irrigation, submit ── */}
      {step === 3 && (
        <div className="card p-5 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-night-text mb-2 text-right">تاریخ کشت</label>
            <div className="flex gap-2" dir="ltr">
              <div className="flex-1">
                <Dropdown value={cropYear || ''} onChange={(v) => setCropYear(Number(v))} placeholder="سال"
                  options={years.map(y => ({ value: y, label: String(y) }))} />
              </div>
              <div className="flex-1">
                <Dropdown value={cropMonth || ''} onChange={(v) => setCropMonth(Number(v))} placeholder="ماه"
                  options={JALALI_MONTHS.map((m, i) => ({ value: i + 1, label: m }))} />
              </div>
              <div className="flex-1">
                <Dropdown value={cropDay || ''} onChange={(v) => setCropDay(Number(v))} placeholder="روز"
                  options={days.map(d => ({ value: d, label: String(d) }))} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-night-text mb-2 text-right">نوع خاک</label>
            <Dropdown value={soilType || ''} onChange={(v) => setSoilType(String(v))} placeholder="انتخاب کنید" options={SOIL_OPTIONS} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-night-text mb-2 text-right">روش آبیاری</label>
            <Dropdown value={irrigationType || ''} onChange={(v) => setIrrigationType(String(v))} placeholder="انتخاب کنید" options={IRR_OPTIONS} />
          </div>

          {error && <div className="text-sm text-red-500 text-center mb-3">{error}</div>}

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="btn-outline flex-1 flex items-center justify-center gap-2">
              <ChevronRight size={18} />
              بازگشت
            </button>
            <button onClick={handleCreate} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sprout size={18} />}
              {loading ? (editing ? 'در حال ذخیره...' : 'در حال ساخت...') : (editing ? 'ذخیره تغییرات' : 'ساخت مزرعه')}
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}


export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupPageInner />
    </Suspense>
  );
}
