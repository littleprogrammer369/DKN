# ✅ چک‌لیست صفحه Register (توسط Cline پر شود)

---

## 🔴 P0 — بحرانی

- [ ] **P0-R۱**: پرچم +۹۸ به سمت چپ منتقل شد
  - فایل: `apps/web/src/components/screens/register-screen.tsx`
  - تغییر: `right-3` → `left-3` یا flex-row
  - تست: در روز و شب، پرچم چپ باشد

- [ ] **P0-R۲**: تفکیک بصری فیلدها در روز
  - تغییر: اضافه `border border-border` و `bg-bg-base`
  - تست: فیلدها در روز از هم جدا باشند

## 🟡 P1 — مهم

- [ ] **P1-R۳**: نصب و استفاده از lucide-react
  - تغییر: جایگزینی ایموجی با آیکون
  - آیکون‌ها: `User`, `Lock`, `UserPlus`, `LogIn`, `CheckCircle2`, `AlertCircle`

- [ ] **P1-R۴**: Password Strength Indicator
  - تغییر: progress bar با ۳ سطح
  - تست: تایپ رمز، bar update شود

- [ ] **P1-R۵**: Match Validation رمزها
  - تغییر: وقتی هر دو پر، match check
  - تست: رمز متفاوت، پیام قرمز؛ یکسان، پیام سبز

## 🟢 P2 — اختیاری

- [ ] **P2-R۶**: نمایش/مخفی رمز
  - تغییر: دکمه چشم در فیلد رمز
  - تست: کلیک چشم، رمز visible/hidden شود

- [ ] **P2-R۷**: Privacy/Terms Checkbox
  - تغییر: چک‌باکس با لینک terms/privacy
  - تست: بدون تیک، دکمه ثبت‌نام disabled

- [ ] **P2-R۸**: Helper Text زیر فیلدها
  - تغییر: helper text زیر نام‌کاربری و تلفن
  - تست: helper text نمایش داده شود

- [ ] **P2-R۹**: Real-time Username Check
  - تغییر: debounced query به `/users/check-username`
  - نصب: `pnpm --filter web add react-hook-form @hookform/resolvers zod`
  - تست: تایپ، بعد ۵۰۰ms status نمایش داده شود

- [ ] **P2-R۱۰**: Success Animation
  - تغییر: motion.div با چک‌مارک و redirect
  - تست: ثبت‌نام موفق، animation نمایش داده شود و بعد ۲ ثانیه redirect

---

## 🧪 Build و تست

- [ ] `pnpm --filter web type-check` بدون خطا
- [ ] `pnpm --filter web build` بدون خطا
- [ ] تست در روز (light mode)
- [ ] تست در شب (dark mode)
- [ ] تست در mobile (375px)
- [ ] تست password strength
- [ ] تست match validation
- [ ] تست username check
- [ ] تست success animation
- [ ] تست terms checkbox (disabled)

---

## 📊 آمار نهایی

| وضعیت | تعداد |
|-------|-------|
| ✅ تکمیل شده | ? |
| ⏳ در حال انجام | ? |
| ❌ شروع نشده | ? |

---

## 📝 یادداشت Cline

```
[تاریخ] - [توضیح]
```

---

**🚀 وقتی همه آیتم‌ها تکمیل شد، PR ایجاد کن!**
