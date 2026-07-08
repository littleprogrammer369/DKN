# 📝 نکته‌های صفحه AI Assistant (دستیار)

> **صفحه:** `apps/web/src/components/screens/ai-chat-screen.tsx`
> **تاریخ بررسی:** ۲۰۲۶-۰۷-۰۸

---

## 🔴 نکته‌های شما (کاربر)

### ۱. در شب، رنگ متن اذیت‌کننده و ناخواناست
- "از AI بپرس" — تار
- متن داخل bubble (پیام خوش‌آمدگویی) — سخت خونده می‌شه
- quick reply buttons هم همینطور

### ۲. input و ارسال باید ثابت بالای فوتر باشه
- الان می‌ره پشت footer
- کاربر باید scroll کنه پایین تا بهش برسه
- باید sticky باشه

### ۳. (بقیه مشترک — lucide، فارسی، glow)

---

## 🔵 نکته‌های من (AI)

### ۴. input اصلاً نمایش داده نمی‌شه!
- در اسکرین‌شات‌ها هیچ text input نمی‌بینم
- فقط یه دکمه "+" کنار welcome bubble
- احتمالاً باید یه ChatInput component باشه (که در batch قبلی هم گفته شد)

### ۵. Welcome bubble عجیب
- یه پیام بزرگ وسط صفحه
- دکمه "+" کنارش عجیب
- باید: welcome card با چند quick action و avatar

### ۶. هیچ پیام تاریخچه‌ای نیست
- اگه چت قبلی داشتی، الان نیست
- باید لیست مکالمات (sidebar یا modal) باشه

### ۷. AI avatar و identity
- الان فقط یه bubble بی‌هویت
- باید: avatar (robot/sparkles icon)، نام "دستیار کشاورزی"

### ۸. Quick reply buttons — context خوب نیست
- "آبیاری کندم" — typo: "کندم" باید "گندم"
- "آفات رایج" — خوب
- "کوددهی" — خوب
- "پیشنهاد وضعیت" — خوب
- ولی ثابت نیستن — باید context-aware باشن

### ۹. Empty state ضعیف
- فقط یه bubble
- باید: illustration + welcome + ۴-۶ suggested prompts

### ۱۰. Loading/Typing indicator
- وقتی AI پاسخ می‌ده، باید typing dots نشون بده

### ۱۱. Streaming response
- پاسخ AI باید streaming باشه (نه یکجا)

### ۱۲. Markdown rendering
- پاسخ AI باید bold, list, code block رندر بشه
- الان plain text

### ۱۳. Copy button روی پاسخ‌ها
- کاربر بتونه کپی کنه

### ۱۴. Message timestamps
- هر پیام ساعتش نوشته بشه

### ۱۵. New chat button
- بالای صفحه، دکمه "+" برای شروع چت جدید

### ۱۶. Chat history sidebar (اختیاری)
- لیست مکالمات قبلی
- swipe از چپ یا modal

### ۱۷. Settings (model, temperature)
- انتخاب مدل (Gemini/DeepSeek/OpenRouter)
- تنظیم دما

---

## 🎯 اولویت‌بندی

| # | موضوع | اولویت |
|---|--------|---------|
| ۱ | contrast در شب | 🔴 P0 |
| ۲ | ChatInput ثابت بالای footer | 🔴 P0 |
| ۳ | رفع typo "کندم" | 🔴 P0 |
| ۴ | ایکون lucide | 🔴 P0 |
| ۵ | Glow effect | 🟡 P1 |
| ۶ | Welcome card با avatar | 🟡 P1 |
| ۷ | Typing indicator | 🟡 P1 |
| ۸ | Streaming | 🟡 P1 |
| ۹ | Markdown | 🟡 P1 |
| ۱۰ | Timestamps | 🟢 P2 |
| ۱۱ | New chat button | 🟢 P2 |
| ۱۲ | Copy button | 🟢 P2 |

---

## ✅ جمع‌بندی

**۱۷ موضوع** شناسایی شد:
- 🔴 P0: ۴ مورد
- 🟡 P1: ۵ مورد
- 🟢 P2: ۳ مورد

---

**🚀 آماده prompt و checklist...**
