# ✅ چک‌لیست صفحه Dashboard (توسط Cline پر شود)

---

## 🔴 P0 — بحرانی

- [ ] **P0-D۱**: همه متن‌ها فارسی شدن
  - فایل: `apps/web/src/components/screens/dashboard-screen.tsx`
  - تغییر: Wind → باد، Humidity → رطوبت، Temp → دما، Weather → آب و هوا، Day Forecast-5 → پیش‌بینی ۵ روز آینده، Alerts & Recommendations → هشدارها و توصیه‌ها، Ask AI for advice → از AI مشورت بگیر
  - نام روزها: Monday → دوشنبه، ...
  - تست: در روز و شب، همه فارسی باشند

- [ ] **P0-D۲**: contrast در شب بهتر شد
  - فایل: `globals.css` یا tailwind config
  - تغییر: متن secondary در شب روشن‌تر
  - تست: در شب، همه متن‌ها خوانا باشند

- [ ] **P0-D۳**: Welcome bug رفع شد
  - تغییر: "تست سلامت:" → user.firstName یا "کشاورز عزیز"
  - تست: با کاربر واقعی، اسم درست نمایش داده شود

## 🟡 P1 — مهم

- [ ] **P1-D۴**: Glow effect روی border
  - فایل: `tailwind.config.ts`
  - تغییر: اضافه shadow-glow به theme.extend.boxShadow
  - تست: کارت‌ها در روز و شب glow داشته باشند

- [ ] **P1-D۵**: Weather card بهتر شد
  - تغییر: آیکون بزرگ + دما + لیست details
  - استفاده از Sun, Wind, Droplets, Thermometer از lucide
  - تست: card زیباتر و خواناتر باشد

- [ ] **P1-D۶**: Forecast بهتر شد
  - تغییر: horizontal scroll با کارت‌های جدا
  - استفاده از Sun, Cloud, CloudRain
  - تست: scrollable، responsive

- [ ] **P1-D۷**: Quick actions = آیکون + فارسی
  - تغییر: نام انگلیسی بالای کارت‌ها حذف، آیکون + فارسی جایگزین
  - استفاده از Bug, Droplet, Sparkles, Sprout
  - تست: کارت‌ها زیباتر، بدون متن انگلیسی

## 🟢 P2 — اختیاری

- [ ] **P2-D۸**: Welcome header بهتر
  - تغییر: دو خط، "خوش آمدی" + اسم بزرگ
  - تست: visual خوب

- [ ] **P2-D۹**: "X روز پیش" real-time
  - تغییر: useRelativeTime hook، هر دقیقه update
  - تست: بعد از ۱ دقیقه update شود

- [ ] **P2-D۱۰**: Empty state
  - تغییر: اگه farm نیست، empty state با CTA
  - تست: بدون farm، empty state نمایش داده شود

- [ ] **P2-D۱۱**: Loading state
  - تغییر: Skeleton هنگام fetch
  - تست: slow network، Skeleton نمایش داده شود

---

## 🧪 Build و تست

- [ ] `pnpm --filter web type-check` بدون خطا
- [ ] `pnpm --filter web build` بدون خطا
- [ ] تست در روز (light mode)
- [ ] تست در شب (dark mode)
- [ ] تست در mobile (375px)
- [ ] تست همه متن‌ها فارسی
- [ ] تست contrast در شب
- [ ] تست glow effect
- [ ] تست forecast scroll
- [ ] تست empty state

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
