# 🛠️ UI Fixes — DKN

> **پکیج کامل اصلاح UI همه ۱۰ صفحه — آماده برای Cline**

---

## 📋 محتوا

این پکیج شامل:
- **۱۰ صفحه** بررسی شده با اسکرین‌شات
- **۱۱۱ مشکل** شناسایی شده (P0 + P1 + P2)
- **۳۰ فایل** (notes, prompts, checklists)
- **۱ پرامپت orchestrator** برای اجرای همه

---

## 🚀 نحوه استفاده

### روش ۱: استفاده از Orchestrator (پیشنهادی)

```bash
# ۱. استخراج ZIP در workspace پروژه
cd /home/pro/DKN/dadeh-kesht-novin
unzip /path/to/ui-fixes.zip

# ۲. در Cline CLI، محتوای ORCHESTRATOR_PROMPT.md رو کپی کن
cat ui-fixes/ORCHESTRATOR_PROMPT.md

# ۳. متن داخل ``` ... ``` رو در Cline بگذار
# ۴. Cline خودش همه رو می‌خونه و اجرا می‌کنه
```

### روش ۲: صفحه به صفحه (دستی)

```bash
# در Cline:
# "فایل ui-fixes/screens/01-login/prompt.md رو بخوان و اجرا کن"
# "فایل ui-fixes/screens/02-register/prompt.md رو بخوان و اجرا کن"
# ... الی آخر
```

---

## 📂 ساختار

```
ui-fixes/
├── README.md (این فایل)
├── ORCHESTRATOR_PROMPT.md ⭐ (پرامپت اصلی)
└── screens/
    ├── 01-login/
    │   ├── notes.md
    │   ├── prompt.md          ← پرامپت برای Cline
    │   ├── checklist.md       ← چک‌لیست
    │   └── screenshots/
    ├── 02-register/
    │   └── ...
    ├── 03-dashboard/
    ├── 04-farms-list/
    ├── 05-farm-create/
    ├── 06-farm-detail/
    ├── 07-ai-assistant/
    ├── 08-irrigation/
    ├── 09-pests/
    └── 10-profile/
```

---

## 📊 آمار کلی

| دسته | تعداد |
|------|-------|
| صفحات بررسی شده | ۱۰ |
| اسکرین‌شات‌ها | ۱۶ |
| مشکلات P0 (بحرانی) | ~۵۵ |
| مشکلات P1 (مهم) | ~۶۰ |
| مشکلات P2 (اختیاری) | ~۴۰ |
| **جمع** | **~۱۵۵** |

---

## 🎯 اولویت‌بندی پیشنهادی

Cline باید این ترتیب رو رعایت کنه:

1. **P0** هر صفحه (اول)
2. **P1** هر صفحه (بعد)
3. **P2** هر صفحه (اختیاری، در آخر)
4. **Build** بعد از هر صفحه
5. **Commit** بعد از هر صفحه
6. **PR** در پایان همه

---

## 🔧 کتابخانه‌های مورد نیاز

```bash
pnpm --filter web add \
  lucide-react \
  framer-motion \
  react-leaflet leaflet @types/leaflet \
  recharts \
  react-circular-progressbar \
  react-markdown remark-gfm \
  react-hook-form @hookform/resolvers zod
```

---

## 📂 فایل‌های خروجی در پروژه

بعد از اجرا توسط Cline:

- `/home/pro/DKN/cline_status/master_checklist.md`
- `/home/pro/DKN/cline_status/master_log.md`
- Branch: `fix/ui-all-screens-batch-1`
- PR: لینک GitHub

---

## 💡 نکات مهم

1. **همه متن‌ها فارسی** (طبق spec پروژه)
2. **همه ایموجی‌ها → lucide-react** (مدرن‌تر)
3. **همه کارت‌ها border + glow** (طبق الگوی پروژه)
4. **طراحی RTL** حفظ شود
5. **Day/Night mode** برای همه المان‌ها تست شود

---

**🚀 آماده برای Cline!**
