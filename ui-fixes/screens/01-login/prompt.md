# 🤖 پرامپت Cline — اصلاح UI صفحه Login (ورود)

> **این پرامپت را در Cline CLI اجرا کنید تا ۹ مشکل صفحه ورود برطرف شود.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۹ مشکل UI در صفحه Login (apps/web/src/components/screens/login-screen.tsx).

## Context
- پروژه: DKN (داده کشت نوین)
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: apps/web/src/components/screens/login-screen.tsx
- کتابخانه آیکون: lucide-react (نصب کن اگه نیست: pnpm add lucide-react)

## ❌ مشکلات P0 (بحرانی)

### P0-L۱: جابجایی پرچم +۹۸ از راست به چپ
**مشکل:** الان پرچم "+۹۸" در سمت راست input است. باید در سمت چپ باشد.
**دلیل:** در شماره‌های بین‌المللی، country code در ابتدا می‌آید. در RTL نیز prefix باید چپ باشد.

**راه‌حل:**
```tsx
// قبل:
// <div className="absolute right-3 ...">+۹۸</div>

// بعد:
// <div className="absolute left-3 ...">+۹۸</div>

// یا اگر از grid استفاده می‌کنی:
// <div className="flex flex-row">
//   <span className="... +۹۸ ..." /> // سمت چپ
//   <input className="flex-1" />
// </div>
```

### P0-L۲: تفکیک بصری فیلدها در روز
**مشکل:** در حالت روز، فیلدها یکپارچه و بدون مرز هستند. در شب با border جدا هستند.
**هدف:** در روز هم باید فیلدها از هم جدا و قابل تشخیص باشند.

**راه‌حل:**
```tsx
// استفاده از border + background متفاوت برای هر فیلد:

<div className="space-y-3"> {/* فاصله بین فیلدها */}
  <div className="
    bg-bg-base               /* background متفاوت از card */
    border border-border     /* border */
    rounded-xl               /* گردی */
    px-4 py-3                /* padding داخلی */
    focus-within:border-primary
    focus-within:ring-2 focus-within:ring-primary/20
    transition-all
  ">
    <input className="w-full bg-transparent ..." />
  </div>
  <div className="bg-bg-base border border-border rounded-xl px-4 py-3 ...">
    {/* فیلد بعدی */}
  </div>
</div>

// توجه: حتی اگر الان بدون border است، در روز هم border نازک بگذار
// border-gray-200 در روز، border-white/10 در شب
```

## 🟡 مشکلات P1 (مهم)

### P1-L۳: جایگزینی ایموجی با آیکون (Lucide)
**مشکل:** استفاده از 🔑، 📧، 👤، 🔒 حس قدیمی می‌دهد.
**هدف:** استفاده از آیکون‌های مدرن lucide-react.

**راه‌حل:**
```tsx
import { Key, Mail, Lock, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';

// قبل:
// 🔑 رمز عبور
// 📧 کد تایید
// 👤 حساب ندارید
// 🔒 رمز عبور

// بعد:
// <Key size={16} className="inline ml-1" /> رمز عبور
// <Mail size={16} className="inline ml-1" /> کد تایید
// <UserPlus size={16} className="inline ml-1" /> حساب ندارید
// <Lock size={16} className="inline ml-1" /> رمز عبور

// نکته: آیکون‌ها باید size=16 یا 18 باشند (نه خیلی بزرگ)
// رنگ: text-text-secondary یا text-primary (نه خیلی پررنگ)
```

### P1-L۴: Tab Indicator بهتر (Slider Animation)
**مشکل:** Tab فعال فقط background متفاوت دارد.
**هدف:** indicator زیر tab با animation.

**راه‌حل:**
```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');

<div className="relative flex bg-bg-base rounded-full p-1 border border-border">
  {['password', 'otp'].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`
        relative z-10 flex-1 py-2 px-3 rounded-full text-sm font-medium
        transition-colors
        ${activeTab === tab ? 'text-white' : 'text-text-secondary'}
      `}
    >
      {tab === 'password' ? (
        <span className="flex items-center justify-center gap-1.5">
          <Key size={14} />
          رمز عبور
        </span>
      ) : (
        <span className="flex items-center justify-center justify-center gap-1.5">
          <Mail size={14} />
          کد تایید (OTP)
        </span>
      )}
    </button>
  ))}

  {/* Sliding indicator */}
  <motion.div
    className="absolute top-1 bottom-1 w-1/2 bg-primary rounded-full"
    animate={{
      x: activeTab === 'otp' ? '100%' : '0%',
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    style={{ right: 0 }} // RTL: از راست شروع می‌شود
  />
</div>
```

### P1-L۵: OTP Input Boxes (۵ رقم جداگانه)
**مشکل:** فیلد OTP فقط یک input بزرگ است.
**هدف:** ۵ input کوچک جداگانه برای هر رقم.

**راه‌حل:**
```tsx
import { useRef, useState, KeyboardEvent, ChangeEvent } from 'react';

const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '']);
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

const handleOtpChange = (index: number, value: string) => {
  if (!/^\d*$/.test(value)) return; // فقط عدد

  const newDigits = [...otpDigits];
  newDigits[index] = value.slice(-1); // فقط آخرین رقم
  setOtpDigits(newDigits);

  // auto-focus به بعدی
  if (value && index < 4) {
    inputRefs.current[index + 1]?.focus();
  }
};

const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};

const handleOtpPaste = (e: ClipboardEvent) => {
  const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
  if (pasted.length === 5) {
    setOtpDigits(pasted.split(''));
    inputRefs.current[4]?.focus();
  }
};

// JSX:
<div className="flex gap-2 justify-center" dir="ltr">
  {otpDigits.map((digit, i) => (
    <input
      key={i}
      ref={(el) => (inputRefs.current[i] = el)}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={digit}
      onChange={(e) => handleOtpChange(i, e.target.value)}
      onKeyDown={(e) => handleOtpKeyDown(i, e)}
      onPaste={handleOtpPaste}
      className="
        w-12 h-14 text-center text-2xl font-bold
        bg-bg-base border-2 border-border rounded-xl
        focus:border-primary focus:ring-2 focus:ring-primary/20
        focus:outline-none transition-all
      "
    />
  ))}
</div>

// برای RTL: در نمایش، از راست به چپ نشان داده می‌شود (با CSS direction)
// ولی value و onChange LTR هستند
```

## 🟢 مشکلات P2 (اختیاری ولی توصیه می‌شود)

### P2-L۶: Loading/Error States
**راه‌حل:**
```tsx
import { Loader2 } from 'lucide-react';

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

{error && (
  <div className="
    bg-red-50 dark:bg-red-900/20 
    border border-red-200 dark:border-red-800
    rounded-xl p-3 mb-3
    flex items-start gap-2
  ">
    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
    <div className="flex-1">
      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
      <button onClick={() => setError(null)} className="text-xs text-red-600 underline mt-1">
        تلاش مجدد
      </button>
    </div>
  </div>
)}

<button
  disabled={loading}
  className="w-full bg-primary text-white py-3 rounded-xl ..."
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <Loader2 className="animate-spin" size={18} />
      در حال ورود...
    </span>
  ) : (
    <span className="flex items-center justify-center gap-2">
      <ArrowLeft size={18} />
      ورود
    </span>
  )}
</button>
```

### P2-L۷: فراموشی رمز عبور
**راه‌حل:**
```tsx
<Link href="/forgot-password" className="text-sm text-text-secondary hover:text-primary text-center block mt-2">
  رمز عبور خود را فراموش کردید؟
</Link>
```

### P2-L۸: RTL/LTR Mixing در فیلد تلفن
**راه‌حل:**
```tsx
// Input تلفن: اعداد LTR، ولی placeholder فارسی
<input
  type="tel"
  dir="ltr"
  inputMode="numeric"
  placeholder="۹۱۲۳۴۵۶۷۸۹"
  className="text-left font-feature-settings-tnum"
/>

// font-feature-settings-tnum = اعداد هم‌عرض (tabular numerals)
```

### P2-L۹: Bottom link "با استفاده از فناوری..."
**راه‌حل:**
```tsx
// متن کامل و خوانا:
<p className="text-center text-sm text-text-secondary mt-6 leading-relaxed">
  با استفاده از فناوری <span className="font-semibold">هوش مصنوعی</span> و{' '}
  <span className="font-semibold">تصاویر ماهواره‌ای</span>، کشاورزی مطمئن داشته باشید.
</p>
```

## 🔧 دستورالعمل کلی

1. **اول lucide-react رو نصب کن:** `pnpm --filter web add lucide-react`
2. **اگر framer-motion نصب نیست:** `pnpm --filter web add framer-motion` (برای tab animation)
3. **هر تغییر را جداگانه commit کن** (atomic commits)
4. **بعد از تغییرات، build کن:** `pnpm --filter web type-check && pnpm --filter web build`
5. **طراحی RTL و Glass morphism حفظ شود**
6. **Day/Night mode برای همه المان‌ها تست شود**

## ✅ معیار پذیرش

- [ ] +۹۸ در سمت چپ input است
- [ ] فیلدها در روز هم border دارند و از هم جدا هستند
- [ ] همه ایموجی‌ها با آیکون lucide جایگزین شدن
- [ ] Tab indicator با animation slide می‌کند
- [ ] OTP ۵ input جداگانه با auto-focus دارد
- [ ] Loading و error states کار می‌کنند
- [ ] Build بدون خطا

## 📝 خروجی مورد انتظار

- Branch: `fix/ui-login-page`
- Commit: `fix(ui): اصلاح ۹ مشکل صفحه Login`
- PR: لینک GitHub
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `login-screen.tsx` | همه ۹ مشکل |
| `tailwind.config.ts` | اگه نیاز به token جدید (font-feature-settings-tnum) |
| `package.json` | اضافه lucide-react و framer-motion |

---

**🚀 این پرامپت را مستقیم به Cline بده!**
