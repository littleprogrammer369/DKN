# ✅ چک‌لیست صفحه Login (توسط Cline پر شود)

> **این فایل را Cline بعد از اتمام هر task به‌روز کند.**
> **هر آیتم تکمیل شده = [x]، ناقص = [-]، شروع نشده = [ ]**

---

## 🔴 P0 — بحرانی

- [ ] **P0-L۱**: پرچم +۹۸ به سمت چپ منتقل شد
  - فایل: `apps/web/src/components/screens/login-screen.tsx`
  - تغییر: `right-3` → `left-3` یا استفاده از flex-row
  - تست: در روز و شب، پرچم چپ باشد

- [ ] **P0-L۲**: تفکیک بصری فیلدها در روز
  - فایل: همان
  - تغییر: اضافه `border border-border` و `bg-bg-base` به هر فیلد
  - تست: در روز، فیلدها از هم جدا و واضح باشند

## 🟡 P1 — مهم

- [ ] **P1-L۳**: نصب و استفاده از lucide-react
  - فایل: `apps/web/package.json`
  - تغییر: `pnpm --filter web add lucide-react`
  - تغییر در screen: جایگزینی 🔑 → `<Key />`، 📧 → `<Mail />`، 👤 → `<UserPlus />`، 🔒 → `<Lock />`

- [ ] **P1-L۴**: Tab Indicator با animation
  - فایل: همان
  - تغییر: استفاده از `motion.div` با `framer-motion` برای sliding
  - نصب: `pnpm --filter web add framer-motion`
  - تست: با کلیک بین دو tab، indicator slide کند

- [ ] **P1-L۵**: OTP Input Boxes (۵ رقم جدا)
  - فایل: همان
  - تغییر: ۵ input جداگانه با auto-focus و paste support
  - تست: تایپ کد، بین input ها جابجا شود؛ paste هم کار کند

## 🟢 P2 — اختیاری

- [ ] **P2-L۶**: Loading و Error states
  - تغییر: spinner در دکمه، banner قرمز بالای فرم
  - تست: خطای mock، banner نمایش داده شود

- [ ] **P2-L۷**: لینک فراموشی رمز عبور
  - تغییر: `<Link href="/forgot-password">` زیر فیلد رمز
  - تست: کلیک، navigate کند

- [ ] **P2-L۸**: RTL/LTR Mixing در فیلد تلفن
  - تغییر: `dir="ltr"`, `inputMode="numeric"`, `font-feature-settings-tnum`
  - تست: اعداد چپ‌چین، placeholder فارسی

- [ ] **P2-L۹**: Bottom link خواناتر
  - تغییر: متن کامل با font-semibold روی "هوش مصنوعی" و "تصاویر ماهواره‌ای"
  - تست: در روز و شب خوانا باشد

---

## 🧪 Build و تست

- [ ] `pnpm --filter web type-check` بدون خطا
- [ ] `pnpm --filter web build` بدون خطا
- [ ] تست در روز (light mode)
- [ ] تست در شب (dark mode)
- [ ] تست در mobile viewport (375px)
- [ ] تست Tab کلیک بین password و OTP
- [ ] تست paste در OTP input
- [ ] تست +۹۸ در سمت چپ

---

## 📊 آمار نهایی

| وضعیت | تعداد |
|-------|-------|
| ✅ تکمیل شده | ? |
| ⏳ در حال انجام | ? |
| ❌ شروع نشده | ? |

---

## 📝 یادداشت Cline

> **هر گونه مشکل، سؤال، یا نکته‌ای که در حین کار بهش برخوردی، اینجا بنویس:**

```
[تاریخ] - [توضیح مختصر]

مثلاً:
[2026-07-08] - framer-motion با Tailwind conflict داشت، مجبور شدم از CSS animation استفاده کنم
```

---

**🚀 وقتی همه آیتم‌ها تکمیل شد، PR ایجاد کن!**
