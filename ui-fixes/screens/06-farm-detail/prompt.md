# 🤖 پرامپت Cline — اصلاح UI صفحه Farm Detail (جزئیات زمین)

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۱۲ مشکل UI در صفحه Farm Detail (apps/web/src/components/screens/farm-detail-screen.tsx).

## Context
- پروژه: DKN
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: farm-detail-screen.tsx
- کتابخانه: lucide-react, react-leaflet, recharts

## ❌ مشکلات P0 (بحرانی)

### P0-FD۱: نقشه واقعی Leaflet
**مشکل:** فقط placeholder خاکستری.
**هدف:** نقشه واقعی با marker.

**راه‌حل:**
```tsx
import dynamic from 'next/dynamic';
import { MapPin, Layers } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(m => m.Polygon), { ssr: false });

// در صفحه:
{!farm.lat || !farm.lng ? (
  <div className="h-64 bg-bg-elevated border border-border rounded-2xl flex items-center justify-center">
    <div className="text-center">
      <MapPin className="mx-auto text-text-secondary mb-2" size={40} />
      <p className="text-text-secondary">موقعیت ثبت نشده</p>
    </div>
  </div>
) : (
  <div className="h-64 border border-border rounded-2xl overflow-hidden shadow-glow">
    <MapContainer
      center={[farm.lat, farm.lng]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {farm.geometry ? (
        <Polygon
          positions={farm.geometry.coordinates}
          pathOptions={{ color: '#10b981', fillOpacity: 0.3 }}
        />
      ) : (
        <Marker position={[farm.lat, farm.lng]}>
          <Popup>
            <strong>{farm.name}</strong>
            <br />
            {farm.area} هکتار
          </Popup>
        </Marker>
      )}
    </MapContainer>
  </div>
)}

// Leaflet CSS:
// در globals.css یا _app:
@import 'leaflet/dist/leaflet.css';
```

### P0-FD۲: Border روی همه کارت‌ها
```tsx
// هر کارت:
className="
  bg-bg-elevated 
  border border-border     /* اضافه شد */
  rounded-2xl p-4
  shadow-glow
"
```

### P0-FD۳: فارسی کردن
```tsx
// "Farm Metrics" → "معیارهای مزرعه"
// "Product" → "محصول"
// "Area (ha)" → "مساحت (هکتار)"
// "AI Advice" → "مشاوره با AI"
// "Pests" → "آفات"
// "Irrigation" → "آبیاری"
// "بازگشت" → "بازگشت به زمین‌ها" (یا فقط "بازگشت")
```

### P0-FD۴: ایکون lucide
```tsx
import { Sprout, Wheat, Droplet, Bug, Sparkles, Calendar, MapPin, Edit, Trash2, Settings, ArrowRight } from 'lucide-react';

// همه ایموجی‌ها با آیکون lucide جایگزین شوند
```

### P0-FD۵: contrast در شب
```tsx
// در globals.css:
.dark {
  --text-secondary: rgba(255, 255, 255, 0.85);
}
```

### P0-FD۶: دکمه بازگشت زیباتر
```tsx
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react'; // در RTL، ArrowRight به معنای "برگشت" است

const router = useRouter();

<button
  onClick={() => router.back()}
  className="
    inline-flex items-center gap-2 px-4 py-2
    bg-bg-elevated border border-border 
    rounded-xl
    text-text-primary hover:bg-bg-base
    transition-colors
    shadow-glow
  "
>
  <ArrowRight size={18} />
  بازگشت
</button>
```

### P0-FD۷: رفع bug "1 - 1 هکتار"
```tsx
function formatArea(area: number): string {
  return `${area.toLocaleString('fa-IR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} هکتار`;
}

// استفاده:
<p>{formatArea(farm.area)}</p> // "۱.۱ هکتار"
```

## 🟡 مشکلات P1 (مهم)

### P1-FD۸: متریک‌های real-time
```tsx
import { Droplet, Thermometer, Activity, TrendingUp } from 'lucide-react';

function FarmMetrics({ farmId }: { farmId: string }) {
  const { data: metrics } = useQuery({
    queryKey: ['metrics', farmId],
    queryFn: () => api.get(`/farms/${farmId}/metrics`),
    refetchInterval: 60000,
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        icon={<Droplet className="text-blue-600" size={20} />}
        label="رطوبت خاک"
        value={`${metrics?.soilMoisture ?? '--'}٪`}
        progress={metrics?.soilMoisture ?? 0}
        progressColor="bg-blue-500"
      />
      <MetricCard
        icon={<Thermometer className="text-red-600" size={20} />}
        label="دما"
        value={`${metrics?.temperature ?? '--'}°C`}
        progress={null}
      />
      <MetricCard
        icon={<Activity className="text-green-600" size={20} />}
        label="NDVI"
        value={metrics?.ndvi?.toFixed(2) ?? '--'}
        progress={(metrics?.ndvi ?? 0) * 100}
        progressColor="bg-green-500"
      />
      <MetricCard
        icon={<TrendingUp className="text-purple-600" size={20} />}
        label="کارایی آبیاری"
        value={`${metrics?.irrigationEfficiency ?? '--'}٪`}
        progress={metrics?.irrigationEfficiency ?? 0}
        progressColor="bg-purple-500"
      />
    </div>
  );
}

function MetricCard({ icon, label, value, progress, progressColor }: any) {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-4 shadow-glow">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
      {progress !== null && (
        <div className="h-1.5 bg-bg-base rounded-full overflow-hidden mt-2">
          <div className={`h-full ${progressColor}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
```

### P1-FD۹: نمودار رطوبت خاک
```tsx
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

function SoilMoistureChart({ farmId }: { farmId: string }) {
  const { data: history } = useQuery({
    queryKey: ['moisture-history', farmId],
    queryFn: () => api.get(`/farms/${farmId}/metrics/soil-moisture/history?days=7`),
  });

  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-4 shadow-glow">
      <h3 className="text-sm font-medium text-text-secondary mb-3">
        رطوبت خاک (۷ روز اخیر)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history}>
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### P1-FD۱۰: Alerts
```tsx
function FarmAlerts({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`
            bg-bg-elevated border-r-4 rounded-xl p-3
            flex items-start gap-3
            ${alert.severity === 'high' ? 'border-red-500' :
              alert.severity === 'medium' ? 'border-amber-500' :
              'border-blue-500'}
          `}
        >
          <AlertCircle className="..." size={20} />
          <div className="flex-1">
            <p className="font-medium text-text-primary">{alert.title}</p>
            <p className="text-sm text-text-secondary">{alert.description}</p>
          </div>
          <button className="text-primary hover:underline text-sm">
            اقدام
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🟢 مشکلات P2 (اختیاری)

### P2-FD۱۱: Quick actions با آیکون
```tsx
import { Sparkles, Bug, Droplet } from 'lucide-react';

<div className="grid grid-cols-3 gap-3">
  <ActionButton icon={<Sparkles />} label="مشاوره AI" href="/ai-chat" color="text-purple-600" />
  <ActionButton icon={<Bug />} label="آفات" href="/pest" color="text-red-600" />
  <ActionButton icon={<Droplet />} label="آبیاری" href="/irrigation" color="text-blue-600" />
</div>

function ActionButton({ icon, label, href, color }: any) {
  return (
    <Link
      href={href}
      className="bg-bg-elevated border border-border rounded-2xl p-4 hover:shadow-glow-lg transition-all text-center"
    >
      <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center bg-bg-base ${color}`}>
        {icon}
      </div>
      <p className="text-sm font-medium">{label}</p>
    </Link>
  );
}
```

### P2-FD۱۲: پیش‌بینی هوا
```tsx
function FarmWeather({ lat, lng }: { lat: number; lng: number }) {
  // fetch weather from /api/weather?lat=X&lng=Y
  // نمایش ۳ روز آینده
}
```

## 🔧 دستورالعمل کلی

1. **نصب:** `pnpm --filter web add recharts react-leaflet leaflet @types/leaflet`
2. **Leaflet CSS** در globals.css
3. **همه ایموجی lucide**
4. **همه متن‌ها فارسی**
5. **همه کارت‌ها border + glow**
6. **دکمه بازگشت زیبا**

## ✅ معیار پذیرش

- [ ] نقشه Leaflet واقعی
- [ ] همه کارت‌ها border دارند
- [ ] همه متن‌ها فارسی
- [ ] همه ایموجی lucide
- [ ] در شب contrast
- [ ] دکمه بازگشت زیبا
- [ ] "۱.۱ هکتار" نه "1 - 1"
- [ ] متریک‌های real-time
- [ ] نمودار رطوبت
- [ ] Alerts
- [ ] Quick actions آیکون
- [ ] Build بدون خطا

## 📝 خروجی

- Branch: `fix/ui-farm-detail`
- Commit: `fix(ui): اصلاح ۱۲ مشکل Farm Detail`
- PR
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `farm-detail-screen.tsx` | همه ۱۲ مشکل |
| `globals.css` | Leaflet CSS |
| `package.json` | recharts, react-leaflet |
```

---

**🚀 این پرامپت را مستقیم به Cline بده!**
