# 🤖 پرامپت Cline — اصلاح UI صفحه Farm Create (ساخت زمین)

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۹ مشکل UI در صفحه Farm Create (apps/web/src/components/screens/farm-create-screen.tsx).

## Context
- پروژه: DKN (داده کشت نوین)
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: apps/web/src/components/screens/farm-create-screen.tsx
- کتابخانه: lucide-react
- نقشه: react-leaflet (نصب: pnpm --filter web add react-leaflet leaflet @types/leaflet)

## ❌ مشکلات P0 (بحرانی)

### P0-FC۱: رفع bug "خوش آمدی جان"
```tsx
import { useAuth } from '@/hooks/useAuth';

const { user } = useAuth();

// قبل:
// <p>خوش آمدی جان، به داده کشت نوین خوش اومدی!</p>

// بعد:
<p className="text-text-secondary">
  {user?.firstName ?? 'کشاورز عزیز'}، به داده کشت نوین خوش آمدی!
</p>
```

### P0-FC۲: اضافه کردن فیلد محصول
```tsx
import { Wheat, Sprout, TreePine, Carrot } from 'lucide-react';

const CROP_OPTIONS = [
  { value: 'wheat', label: 'گندم', icon: Wheat },
  { value: 'corn', label: 'ذرت', icon: Sprout },
  { value: 'pistachio', label: 'پسته', icon: TreePine },
  { value: 'tomato', label: 'گوجه', icon: Carrot },
  { value: 'cucumber', label: 'خیار', icon: Sprout },
  { value: 'alfalfa', label: 'یونجه', icon: Wheat },
];

<div>
  <label className="text-sm font-medium text-text-primary mb-2 block">
    نوع محصول *
  </label>
  <div className="grid grid-cols-3 gap-2">
    {CROP_OPTIONS.map((crop) => {
      const Icon = crop.icon;
      return (
        <button
          key={crop.value}
          type="button"
          onClick={() => setCropType(crop.value)}
          className={`
            p-3 rounded-xl border-2 transition-all
            flex flex-col items-center gap-1
            ${cropType === crop.value
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
            }
          `}
        >
          <Icon className={cropType === crop.value ? 'text-primary' : 'text-text-secondary'} size={24} />
          <span className="text-xs">{crop.label}</span>
        </button>
      );
    })}
  </div>
</div>
```

### P0-FC۳: جدا کردن شهر و استان
```tsx
const PROVINCES = [
  'تهران', 'اصفهان', 'مرکزی', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'مازندران', 'گیلان', 'کرمان', 'یزد', 'سیستان و بلوچستان', 'خوزستان',
  // ... همه استان‌ها
];

<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-sm font-medium text-text-primary mb-2 block">
      شهر *
    </label>
    <input
      value={city}
      onChange={(e) => setCity(e.target.value)}
      placeholder="مثل: ساوه"
      className="w-full bg-bg-base border border-border rounded-xl px-4 py-3 ..."
    />
  </div>
  <div>
    <label className="text-sm font-medium text-text-primary mb-2 block">
      استان *
    </label>
    <select
      value={province}
      onChange={(e) => setProvince(e.target.value)}
      className="w-full bg-bg-base border border-border rounded-xl px-4 py-3 ..."
    >
      <option value="">انتخاب استان</option>
      {PROVINCES.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  </div>
</div>
```

### P0-FC۴: نقشه برای انتخاب مختصات (مهم‌ترین)
```tsx
import dynamic from 'next/dynamic';
import { MapPin, Navigation } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

// در صفحه:
const [lat, setLat] = useState<number | null>(null);
const [lng, setLng] = useState<number | null>(null);

const handleMapClick = (e) => {
  setLat(e.latlng.lat);
  setLng(e.latlng.lng);
};

<div>
  <label className="text-sm font-medium text-text-primary mb-2 block">
    موقعیت روی نقشه *
  </label>
  
  <div className="bg-bg-base border border-border rounded-xl overflow-hidden h-64 mb-2">
    {lat && lng ? (
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
      </MapContainer>
    ) : (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <MapPin size={40} className="mx-auto mb-2" />
          <p className="text-sm">روی نقشه کلیک کن تا مکان مزرعه انتخاب شود</p>
        </div>
      </div>
    )}
  </div>

  {lat && lng && (
    <div className="text-xs text-text-secondary">
      📍 عرض: {lat.toFixed(4)} | طول: {lng.toFixed(4)}
    </div>
  )}

  <button
    type="button"
    onClick={() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      });
    }}
    className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
  >
    <Navigation size={14} />
    استفاده از مکان فعلی من
  </button>
</div>
```

### P0-FC۵: ایکون lucide و فارسی کردن
```tsx
import { Sprout, Wheat, MapPin, Square, ArrowLeft, X } from 'lucide-react';

// همه ایموجی‌ها را جایگزین کن:
// 🌱 → <Sprout />
// 🌾 → <Wheat />
// 📍 → <MapPin />
// 📐 → <Square />

// "ادامه" button:
<button>
  <ArrowLeft size={18} />
  ادامه
</button>

// "بعداً می‌سازم" link:
<button onClick={() => router.push('/dashboard')}>
  فعلاً رد می‌کنم
</button>
```

## 🟡 مشکلات P1 (مهم)

### P1-FC۶: Stepper / Progress
```tsx
<div className="flex items-center justify-center gap-2 mb-6">
  {[1, 2, 3].map((step) => (
    <div
      key={step}
      className={`
        w-2 h-2 rounded-full transition-all
        ${currentStep >= step ? 'bg-primary w-8' : 'bg-border'}
      `}
    />
  ))}
</div>
<p className="text-center text-sm text-text-secondary mb-4">
  مرحله {currentStep} از ۳
</p>
```

### P1-FC۷: Glow effect
(همان قبل)

### P1-FC۸: نوع خاک و آبیاری (اختیاری)
```tsx
const SOIL_TYPES = [
  { value: 'clay', label: 'رسی' },
  { value: 'sandy', label: 'شنی' },
  { value: 'loamy', label: 'لومی' },
  { value: 'silty', label: 'سیلتی' },
];

const IRRIGATION_TYPES = [
  { value: 'drip', label: 'قطره‌ای', icon: Droplet },
  { value: 'sprinkler', label: 'بارانی', icon: CloudRain },
  { value: 'surface', label: 'سطحی', icon: Waves },
];

// استفاده از dropdown یا chip selection
```

## 🟢 مشکلات P2 (اختیاری)

### P2-FC۹: Validation
```tsx
const farmSchema = z.object({
  name: z.string().min(2, 'نام مزرعه حداقل ۲ کاراکتر'),
  cropType: z.string().min(1, 'محصول را انتخاب کنید'),
  city: z.string().min(2, 'شهر را وارد کنید'),
  province: z.string().min(1, 'استان را انتخاب کنید'),
  area: z.number().positive('مساحت باید مثبت باشد').max(10000, 'مساحت خیلی زیاد است'),
  lat: z.number().min(-90).max(90, 'عرض جغرافیایی نامعتبر'),
  lng: z.number().min(-180).max(180, 'طول جغرافیایی نامعتبر'),
});
```

## 🔧 دستورالعمل کلی

1. **نصب:** `pnpm --filter web add react-leaflet leaflet @types/leaflet`
2. **همه ایموجی lucide**
3. **نقشه با dynamic import (ssr: false)**
4. **Validation با react-hook-form + zod**

## ✅ معیار پذیرش

- [ ] "خوش آمدی جان" رفع شد
- [ ] فیلد محصول اضافه شد
- [ ] شهر و استان جدا هستند
- [ ] نقشه برای انتخاب مکان کار می‌کند
- [ ] همه ایموجی lucide
- [ ] همه متن‌ها فارسی
- [ ] در شب contrast کافی
- [ ] Stepper نمایش داده می‌شود
- [ ] Build بدون خطا

## 📝 خروجی

- Branch: `fix/ui-farm-create`
- Commit: `fix(ui): اصلاح ۹ مشکل Farm Create`
- PR
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `farm-create-screen.tsx` | همه ۹ مشکل |
| `package.json` | react-leaflet, leaflet |
```

---

**🚀 این پرامپت را مستقیم به Cline بده!**
