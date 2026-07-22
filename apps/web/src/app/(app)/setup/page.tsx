'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { onlyDigits, getJalaliToday, jalaliToGregorian, JALALI_MONTHS } from '@/lib/utils';
import {
  Sprout, Wheat, Loader2, Navigation,
  TreePine, Flower2, ChevronRight, ChevronLeft,
  Trash2, Undo2,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// ── Dynamic Leaflet map (ssr:false) ──
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const PolygonDrawer = dynamic(() => import('./PolygonDrawer'), { ssr: false });
import { computePolygonMetrics } from './PolygonDrawer';
import type { LatLng, PolygonMetrics } from './PolygonDrawer';

// Small wrapper so useSearchParams is consumed inside a Suspense boundary
function EditParam({ onEditId }: { onEditId: (id: string | null) => void }) {
  const searchParams = useSearchParams();
  onEditId(searchParams.get('edit'));
  return null;
}

// We import useSearchParams here to avoid a second dynamic import
import { useSearchParams } from 'next/navigation';

// ── Crop options ──
const CROP_OPTIONS = [
  { value: "wheat", label: "گندم", icon: Wheat },
  { value: "barley", label: "جو", icon: Sprout },
  { value: "rice", label: "برنج", icon: Flower2 },
];

// ── Iranian provinces ──
const PROVINCES = [
  'تهران', 'اصفهان', 'مرکزی', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'مازندران', 'گیلان', 'کرمان', 'یزد', 'سیستان و بلوچستان', 'خوزستان',
  'همدان', 'لرستان', 'قم', 'البرز', 'گلستان', 'بوشهر', 'هرمزگان',
  'کردستان', 'زنجان', 'قزوین', 'سمنان', 'آذربایجان غربی', 'کرمانشاه',
  'کهگیلویه و بویراحمد', 'ایلام', 'چهارمحال و بختیاری', 'خراسان شمالی',
  'خراسان جنوبی', 'اردبیل',
];

export default function SetupPage() {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
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

  /** Convert a Gregorian Date to Jalali year/month/day for prefill. */
  const gregToJalali = (d: Date): { year: number; month: number; day: number } => {
    const gy = d.getFullYear(), gm = d.getMonth() + 1, gd = d.getDate();
    let jy = gy - 621, jm: number, jd = gd;
    if (gm < 3 || (gm === 3 && gd < 21)) { jy--; jm = gm + 9; } else { jm = gm - 3; }
    return { year: jy, month: jm, day: jd };
  };

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
          const j = gregToJalali(new Date(farm.cropDate));
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

  const handleGeolocation = () => {
    setGeoLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFocus([pos.coords.latitude, pos.coords.longitude]);
          setGeoLoading(false);
        },
        () => setGeoLoading(false),
      );
    } else {
      setGeoLoading(false);
    }
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
    <>
      <div className="flex items-center justify-center gap-2 mb-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= s ? 'bg-brand-green w-8' : 'bg-gray-300 dark:bg-night-border w-2'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-night-muted mb-5">
        مرحله {step} از ۳
      </p>
    </>
  );

  return (
    <>
      <Suspense fallback={null}>
        <EditParam onEditId={setEditId} />
      </Suspense>
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
        <>
          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">
              اسم مزرعه *
            </label>
            <input
              placeholder="مثلاً: مزرعه گندم شمالی"
              value={farmName}
              onChange={e => setFarmName(e.target.value)}
              className="input-glass text-right"
              autoFocus
            />
          </div>

          {/* Crop type grid */}
          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-2 block">
              نوع محصول *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CROP_OPTIONS.map((crop) => {
                const Icon = crop.icon;
                const isSelected = cropType === crop.value;
                return (
                  <button
                    key={crop.value}
                    type="button"
                    onClick={() => setCropType(crop.value)}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-brand-green bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-night-border hover:border-brand-green/50'
                    }`}
                  >
                    <Icon className={isSelected ? 'text-brand-green' : 'text-gray-400 dark:text-night-muted'} size={24} />
                    <span className={`text-xs ${isSelected ? 'text-brand-green font-semibold' : 'text-gray-500 dark:text-night-muted'}`}>
                      {crop.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">
              مساحت (هکتار)
            </label>
            <input
              type="tel" inputMode="decimal"
              placeholder="مثلاً: 3.5"
              value={area}
              onChange={e => setArea(onlyDigits(e.target.value.replace('.','')).length > 0 ? e.target.value.replace(/[^\d.]/g,'') : '')}
              className="input-glass text-right"
            />
          </div>

          {error && (
            <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button onClick={() => setStep(2)} disabled={!farmName} className="btn-primary mb-3 flex items-center justify-center gap-2">
            ادامه
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => router.push('/dashboard')} className="btn-outline">
            فعلاً رد می‌کنم
          </button>
        </>
      )}


      {/* ── Step 2: City, Province, Map ── */}
      {step === 2 && (
        <>
          <div className="card shadow-glow">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">
                  شهر *
                </label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="مثل: ساوه"
                  className="input-glass text-right"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">
                  استان *
                </label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="input-glass text-right"
                >
                  <option value="">انتخاب استان</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Map — Polygon boundary drawing */}
          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-2 block">
              محدوده زمین روی نقشه *
            </label>
            <p className="text-[10px] text-gray-400 dark:text-night-muted mb-2">
              روی گوشه‌های زمین ضربه بزن تا محدوده مشخص شود (حداقل ۳ نقطه).
            </p>

            <div className="bg-gray-100 dark:bg-night-surface border border-gray-200 dark:border-night-border rounded-xl overflow-hidden h-64 mb-2">
              {typeof window !== 'undefined' ? (
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
                onClick={handleGeolocation}
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
            <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="btn-outline flex-1 flex items-center justify-center gap-2">
              <ChevronRight size={18} />
              بازگشت
            </button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              ادامه
              <ChevronLeft size={18} />
            </button>
          </div>
        </>
      )}


      {/* ── Step 3: Crop date, soil, irrigation, submit ── */}
      {step === 3 && (
        <>
          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">
              تاریخ کشت (شمسی)
            </label>
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

          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">
              نوع خاک
            </label>
            <select value={soilType} onChange={e => setSoilType(e.target.value)} className="input-glass text-right">
              <option value="">انتخاب کنید</option>
              <option value="رسی">رسی</option><option value="شنی">شنی</option><option value="لومی">لومی</option>
              <option value="سیلتی">سیلتی</option><option value="مخلوط">مخلوط</option>
            </select>
          </div>

          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-1 block">
              روش آبیاری
            </label>
            <select value={irrigationType} onChange={e => setIrrigationType(e.target.value)} className="input-glass text-right">
              <option value="">انتخاب کنید</option>
              <option value="DRIP">قطره‌ای</option><option value="SPRINKLER">بارانی</option>
              <option value="SURFACE">سطحی</option><option value="SUBSURFACE">زیرزمینی</option>
            </select>
          </div>

          {error && (
            <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
              {error}
            </div>
          )}

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
        </>
      )}
    </div>
    </>
  );
}

