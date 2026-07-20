# 📝 نکته‌های صفحه Dashboard (داشبورد)

> **صفحه:** `apps/web/src/components/screens/dashboard-screen.tsx`
> **تاریخ بررسی:** ۲۰۲۶-۰۷-۰۸

---

## 🔴 نکته‌های شما (کاربر)

### ۱. در روز: همه چی خوبه، فقط باید فارسی بشه
- "Weather", "Wind", "Humidity", "Temp" → فارسی
- "Last irrigation: 6 days ago" → فارسی
- "Day Forecast- 5" → فارسی
- "Alerts & Recommendations" → فارسی
- "Ask AI for advice" → فارسی
- "pest", "water", "ai", "farm" (نام quick actions) → فارسی یا آیکون

### ۲. در شب: رنگ متن‌ها با زمینه یکی می‌شه
- متن‌های کارت‌ها (Wind, Humidity, Temp) خیلی کم‌رنگ
- alert⚠️ اصلاً خونده نمی‌شه
- روز پاک خوبه ولی شب فاجعه‌ست

### ۳. پیشنهاد: border با هایلایت (glow)
- دور کارت‌ها یه glow یا shadow ملایم باشه
- کلاسیک‌تر و زیباتر
- تفکیک بصری بهتر

### ۴. Weather و Forecast رو بهتر نمایش بدیم
- الان ساده و خشکه
- چشم‌نوازتر، خواناتر، قابل فهم برای همه

### ۵. Welcome + اسم کاربر
- الان "Welcome تست سلامت:" با ":" و emoji
- می‌شه بهتر نمایش داد

---

## 🔵 نکته‌های من (AI)

### ۶. Bug: "تست سلامت:" در Welcome
- این یه bug در داده تست هست — username placeholder
- باید از `user.firstName` واقعی استفاده بشه
- یا حداقل "کشاورز عزیز"

### ۷. "1 farm" + "ha 1 - 1"
- "1 farm" → "۱ مزرعه"
- "ha 1 - 1" → "۱.۱ هکتار" (مثلاً "۱.۱ هکتار" با proper formatting)
- یا "مساحت کل: ۱.۱ هکتار"

### ۸. "alert⚠️6 days since last irrigation"
- emoji قبل از متن، نه وسط
- متن کامل: "⚠️ هشدار: ۶ روز از آخرین آبیاری گذشته"
- رنگ متن در شب: باید روشن و خوانا باشه

### ۹. Quick Actions: نام‌ها انگلیسی‌اند
- "pest" / "water" / "ai" / "farm"
- زیرش فارسی: "Pests" / "Irrigation" / "AI Assistant" / "Farms"
- بهتره: حذف انگلیسی بالا، استفاده از **آیکون + فارسی**
  - 🐛 آفات (با آیکون Bug)
  - 💧 آبیاری (با آیکون Droplet)
  - ✨ دستیار AI (با آیکون Sparkles)
  - 🌾 زمین‌ها (با آیکون Sprout)

### ۱۰. Bottom Nav: ۵ آیتم (نبود Profile)
- الان: پروفایل، آفات، آبیاری، دستیار، زمین‌ها، داشبورد
- ولی "پروفایل" باید فعال باشه وقتی توی dashboard نیستیم
- در dashboard، داشبورد فعال (درست)
- ولی وقتی توی صفحات دیگه‌ای، Profile نیست!

### ۱۱. Weather Card — نمایش بهتر
پیشنهاد: استفاده از **icon بزرگ هوا** + دما + جزئیات:

```
┌─────────────────────────────────────┐
│  ☀️ آب و هوا                        │
│  ─────────────────                  │
│     32°                              │
│     آفتابی                           │
│  باد: ۱۲ km/h                        │
│  رطوبت: ۲۸٪                         │
│  آخرین آبیاری: ۶ روز پیش            │
└─────────────────────────────────────┘
```

### ۱۲. 5-Day Forecast — بهتر
پیشنهاد: **scrollable horizontal list** با هر روز یه کارت:

```
┌─────────────────────────────────────────┐
│  پیش‌بینی ۵ روز آینده                   │
│  ─────────────────                       │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐             │
│  │شن│ │یک│ │دو│ │سه│ │چه│             │
│  │☀️│ │⛅│ │🌧│ │☀️│ │⛅│             │
│  │۳۸│ │۳۶│ │۳۵│ │۳۸│ │۳۳│             │
│  │۰٪│ │۱٪│ │۱٪│ │۰٪│ │۰٪│             │
│  └──┘ └──┘ └──┘ └──┘ └──┘             │
└─────────────────────────────────────────┘
```

### ۱۳. Glow Effect روی Border
```css
/* tailwind config یا CSS */
.glow-card {
  box-shadow: 0 0 20px -5px rgba(16, 185, 129, 0.15);
  /* یا */
  box-shadow: 
    0 0 0 1px rgba(16, 185, 129, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
}

/* در شب */
.dark .glow-card {
  box-shadow: 
    0 0 0 1px rgba(16, 185, 129, 0.2),
    0 0 30px -5px rgba(16, 185, 129, 0.15);
}
```

### ۱۴. Contrast در شب
```css
/* رنگ متن secondary در شب باید روشن‌تر باشه */
.dark .text-text-secondary {
  color: rgba(255, 255, 255, 0.75); /* نه 0.5 */
}

/* یا استفاده از opacity به جای رنگ کم‌رنگ */
.dark .label {
  color: white;
  opacity: 0.85;
}
```

### ۱۵. Welcome Header — بهتر
پیشنهاد:
```tsx
<div>
  <p className="text-sm text-text-secondary">خوش آمدی 👋</p>
  <h1 className="text-2xl font-bold text-text-primary">
    {user?.firstName ?? 'کشاورز عزیز'}
  </h1>
</div>
```

### ۱۶. Real-time Updates
- "6 days ago" باید real-time باشه (هر دقیقه update)
- یا حداقل روزی یه بار

### ۱۷. Loading States
- وقتی data fetch می‌شه، Skeleton نشون بده
- نه empty card

### ۱۸. Empty States
- اگه farm نداره:
  - "🌱 هنوز مزرعه‌ای نداری"
  - دکمه "اولین مزرعه رو بساز"

### ۱۹. Responsive
- در mobile (375px)، quick actions در 2 column
- در tablet، 4 column

---

## 🎯 اولویت‌بندی

| # | موضوع | اولویت |
|---|--------|---------|
| ۱ | فارسی کردن همه متن‌ها | 🔴 P0 |
| ۲ | رفع contrast در شب | 🔴 P0 |
| ۳ | رفع bug "تست سلامت:" | 🔴 P0 |
| ۴ | Glow روی border | 🟡 P1 |
| ۵ | Weather card بهتر | 🟡 P1 |
| ۶ | Forecast card بهتر | 🟡 P1 |
| ۷ | Quick action ها = آیکون + فارسی | 🟡 P1 |
| ۸ | Welcome header بهتر | 🟢 P2 |
| ۹ | Empty states | 🟢 P2 |
| ۱۰ | Real-time "ago" | 🟢 P2 |

---

## ✅ جمع‌بندی

**۱۹ موضوع** شناسایی شد:
- 🔴 P0: ۳ مورد (فارسی، contrast، bug)
- 🟡 P1: ۴ مورد
- 🟢 P2: ۴ مورد

---

**🚀 آماده ساخت prompt و checklist...**
