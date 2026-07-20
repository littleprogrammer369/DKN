# 🤖 پرامپت Cline — اصلاح UI صفحه Irrigation (آبیاری)

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۱۱ مشکل UI در صفحه Irrigation (apps/web/src/components/screens/irrigation-screen.tsx).

## Context
- پروژه: DKN
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: irrigation-screen.tsx
- کامپوننت جدید: AddIrrigationModal.tsx
- کتابخانه: lucide-react, recharts

## ❌ مشکلات P0 (بحرانی)

### P0-IR۱: رفع typo "آبی" → "آبیاری"
```tsx
// قبل:
// <p>مدیریت هوشمند آبی</p>

// بعد:
<p>مدیریت هوشمند آبیاری</p>

// جستجو در همه فایل‌ها: "آبی" باید "آبیاری"
// grep -r "هوشمند آبی" apps/web/src/
```

### P0-IR۲: رفع bug درصد باران (۵۰۰٪، ۱۰۰۰٪، ...)
**مشکل:** درصدهای باران غیرمنطقی (۵۰۰٪، ۱۰۰۰٪، ۲۰۰۰٪، ۳۰۰۰٪)
**هدف:** حداکثر ۱۰۰٪

**راه‌حل:**
```tsx
// در data formatting:
function formatRainChance(chance: number): string {
  // اگه عدد غیرمنطقی بود (بیشتر از ۱۰۰):
  if (chance > 100) {
    // شاید precipitation_mm هست که باید به درصد تبدیل بشه
    // یا bug در داده — clamp کن
    return '۰٪';
  }
  return `${Math.round(chance)}٪`;
}

// یا در backend:
// اگه rain_chance به صورت "500" ارسال می‌شه،
// مطمئن شو که backend درست تبدیل می‌کنه
```

### P0-IR۳: Border روی همه المان‌ها
```tsx
// هر کارت:
className="bg-bg-elevated border border-border rounded-2xl shadow-glow p-4"

// فرم‌ها (در modal):
<input className="bg-bg-base border border-border rounded-xl px-4 py-3" />
```

### P0-IR۴: ایکون lucide، فارسی، contrast
```tsx
import { Droplet, Wind, Cloud, Sun, CloudRain, Calendar, Plus, History, Sparkles } from 'lucide-react';

// همه ایموجی:
// 💧 → <Droplet />
// 🌧️ → <CloudRain />
// ☀️ → <Sun />
// ☁️ → <Cloud />
// 📋 → <History />
// 📅 → <Calendar />
// 🤖 → <Sparkles />
```

## 🟡 مشکلات P1 (مهم)

### P1-IR۵: Forecast زیباتر
```tsx
import { Sun, Cloud, CloudRain, CloudSnow, Droplet } from 'lucide-react';

function WeatherForecastCard({ forecast }: { forecast: WeatherForecast[] }) {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl shadow-glow p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary" size={18} />
          <h3 className="font-semibold text-text-primary">پیش‌بینی ۵ روزه</h3>
        </div>
        <span className="text-xs text-text-tertiary">از هواشناسی</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day, i) => (
          <div
            key={i}
            className="
              bg-bg-base 
              border border-border 
              rounded-xl 
              p-3
              text-center
              hover:border-primary hover:shadow-glow
              transition-all
              cursor-pointer
            "
          >
            <p className="text-xs text-text-secondary mb-2">
              {DAY_NAMES_FA[day.dayOfWeek]}
            </p>
            
            {/* آیکون بزرگ */}
            <div className="flex justify-center mb-2">
              {day.condition === 'sunny' && <Sun className="text-amber-500" size={32} />}
              {day.condition === 'cloudy' && <Cloud className="text-gray-500" size={32} />}
              {day.condition === 'rainy' && <CloudRain className="text-blue-500" size={32} />}
            </div>

            {/* دما با high/low */}
            <div className="mb-2">
              <p className="text-lg font-bold text-text-primary">{day.tempMax}°</p>
              <p className="text-xs text-text-tertiary">{day.tempMin}°</p>
            </div>

            {/* باران فقط اگه بیشتر از ۲۰٪ */}
            {day.rainChance > 20 && (
              <div className="flex items-center justify-center gap-1 text-xs">
                <Droplet className="text-blue-500" size={12} />
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {Math.min(100, day.rainChance)}٪
                </span>
              </div>
            )}

            {/* دمای واقعی (حس شده) */}
            <p className="text-[10px] text-text-tertiary mt-1">
              {day.feelsLike}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### P1-IR۶: Status Badge درست
```tsx
// قبل:
// <span>ثبت نشده</span>

// بعد:
function IrrigationStatusBadge({ status }: { status: 'completed' | 'pending' | 'failed' }) {
  const config = {
    completed: { label: 'تأیید شده', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    pending: { label: 'در انتظار', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
    failed: { label: 'ناموفق', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  };
  
  const c = config[status];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
```

### P1-IR۷: Circular Progress برای کارایی
```tsx
// نصب: pnpm --filter web add react-circular-progressbar
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function EfficiencyGauge({ value }: { value: number }) {
  return (
    <div className="w-32 h-32 mx-auto">
      <CircularProgressbar
        value={value}
        maxValue={100}
        text={`${value}٪`}
        styles={buildStyles({
          pathColor: value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444',
          textColor: 'currentColor',
          trailColor: 'rgba(0,0,0,0.05)',
        })}
      />
    </div>
  );
}

// استفاده:
<EfficiencyGauge value={68} />
<p className="text-center text-sm text-text-secondary mt-2">کارایی آبیاری</p>
```

### P1-IR۸: AddIrrigationModal
```tsx
// apps/web/src/components/modals/add-irrigation-modal.tsx (جدید)
'use client';

import { useState } from 'react';
import { Calendar, Droplet, Clock, X, Plus } from 'lucide-react';

interface AddIrrigationModalProps {
  farmId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddIrrigationModal({ farmId, onClose, onSuccess }: AddIrrigationModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState<'drip' | 'sprinkler' | 'manual'>('drip');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/irrigation/history', {
        farmId,
        date,
        amount: Number(amount),
        duration: Number(duration),
        type,
        notes,
      });
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="
        bg-bg-base 
        w-full md:max-w-md 
        rounded-t-3xl md:rounded-3xl
        p-6 
        shadow-glow-lg
        max-h-[90vh] overflow-y-auto
      ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">ثبت آبیاری جدید</h2>
          <button onClick={onClose} className="p-2 hover:bg-bg-elevated rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* تاریخ */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              تاریخ
            </label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-bg-elevated border border-border rounded-xl"
              />
            </div>
          </div>

          {/* نوع آبیاری */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              نوع آبیاری
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'drip', label: 'قطره‌ای', icon: Droplet },
                { value: 'sprinkler', label: 'بارانی', icon: CloudRain },
                { value: 'manual', label: 'دستی', icon: Droplet },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as any)}
                  className={`
                    p-3 rounded-xl border-2 transition-all
                    flex flex-col items-center gap-1
                    ${type === t.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'}
                  `}
                >
                  <t.icon size={20} className={type === t.value ? 'text-primary' : 'text-text-secondary'} />
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* مقدار آب */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              مقدار آب (لیتر)
            </label>
            <div className="relative">
              <Droplet className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="۴۵"
                className="w-full pr-10 pl-12 pl-12 py-3 bg-bg-elevated border border-border rounded-xl"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                لیتر
              </span>
            </div>
          </div>

          {/* مدت */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              مدت (دقیقه)
            </label>
            <div className="relative">
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="۴.۵"
                className="w-full pr-10 pl-12 py-3 bg-bg-elevated border border-border rounded-xl"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                دقیقه
              </span>
            </div>
          </div>

          {/* یادداشت */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              یادداشت (اختیاری)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: صبح زود، قبل از ظهر..."
              rows={3}
              className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-xl resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-bg-elevated border border-border rounded-xl text-text-primary"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={!amount || saving}
            className="flex-1 py-3 bg-primary text-white rounded-xl disabled:opacity-50"
          >
            {saving ? 'در حال ذخیره...' : 'ثبت'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 🟢 مشکلات P2 (اختیاری)

### P2-IR۹: History List بهتر
```tsx
function IrrigationHistoryList({ history }: { history: IrrigationRecord[] }) {
  return (
    <div className="space-y-2">
      {history.map((record) => (
        <div
          key={record.id}
          className="bg-bg-elevated border border-border rounded-2xl p-4 shadow-glow"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-text-primary">{formatJalaliDate(record.date)}</p>
              <p className="text-sm text-text-secondary">
                {record.amount} لیتر • {record.duration} دقیقه
              </p>
            </div>
            <IrrigationStatusBadge status={record.status} />
          </div>
          {record.notes && (
            <p className="text-xs text-text-tertiary mt-2">{record.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

### P2-IR۱۰: Calendar Picker
```tsx
import { Calendar } from 'lucide-react';

{/* دکمه فیلتر تاریخ */}
<button className="...">
  <Calendar size={18} />
  این هفته
</button>
```

### P2-IR۱۱: Water Usage Stats
```tsx
function WaterUsageStats({ stats }: { stats: WaterStats }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard icon={<Droplet />} label="این هفته" value={`${stats.week} L`} />
      <StatCard icon={<Calendar />} label="این ماه" value={`${stats.month} L`} />
      <StatCard icon={<TrendingDown />} label="صرفه‌جویی" value={`${stats.savings}٪`} color="text-green-600" />
    </div>
  );
}
```

## 🔧 دستورالعمل کلی

1. **نصب:** `pnpm --filter web add react-circular-progressbar`
2. **ساخت AddIrrigationModal**
3. **همه ایموجی lucide**
4. **همه متن‌ها فارسی**
5. **همه کارت‌ها border + glow**

## ✅ معیار پذیرش

- [ ] typo "آبی" رفع
- [ ] bug ۵۰۰٪ rain رفع
- [ ] همه کارت‌ها border + glow
- [ ] همه ایموجی lucide
- [ ] همه متن‌ها فارسی
- [ ] در شب contrast
- [ ] Forecast زیباتر با آیکون بزرگ
- [ ] Status badge درست
- [ ] Circular progress
- [ ] AddIrrigationModal
- [ ] History list
- [ ] Build بدون خطا

## 📝 خروجی

- Branch: `fix/ui-irrigation`
- Commit: `fix(ui): اصلاح ۱۱ مشکل Irrigation`
- PR
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `irrigation-screen.tsx` | همه ۱۱ مشکل |
| `add-irrigation-modal.tsx` (جدید) | مودال ثبت |
| `package.json` | react-circular-progressbar |
```

---

**🚀 این پرامپت را مستقیم به Cline بده!**
