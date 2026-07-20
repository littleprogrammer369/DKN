# 🤖 پرامپت Cline — اصلاح UI صفحه Pests (آفات)

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۱۳ مشکل UI در صفحه Pests (apps/web/src/components/screens/pest-screen.tsx).

## Context
- پروژه: DKN
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: pest-screen.tsx
- کامپوننت جدید: PestDetailModal.tsx
- کتابخانه: lucide-react

## ❌ مشکلات P0 (بحرانی)

### P0-PT۱: فارسی کردن همه متن‌ها
```tsx
// ترجمه‌ها:
// "Pest Monitoring" → "پایش هوشمند"
// "Pests & Diseases" → "آفات و بیماری‌ها"
// "Risk Status" → "وضعیت ریسک"
// "Heat stress risk" → "ریسک تنش گرمایی"
// "Fungal risk (humidity)" → "ریسک قارچی (رطوبت)"
// "New Report" → "گزارش جدید"
// "My Reports" → "گزارش‌های من"
// "Submit" → "ثبت"
// "Cancel" → "انصراف"
// "MEDIUM" → "متوسط"
// "LOW" → "پایین"
// "HIGH" → "بالا"
// "CRITICAL" → "بحرانی"

// dropdown:
// "Barley" → "جو"
// "Rust" → "زنگ"
// یا dropdown با لیست کامل فارسی
```

### P0-PT۲: انتخاب زمین (مهم)
```tsx
import { useFarms } from '@/hooks/useFarms';
import { Sprout, ChevronDown } from 'lucide-react';

const { data: farms, isLoading: farmsLoading } = useFarms();
const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

<button
  onClick={() => setShowFarmPicker(true)}
  className="
    w-full bg-bg-elevated border border-border rounded-xl
    px-4 py-3
    flex items-center justify-between
    hover:border-primary
  "
>
  <div className="flex items-center gap-2">
    <Sprout className="text-primary" size={18} />
    <div className="text-right">
      <p className="text-sm text-text-secondary">مزرعه</p>
      <p className="font-medium text-text-primary">
        {selectedFarmId
          ? farms?.find(f => f.id === selectedFarmId)?.name
          : 'انتخاب مزرعه'}
      </p>
    </div>
  </div>
  <ChevronDown className="text-text-secondary" size={18} />
</button>

{showFarmPicker && (
  <FarmPickerModal
    farms={farms}
    onSelect={(id) => {
      setSelectedFarmId(id);
      setShowFarmPicker(false);
    }}
    onClose={() => setShowFarmPicker(false)}
  />
)}
```

### P0-PT۳: Severity Slider
```tsx
const SEVERITY_LEVELS = [
  { value: 'low', label: 'کم', color: 'bg-green-500', textColor: 'text-green-600' },
  { value: 'medium', label: 'متوسط', color: 'bg-amber-500', textColor: 'text-amber-600' },
  { value: 'high', label: 'شدید', color: 'bg-orange-500', textColor: 'text-orange-600' },
  { value: 'critical', label: 'بحرانی', color: 'bg-red-500', textColor: 'text-red-600' },
];

<div>
  <label className="text-sm font-medium text-text-primary mb-2 block">
    شدت آفت
  </label>
  <div className="grid grid-cols-4 gap-2">
    {SEVERITY_LEVELS.map((level) => (
      <button
        key={level.value}
        type="button"
        onClick={() => setSeverity(level.value)}
        className={`
          p-3 rounded-xl border-2 transition-all
          flex flex-col items-center gap-1
          ${severity === level.value
            ? `border-primary ${level.color}/20`
            : 'border-border hover:border-primary/50'
          }
        `}
      >
        <span className={`w-3 h-3 rounded-full ${level.color}`} />
        <span className="text-xs">{level.label}</span>
      </button>
    ))}
  </div>
</div>
```

### P0-PT۴: آپلود عکس بهتر
```tsx
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, ChangeEvent } from 'react';

const [images, setImages] = useState<File[]>([]);
const fileInputRef = useRef<HTMLInputElement>(null);

const handleFiles = (files: FileList) => {
  const newFiles = Array.from(files)
    .filter(f => f.type.startsWith('image/'))
    .slice(0, 5);
  setImages(prev => [...prev, ...newFiles].slice(0, 5));
};

const removeImage = (index: number) => {
  setImages(prev => prev.filter((_, i) => i !== index));
};

<div>
  <label className="text-sm font-medium text-text-primary mb-2 block">
    عکس از آفت (اختیاری ولی مفید)
  </label>
  
  {images.length === 0 ? (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="
        w-full h-32
        border-2 border-dashed border-border
        rounded-xl
        flex flex-col items-center justify-center gap-2
        text-text-secondary
        hover:border-primary hover:text-primary
        transition-colors
      "
    >
      <Camera size={32} />
      <span className="text-sm">برای آپلود عکس کلیک کنید</span>
      <span className="text-xs">حداکثر ۵ عکس</span>
    </button>
  ) : (
    <div className="grid grid-cols-3 gap-2">
      {images.map((img, i) => (
        <div key={i} className="relative aspect-square">
          <img
            src={URL.createObjectURL(img)}
            alt={`عکس ${i + 1}`}
            className="w-full h-full object-cover rounded-xl border border-border"
          />
          <button
            type="button"
            onClick={() => removeImage(i)}
            className="absolute top-1 left-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-glow"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      {images.length < 5 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-text-secondary hover:border-primary hover:text-primary"
        >
          <Plus size={24} />
          <span className="text-xs mt-1">افزودن</span>
        </button>
      )}
    </div>
  )}
  
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => e.target.files && handleFiles(e.target.files)}
    className="hidden"
  />
</div>
```

### P0-PT۵: lucide، contrast، border، glow (مشترک)
```tsx
// همه ایموجی با lucide
import { Bug, ShieldAlert, AlertTriangle, Camera, Plus, Image, Trash2 } from 'lucide-react';

// همه کارت‌ها border + glow
// همه متن‌ها فارسی
```

## 🟡 مشکلات P1 (مهم)

### P1-PT۶: لیست گزارش‌ها با thumbnail
```tsx
function ReportListItem({ report, onClick }: { report: PestReport; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full 
        bg-bg-elevated border border-border 
        rounded-2xl p-4 
        hover:shadow-glow-lg
        transition-all
        text-right
      "
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl bg-bg-base overflow-hidden flex-shrink-0">
          {report.images?.[0] ? (
            <img src={report.images[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="text-text-secondary" size={24} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-text-primary">
              {report.pestName}
            </h3>
            <SeverityBadge severity={report.severity} />
          </div>
          <p className="text-sm text-text-secondary">
            {report.cropName} • {report.farmName}
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            {formatRelativeTime(report.createdAt)}
          </p>
        </div>
      </div>
    </button>
  );
}

function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' | 'critical' }) {
  const config = {
    low: { label: 'کم', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    medium: { label: 'متوسط', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
    high: { label: 'شدید', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
    critical: { label: 'بحرانی', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  };
  const c = config[severity];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
```

### P1-PT۷: Detail Modal
```tsx
// apps/web/src/components/modals/pest-detail-modal.tsx
import { X, Calendar, MapPin, Bug, Camera, Edit, Trash2, Share2 } from 'lucide-react';

export function PestDetailModal({ report, onClose, onEdit, onDelete }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="bg-bg-base w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="text-red-600" size={20} />
            <h2 className="text-lg font-semibold text-text-primary">{report.pestName}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-elevated rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Images gallery */}
        {report.images?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {report.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="aspect-square object-cover rounded-xl"
              />
            ))}
          </div>
        )}

        {/* Info */}
        <div className="space-y-3">
          <InfoRow icon={<Calendar size={16} />} label="تاریخ" value={formatJalaliDate(report.createdAt)} />
          <InfoRow icon={<MapPin size={16} />} label="مزرعه" value={report.farmName} />
          <InfoRow icon={<Bug size={16} />} label="محصول" value={report.cropName} />
          <InfoRow label="شدت" value={<SeverityBadge severity={report.severity} />} />
          {report.notes && (
            <div>
              <p className="text-sm text-text-secondary mb-1">یادداشت</p>
              <p className="text-text-primary">{report.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onEdit}
            className="flex-1 py-3 bg-bg-elevated border border-border rounded-xl flex items-center justify-center gap-2"
          >
            <Edit size={16} />
            ویرایش
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### P1-PT۸: Dropdown محصول و آفت فارسی
```tsx
const CROPS = [
  { value: 'wheat', label: 'گندم', icon: Wheat },
  { value: 'barley', label: 'جو', icon: Wheat },
  { value: 'corn', label: 'ذرت', icon: Sprout },
  { value: 'pistachio', label: 'پسته', icon: TreePine },
  { value: 'tomato', label: 'گوجه', icon: Apple },
];

const PESTS = [
  { value: 'rust', label: 'زنگ', severity: 'high' },
  { value: 'aphid', label: 'شته', severity: 'medium' },
  { value: 'caterpillar', label: 'کرم', severity: 'high' },
  { value: 'mildew', label: 'سفیدک', severity: 'medium' },
  { value: 'mite', label: 'کنه', severity: 'low' },
];

// استفاده:
<SelectField label="محصول" options={CROPS} value={cropType} onChange={setCropType} />
<SelectField label="نوع آفت" options={PESTS} value={pestType} onChange={setPestType} />
```

### P1-PT۹: AI Identification (اختیاری ولی جذاب)
```tsx
import { Sparkles, Loader2 } from 'lucide-react';

<button
  type="button"
  onClick={async () => {
    if (images.length === 0) return;
    setIdentifying(true);
    try {
      const formData = new FormData();
      formData.append('image', images[0]);
      const res = await api.post('/pests/identify', formData);
      setPestType(res.pestType);
      setSeverity(res.severity);
    } finally {
      setIdentifying(false);
    }
  }}
  disabled={images.length === 0 || identifying}
  className="
    w-full py-3
    bg-gradient-to-l from-purple-500 to-purple-600
    text-white rounded-xl
    flex items-center justify-center gap-2
    disabled:opacity-50
    shadow-glow
  "
>
  {identifying ? (
    <><Loader2 className="animate-spin" size={18} /> در حال شناسایی...</>
  ) : (
    <><Sparkles size={18} /> شناسایی با AI</>
  )}
</button>
```

## 🟢 مشکلات P2 (اختیاری)

### P2-PT۱۰: Risk Status بیشتر
```tsx
const RISK_TYPES = [
  { id: 'heat', label: 'تنش گرمایی', icon: Thermometer, level: 'medium' },
  { id: 'fungal', label: 'قارچی', icon: Cloud, level: 'low' },
  { id: 'pest', label: 'آفت رایج', icon: Bug, level: 'medium' },
  { id: 'humidity', label: 'رطوبت بالا', icon: Droplet, level: 'low' },
];
```

### P2-PT۱۱: Stats بالای صفحه
```tsx
function PestStats({ stats }: { stats: PestStats }) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      <StatBox label="کل" value={stats.total} />
      <StatBox label="کم" value={stats.low} color="text-green-600" />
      <StatBox label="شدید" value={stats.high} color="text-orange-600" />
      <StatBox label="بحرانی" value={stats.critical} color="text-red-600" />
    </div>
  );
}
```

### P2-PT۱۲: Empty State
```tsx
function PestsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <Bug className="text-red-600" size={40} />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">
        هنوز گزارشی نداری!
      </h2>
      <p className="text-text-secondary mb-6 max-w-sm mx-auto">
        برای شروع، اولین مشاهده آفت رو ثبت کن
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl shadow-glow"
      >
        <Plus size={20} />
        ثبت اولین گزارش
      </button>
    </div>
  );
}
```

### P2-PT۱۳: فیلتر
```tsx
import { Filter } from 'lucide-react';

const [filter, setFilter] = useState<{ farmId?: string; severity?: string }>({});

<button onClick={() => setShowFilters(true)}>
  <Filter size={16} />
  فیلتر
</button>

{filter.farmId && <span>مزرعه: {farmName}</span>}
{filter.severity && <span>شدت: {severityLabel}</span>}
```

## 🔧 دستورالعمل کلی

1. **همه متن‌ها فارسی**
2. **همه ایموجی lucide**
3. **همه کارت‌ها border + glow**
4. **انتخاب زمین اجباری**
5. **Severity slider با ۴ سطح**
6. **آپلود عکس با preview**

## ✅ معیار پذیرش

- [ ] همه متن‌ها فارسی
- [ ] انتخاب زمین کار می‌کند
- [ ] Severity slider با ۴ سطح
- [ ] آپلود عکس با preview
- [ ] همه ایموجی lucide
- [ ] همه کارت‌ها border + glow
- [ ] در شب contrast
- [ ] لیست گزارش‌ها با thumbnail
- [ ] Detail modal با delete/edit
- [ ] Build بدون خطا

## 📝 خروجی

- Branch: `fix/ui-pests`
- Commit: `fix(ui): اصلاح ۱۳ مشکل Pests`
- PR
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `pest-screen.tsx` | همه ۱۳ مشکل |
| `pest-detail-modal.tsx` (جدید) | مودال جزئیات |
```

---

**🚀 این پرامپت را مستقیم به Cline بده!**
