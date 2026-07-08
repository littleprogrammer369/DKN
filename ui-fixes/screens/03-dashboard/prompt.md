# 🤖 پرامپت Cline — اصلاح UI صفحه Dashboard

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۱۱ مشکل UI در صفحه Dashboard (apps/web/src/components/screens/dashboard-screen.tsx).

## Context
- پروژه: DKN (داده کشت نوین)
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: apps/web/src/components/screens/dashboard-screen.tsx
- کتابخانه آیکون: lucide-react
- i18n: متن‌ها باید فارسی باشند (RTL)

## ❌ مشکلات P0 (بحرانی)

### P0-D۱: فارسی کردن همه متن‌های انگلیسی
**مشکل:** "Weather", "Wind", "Humidity", "Temp", "Last irrigation", "Day Forecast-5", "Alerts & Recommendations", "Ask AI for advice" همگی انگلیسی هستند.
**هدف:** همه متن‌ها فارسی شوند.

**راه‌حل:**
```tsx
// قبل:
<h3>Weather</h3>
<span>Wind</span>
<span>Humidity</span>
<span>Temp</span>

// بعد:
<h3>آب و هوا</h3>
<span>باد</span>
<span>رطوبت</span>
<span>دما</span>

// "Last irrigation: 6 days ago" → "آخرین آبیاری: ۶ روز پیش"
// "Day Forecast- 5" → "پیش‌بینی ۵ روز آینده"
// "Alerts & Recommendations" → "هشدارها و توصیه‌ها"
// "Ask AI for advice" → "از AI مشورت بگیر"

// نام روزها:
// Monday → دوشنبه
// Tuesday → سه‌شنبه
// Wednesday → چهارشنبه
// Thursday → پنج‌شنبه
// Friday → جمعه
// Saturday → شنبه
// Sunday → یکشنبه
```

### P0-D۲: رفع contrast در شب
**مشکل:** متن‌های کارت‌ها در شب کم‌رنگ و با زمینه یکی می‌شوند. خواندن سخت.
**هدف:** contrast مناسب در هر دو حالت.

**راه‌حل:**
```tsx
// در tailwind.config.ts یا globals.css:
/* متن secondary در شب باید روشن‌تر باشه */
.dark {
  --text-secondary: rgba(255, 255, 255, 0.85); /* قبلاً 0.5 بود */
  --text-tertiary: rgba(255, 255, 255, 0.65);
}

// یا در کامپوننت:
<span className="
  text-text-secondary 
  dark:text-white/80 
  font-medium
">
  باد
</span>

// برای مقادیر (Wind: 12):
<span className="text-2xl font-bold text-text-primary">
  ۱۲
</span>

// یعنی label کم‌رنگ‌تر، value روشن و پررنگ
```

### P0-D۳: رفع bug "تست سلامت:" در Welcome
**مشکل:** الان "Welcome تست سلامت:" نمایش داده می‌شه که test data placeholder هست.
**هدف:** استفاده از `user.firstName` واقعی.

**راه‌حل:**
```tsx
import { useAuth } from '@/hooks/useAuth';

const { user } = useAuth();

// قبل:
// <p>Welcome تست سلامت:</p>

// بعد:
<div>
  <p className="text-sm text-text-secondary">خوش آمدی 👋</p>
  <h1 className="text-2xl font-bold text-text-primary mt-1">
    {user?.firstName ?? 'کشاورز عزیز'}
  </h1>
</div>

// اگه user نداره (هنوز login نکرده):
// "کشاورز عزیز" fallback
```

## 🟡 مشکلات P1 (مهم)

### P1-D۴: Glow Effect روی Border
**مشکل:** کارت‌ها flat و بدون عمق.
**هدف:** shadow ملایم با رنگ primary (سبز).

**راه‌حل:**
```tsx
// در tailwind.config.ts:
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'glow': '0 0 0 1px rgba(16, 185, 129, 0.1), 0 4px 20px -2px rgba(16, 185, 129, 0.15)',
        'glow-lg': '0 0 0 1px rgba(16, 185, 129, 0.15), 0 8px 30px -5px rgba(16, 185, 129, 0.2)',
      },
    },
  },
};

// در dark mode:
boxShadow: {
  'glow': '0 0 0 1px rgba(16, 185, 129, 0.2), 0 0 30px -5px rgba(16, 185, 129, 0.2)',
}

// در کامپوننت Card:
<div className="
  bg-bg-elevated 
  border border-border 
  rounded-2xl p-4
  shadow-glow
  dark:shadow-glow
  transition-shadow
  hover:shadow-glow-lg
">
  {/* محتوا */}
</div>
```

### P1-D۵: Weather Card بهتر
**مشکل:** سه عدد (Wind, Humidity, Temp) کنار هم، خشک و بی‌روح.
**هدف:** نمایش زیبا با آیکون بزرگ.

**راه‌حل:**
```tsx
import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';

function WeatherCard({ weather }: { weather: WeatherData }) {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-5 shadow-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">آب و هوا</h3>
        <span className="text-xs text-text-tertiary">الان</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Sun className="text-amber-500" size={48} />
        <div>
          <p className="text-4xl font-bold text-text-primary">{weather.temp}°</p>
          <p className="text-sm text-text-secondary">{weather.condition}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <WeatherDetail icon={<Wind size={16} />} label="باد" value={`${weather.wind} km/h`} />
        <WeatherDetail icon={<Droplets size={16} />} label="رطوبت" value={`${weather.humidity}٪`} />
        <WeatherDetail icon={<Thermometer size={16} />} label="دما" value={`${weather.temp}°C`} />
      </div>

      <p className="text-xs text-text-tertiary mt-3">
        آخرین آبیاری: {formatRelativeTime(weather.lastIrrigation)}
      </p>
    </div>
  );
}

function WeatherDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-text-secondary text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-semibold text-text-primary">{value}</span>
    </div>
  );
}
```

### P1-D۶: 5-Day Forecast بهتر (Horizontal Scroll)
**مشکل:** ۵ روز کنار هم فشرده و کوچک.
**هدف:** scrollable horizontal با کارت‌های زیباتر.

**راه‌حل:**
```tsx
import { Sun, Cloud, CloudRain } from 'lucide-react';

const DAY_NAMES_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

function ForecastCard({ forecast }: { forecast: WeatherForecast[] }) {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-5 shadow-glow">
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        پیش‌بینی ۵ روز آینده
      </h3>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {forecast.map((day, i) => (
          <div
            key={i}
            className="
              flex-shrink-0 
              w-20 
              bg-bg-base 
              border border-border 
              rounded-xl 
              p-3 
              text-center
              snap-start
            "
          >
            <p className="text-xs text-text-secondary mb-2">{DAY_NAMES_FA[day.dayOfWeek]}</p>
            <div className="mb-2 flex justify-center">
              {day.condition === 'sunny' && <Sun className="text-amber-500" size={28} />}
              {day.condition === 'cloudy' && <Cloud className="text-gray-500" size={28} />}
              {day.condition === 'rainy' && <CloudRain className="text-blue-500" size={28} />}
            </div>
            <p className="text-lg font-bold text-text-primary">{day.tempMax}°</p>
            {day.rainChance > 20 && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <Droplets className="text-blue-500" size={12} />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {day.rainChance}٪
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### P1-D۷: Quick Actions = آیکون + فارسی
**مشکل:** نام انگلیسی بالای هر کارت.
**هدف:** آیکون بزرگ + نام فارسی.

**راه‌حل:**
```tsx
import { Bug, Droplet, Sparkles, Sprout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { id: 'pest', label: 'آفات', icon: Bug, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', href: '/pest' },
  { id: 'water', label: 'آبیاری', icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', href: '/irrigation' },
  { id: 'ai', label: 'دستیار AI', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', href: '/ai-chat' },
  { id: 'farm', label: 'زمین‌ها', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', href: '/farms' },
];

function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.id}
            href={action.href}
            className="
              bg-bg-elevated 
              border border-border 
              rounded-2xl 
              p-5
              shadow-glow
              hover:shadow-glow-lg
              hover:scale-[1.02]
              transition-all
              flex flex-col items-center gap-3
            "
          >
            <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center`}>
              <Icon className={action.color} size={24} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-text-primary">{action.label}</p>
            </div>
            <ArrowLeft className="text-text-tertiary" size={16} />
          </Link>
        );
      })}
    </div>
  );
}
```

## 🟢 مشکلات P2 (اختیاری)

### P2-D۸: Welcome Header بهتر
(در P0-D۳ پوشش داده شد)

### P2-D۹: Real-time "X days ago"
```tsx
import { useEffect, useState } from 'react';

function useRelativeTime(date: Date | string) {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // هر دقیقه
    return () => clearInterval(interval);
  }, []);
  
  return formatDistanceToNow(date, { locale: faIR });
}

// استفاده:
<span>آخرین آبیاری: {useRelativeTime(lastIrrigation)}</span>
```

### P2-D۱۰: Empty State برای farm
```tsx
function DashboardEmptyState() {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <Sprout className="text-green-600" size={40} />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">
        هنوز مزرعه‌ای نداری!
      </h2>
      <p className="text-text-secondary mb-6">
        برای شروع، اولین مزرعه‌ات رو بساز
      </p>
      <Link
        href="/farms/create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
      >
        <Plus size={20} />
        ساخت اولین مزرعه
      </Link>
    </div>
  );
}
```

### P2-D۱۱: Loading State
```tsx
import { Skeleton } from '@/components/ui/skeleton';

if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
```

## 🔧 دستورالعمل کلی

1. **همه متن‌ها را i18n کن** (یا hardcode فارسی برای MVP)
2. **از lucide-react استفاده کن** برای آیکون
3. **از framer-motion استفاده کن** برای hover effect
4. **همه کارت‌ها shadow-glow داشته باشند**
5. **Real-time update برای "X days ago"**

## ✅ معیار پذیرش

- [ ] همه متن‌ها فارسی هستند (Wind → باد، و ...)
- [ ] در شب، متن‌ها خوانا هستند (contrast کافی)
- [ ] "تست سلامت:" به user.firstName تغییر کرده
- [ ] همه کارت‌ها glow دارند
- [ ] Weather card با آیکون بزرگ نمایش داده می‌شود
- [ ] Forecast scrollable horizontal است
- [ ] Quick actions آیکون + فارسی دارند
- [ ] "X روز پیش" real-time است
- [ ] Empty state برای farm-less کاربر
- [ ] Build بدون خطا

## 📝 خروجی مورد انتظار

- Branch: `fix/ui-dashboard-page`
- Commit: `fix(ui): اصلاح ۱۱ مشکل صفحه Dashboard`
- PR: لینک GitHub
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `dashboard-screen.tsx` | همه ۱۱ مشکل |
| `tailwind.config.ts` | اضافه shadow glow |
| `globals.css` | contrast در dark mode |
| `hooks/useAuth.ts` | دسترسی به user (اگه نیست) |

---

**🚀 این پرامپت را مستقیم به Cline بده!**
