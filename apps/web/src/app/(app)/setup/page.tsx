'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { onlyDigits, getJalaliToday, jalaliToGregorian, JALALI_MONTHS } from '@/lib/utils';
import {
  Sprout, Wheat, MapPin, Loader2, Navigation,
  TreePine, Flower2, ChevronRight, ChevronLeft,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// ── Dynamic Leaflet map (ssr:false) ──
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const MapClickHandler = dynamic(() => import('./MapClickHandler'), { ssr: false });

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
  const [userName, setUserName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [cropType, setCropType] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [area, setArea] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [soilType, setSoilType] = useState('');
  const [irrigationType, setIrrigationType] = useState('');
  const [cropYear, setCropYear] = useState(0);
  const [cropMonth, setCropMonth] = useState(0);
  const [cropDay, setCropDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/profile', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(r => r.json()).then(u => { if (u.firstName) setUserName(u.firstName); }).catch(() => {});
    const today = getJalaliToday();
    setCropYear(today.year); setCropMonth(today.month); setCropDay(today.day);
  }, []);

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
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
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
      if (lat !== null && lng !== null) { body.lat = lat; body.lng = lng; }
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
    <div className="flex flex-col px-1">
      {/* ── Welcome header ── */}
      <div className="text-center mb-4 mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 mb-3">
          <Sprout size={32} className="text-brand-green" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">
          {userName || 'کشاورز عزیز'}، به داده کشت نوین خوش آمدی!
        </h1>
        <p className="text-sm text-gray-500 dark:text-night-muted mt-2">
          بیا اولین مزرعه‌ات رو بسازیم
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

          {/* Map */}
          <div className="card shadow-glow">
            <label className="text-xs font-bold text-gray-600 dark:text-night-muted mb-2 block">
              موقعیت روی نقشه *
            </label>

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
                  {lat !== null && lng !== null && <Marker position={[lat, lng]} />}
                  <MapClickHandler onMapClick={(pos: [number, number]) => { setLat(pos[0]); setLng(pos[1]); }} />
                </MapContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-night-muted text-sm">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              )}
            </div>

            {lat !== null && lng !== null && (
              <div className="text-xs text-gray-500 dark:text-night-muted mb-2 text-center">
                <MapPin size={12} className="inline-block mr-1" />
                عرض: {lat.toFixed(4)} | طول: {lng.toFixed(4)}
              </div>
            )}

            <button
              type="button"
              onClick={handleGeolocation}
              disabled={geoLoading}
              className="text-sm text-brand-green hover:underline flex items-center justify-center gap-1 w-full py-2"
            >
              {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
              استفاده از مکان فعلی من
            </button>
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
              {loading ? 'در حال ساخت...' : 'ساخت مزرعه'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

