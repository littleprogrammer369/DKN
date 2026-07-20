# 🤖 پرامپت Cline — اصلاح UI صفحه Farms List (لیست زمین‌ها)

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۱۰ مشکل UI در صفحه Farms List (apps/web/src/components/screens/farms-screen.tsx).

## Context
- پروژه: DKN (داده کشت نوین)
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: apps/web/src/components/screens/farms-screen.tsx
- کامپوننت مشترک: `apps/web/src/components/layout/bottom-nav.tsx` (ایکون‌ها)
- کتابخانه: lucide-react

## ❌ مشکلات P0 (بحرانی)

### P0-FL۱: جایگزینی "del" و "edit" با آیکون
**مشکل:** دکمه‌های ویرایش و حذف به صورت متن "del" "edit" هستند.
**هدف:** استفاده از آیکون lucide-react.

**راه‌حل:**
```tsx
import { Pencil, Trash2, MoreVertical } from 'lucide-react';

// در کارت farm:
// قبل:
// <button>del</button>
// <button>edit</button>

// بعد:
<div className="flex items-center gap-1">
  <button
    onClick={(e) => { e.stopPropagation(); onEdit(farm); }}
    className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-primary transition-colors"
    aria-label="ویرایش"
  >
    <Pencil size={16} />
  </button>
  <button
    onClick={(e) => { e.stopPropagation(); onDelete(farm); }}
    className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-red-600 transition-colors"
    aria-label="حذف"
  >
    <Trash2 size={16} />
  </button>
  <button
    onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
    className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary transition-colors"
    aria-label="بیشتر"
  >
    <MoreVertical size={16} />
  </button>
</div>
```

### P0-FL۲: contrast در شب
**مشکل:** متن‌ها در شب ناخوانا.
**هدف:** contrast مناسب.

**راه‌حل:**
```tsx
// در globals.css یا tailwind.config:
.dark {
  --text-secondary: rgba(255, 255, 255, 0.85);
  --text-tertiary: rgba(255, 255, 255, 0.65);
}

// در کامپوننت:
// label: text-text-secondary (روشن در شب)
// value: text-text-primary (سفید در شب)
// border: border-border/50 dark:border-white/10
```

### P0-FL۳: فارسی کردن متن‌ها
**راه‌حل:**
```tsx
// قبل:
// <h1>My Farms</h1>
// <p>Manage Farms</p>
// <button>New Farm +</button>

// بعد:
<h1>زمین‌های من</h1>
<p className="text-text-secondary">مدیریت مزارع</p>

// دکمه:
<button>
  <Plus size={18} />
  ساخت مزرعه جدید
</button>

// در کارت:
// "1 crop" → "۱ محصول"
// "ha 1 - 1" → "۱.۱ هکتار"
```

### P0-FL۴: Layout کارت درست
**مشکل:** همه چیز در یه ردیف فشرده.
**هدف:** کارت با ساختار منظم.

**راه‌حل:**
```tsx
import { Wheat, Droplet, MoreVertical, Pencil, Trash2 } from 'lucide-react';

const CROP_ICONS = {
  wheat: Wheat,
  corn: Sprout,
  pistachio: TreePine,
  // ...
};

function FarmCard({ farm, onEdit, onDelete }: { farm: Farm; onEdit: () => void; onDelete: () => void }) {
  const CropIcon = CROP_ICONS[farm.cropType] ?? Sprout;

  return (
    <div
      className="
        bg-bg-elevated 
        border border-border 
        rounded-2xl p-4
        shadow-glow
        hover:shadow-glow-lg
        hover:scale-[1.01]
        transition-all
        cursor-pointer
      "
      onClick={() => router.push(`/farms/${farm.id}`)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <CropIcon className="text-green-600" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate">
              {farm.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {farm.cropName} • {farm.area} هکتار
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 rounded-lg hover:bg-bg-base text-text-secondary hover:text-primary"
            aria-label="ویرایش"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-lg hover:bg-bg-base text-text-secondary hover:text-red-600"
            aria-label="حذف"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Health Score Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">سلامت</span>
          <span className={`font-medium ${
            farm.healthScore >= 80 ? 'text-green-600' :
            farm.healthScore >= 50 ? 'text-amber-600' :
            'text-red-600'
          }`}>
            {farm.healthScore}٪
          </span>
        </div>
        <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              farm.healthScore >= 80 ? 'bg-green-500' :
              farm.healthScore >= 50 ? 'bg-amber-500' :
              'bg-red-500'
            }`}
            style={{ width: `${farm.healthScore}%` }}
          />
        </div>
      </div>

      {/* Status Badge */}
      {farm.status !== 'healthy' && (
        <div className="mt-3 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-md inline-block">
          نیاز به توجه
        </div>
      )}
    </div>
  );
}
```

### P0-FL۵: رفع bug "1 - 1 هکتار"
**راه‌حل:**
```tsx
// در data formatting:
function formatArea(area: number): string {
  return `${area.toLocaleString('fa-IR')} هکتار`;
}

// استفاده:
<p>{formatArea(farm.area)}</p> // "۱.۱ هکتار" نه "1 - 1 هکتار"

// اگه number مثل "1.1" ذخیره شده ولی اشتباه نمایش داده می‌شه:
// بررسی کن farm.area چی هست. شاید split('-') اشتباه باشه.
```

## 🟡 مشکلات P1 (مهم)

### P1-FL۶: Glow Effect (همان dashboard)
```tsx
// box-shadow glow در tailwind.config (همان قبل)
```

### P1-FL۷: Empty State
```tsx
import { Sprout, Plus } from 'lucide-react';
import Link from 'next/link';

function FarmsEmptyState() {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <Sprout className="text-green-600" size={40} />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">
        هنوز مزرعه‌ای نداری!
      </h2>
      <p className="text-text-secondary mb-6 max-w-sm mx-auto">
        برای شروع، اولین مزرعه‌ات رو بساز. می‌تونی محصول، مساحت و موقعیت جغرافیایی رو مشخص کنی.
      </p>
      <Link
        href="/farms/create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 shadow-glow"
      >
        <Plus size={20} />
        ساخت اولین مزرعه
      </Link>
    </div>
  );
}
```

### P1-FL۸: Stats Summary بالای صفحه
```tsx
function FarmsStats({ farms }: { farms: Farm[] }) {
  const total = farms.length;
  const healthy = farms.filter(f => f.healthScore >= 80).length;
  const attention = farms.filter(f => f.healthScore < 50 || f.status !== 'healthy').length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <StatCard icon="🌾" label="کل" value={total.toLocaleString('fa-IR')} />
      <StatCard icon="✅" label="سالم" value={healthy.toLocaleString('fa-IR')} color="text-green-600" />
      <StatCard icon="⚠️" label="نیاز به توجه" value={attention.toLocaleString('fa-IR')} color="text-amber-600" />
    </div>
  );
}
```

## 🟢 مشکلات P2 (اختیاری)

### P2-FL۹: Search/Filter
```tsx
import { Search, Filter } from 'lucide-react';

const [search, setSearch] = useState('');
const [cropFilter, setCropFilter] = useState<string | null>(null);

<div className="relative mb-4">
  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="جستجو..."
    className="w-full pr-10 pl-4 py-2 bg-bg-elevated border border-border rounded-xl"
  />
</div>
```

### P2-FL۱۰: Swipe Actions
```tsx
// استفاده از react-swipeable-list یا framer-motion
import { motion, useMotionValue } from 'framer-motion';

const x = useMotionValue(0);

<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 0 }}
  style={{ x }}
>
  <FarmCard ... />
</motion.div>
```

## 🔧 دستورالعمل کلی

1. **همه ایموجی با lucide-react**
2. **همه متن‌ها فارسی**
3. **Glow effect** روی همه کارت‌ها
4. **Edit/Delete** به صورت آیکون
5. **Tap → detail**

## ✅ معیار پذیرش

- [ ] Edit/Delete ایکون هستند (Pencil, Trash2)
- [ ] در شب، متن‌ها خوانا
- [ ] همه متن‌ها فارسی
- [ ] Layout کارت منظم
- [ ] "1.1 هکتار" نه "1 - 1 هکتار"
- [ ] Glow effect
- [ ] Empty state
- [ ] Stats summary
- [ ] Build بدون خطا

## 📝 خروجی

- Branch: `fix/ui-farms-list`
- Commit: `fix(ui): اصلاح ۱۰ مشکل Farms List`
- PR
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `farms-screen.tsx` | همه ۱۰ مشکل |
| `bottom-nav.tsx` | lucide icons |
| `tailwind.config.ts` | glow |

---

**🚀 این پرامپت را مستقیم به Cline بده!**
