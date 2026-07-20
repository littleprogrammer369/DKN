# 🤖 پرامپت Orchestrator — اصلاح UI همه صفحات DKN

> **این پرامپت را در Cline CLI اجرا کنید تا همه ۱۰ صفحه UI به ترتیب اصلاح شوند.**

---

## 📋 خلاصه کار

| # | صفحه | تعداد مشکل | شاخه |
|---|------|-----------|------|
| ۰۱ | Login | ۹ | `fix/ui-01-login` |
| ۰۲ | Register | ۱۰ | `fix/ui-02-register` |
| ۰۳ | Dashboard | ۱۱ | `fix/ui-03-dashboard` |
| ۰۴ | Farms List | ۱۰ | `fix/ui-04-farms-list` |
| ۰۵ | Farm Create | ۹ | `fix/ui-05-farm-create` |
| ۰۶ | Farm Detail | ۱۲ | `fix/ui-06-farm-detail` |
| ۰۷ | AI Assistant | ۱۲ | `fix/ui-07-ai-assistant` |
| ۰۸ | Irrigation | ۱۱ | `fix/ui-08-irrigation` |
| ۰۹ | Pests | ۱۳ | `fix/ui-09-pests` |
| ۱۰ | Profile | ۱۴ | `feat/ui-10-profile` (جدید) |
| **جمع** | | **۱۱۱** | |

---

## 📋 پرامپت اصلی (کپی کن و در Cline بگذار)

```
وظیفه: اصلاح UI همه ۱۰ صفحه پروژه DKN به ترتیب.

## 🎯 Context
- پروژه: DKN (داده کشت نوین)
- مسیر پروژه: /home/pro/DKN/dadeh-kesht-novin/
- Frontend: apps/web/ (Next.js 14 + Tailwind + TypeScript)
- شاخه فعلی: develop
- کتابخانه‌های مورد نیاز: lucide-react, framer-motion, react-leaflet, leaflet, recharts, react-circular-progressbar, react-markdown, remark-gfm, react-hook-form, @hookform/resolvers, zod

## 📂 فایل‌های ورودی (باید به ترتیب بخوانی)

هر فایل، یک صفحه را شامل می‌شود. در این مسیرها موجودند:

```
/home/pro/DKN/dadeh-kesht-novin/ui-fixes/screens/
├── 01-login/prompt.md
├── 02-register/prompt.md
├── 03-dashboard/prompt.md
├── 04-farms-list/prompt.md
├── 05-farm-create/prompt.md
├── 06-farm-detail/prompt.md
├── 07-ai-assistant/prompt.md
├── 08-irrigation/prompt.md
├── 09-pests/prompt.md
└── 10-profile/prompt.md
```

اگه این فایل‌ها در این مسیر نیستند:
- از `/home/pro/ui-fixes.zip` استخراج کن
- یا از `/home/user/ui-fixes.zip`
- یا از workspace فعلی

## 📋 مرحله ۰: آماده‌سازی

```bash
# ساخت پوشه status
mkdir -p /home/pro/DKN/cline_status

# ساخت checklist کلی
cat > /home/pro/DKN/cline_status/master_checklist.md << 'EOF'
# 📋 چک‌لیست کلی — DKN UI Fixes

## ۰۱ — Login
- [ ] P0-L1: +98 سمت چپ
- [ ] P0-L2: تفکیک فیلدها در روز
- [ ] P1-L3: lucide-react
- [ ] P1-L4: Tab indicator
- [ ] P1-L5: OTP boxes
- [ ] P2-L6: Loading/Error
- [ ] P2-L7: فراموشی رمز
- [ ] P2-L8: RTL/LTR
- [ ] P2-L9: Bottom link

## ۰۲ — Register
- [ ] P0-R1: +98 سمت چپ
- [ ] P0-R2: تفکیک فیلدها
- [ ] P1-R3: lucide
- [ ] P1-R4: Password strength
- [ ] P1-R5: Match validation
- [ ] P2-R6: نمایش/مخفی رمز
- [ ] P2-R7: Terms checkbox
- [ ] P2-R8: Helper text
- [ ] P2-R9: Username check
- [ ] P2-R10: Success animation

## ۰۳ — Dashboard
- [ ] P0-D1: متن‌ها فارسی
- [ ] P0-D2: contrast در شب
- [ ] P0-D3: Welcome bug
- [ ] P1-D4: Glow
- [ ] P1-D5: Weather card
- [ ] P1-D6: Forecast
- [ ] P1-D7: Quick actions
- [ ] P2-D8: Welcome header
- [ ] P2-D9: Real-time
- [ ] P2-D10: Empty state
- [ ] P2-D11: Loading

## ۰۴ — Farms List
- [ ] P0-FL1: Edit/Del icons
- [ ] P0-FL2: contrast
- [ ] P0-FL3: فارسی
- [ ] P0-FL4: Layout
- [ ] P0-FL5: bug ha 1-1
- [ ] P1-FL6: Glow
- [ ] P1-FL7: Empty state
- [ ] P1-FL8: Stats
- [ ] P2-FL9: Search
- [ ] P2-FL10: Swipe

## ۰۵ — Farm Create
- [ ] P0-FC1: bug خوش آمدی جان
- [ ] P0-FC2: فیلد محصول
- [ ] P0-FC3: شهر و استان جدا
- [ ] P0-FC4: نقشه
- [ ] P0-FC5: lucide و فارسی
- [ ] P1-FC6: Stepper
- [ ] P1-FC7: Glow
- [ ] P1-FC8: نوع خاک/آبیاری
- [ ] P2-FC9: Validation

## ۰۶ — Farm Detail
- [ ] P0-FD1: نقشه Leaflet
- [ ] P0-FD2: Border
- [ ] P0-FD3: فارسی
- [ ] P0-FD4: lucide
- [ ] P0-FD5: contrast
- [ ] P0-FD6: دکمه بازگشت
- [ ] P0-FD7: bug 1-1 هکتار
- [ ] P1-FD8: متریک real-time
- [ ] P1-FD9: نمودار رطوبت
- [ ] P1-FD10: Alerts
- [ ] P2-FD11: Quick actions
- [ ] P2-FD12: پیش‌بینی هوا

## ۰۷ — AI Assistant
- [ ] P0-AI1: contrast
- [ ] P0-AI2: ChatInput ثابت
- [ ] P0-AI3: typo کندم
- [ ] P0-AI4: lucide
- [ ] P1-AI5: Glow
- [ ] P1-AI6: Welcome card
- [ ] P1-AI7: Typing indicator
- [ ] P1-AI8: Streaming
- [ ] P1-AI9: Markdown
- [ ] P2-AI10: Timestamps
- [ ] P2-AI11: New chat
- [ ] P2-AI12: Copy

## ۰۸ — Irrigation
- [ ] P0-IR1: typo آبی
- [ ] P0-IR2: bug 500% rain
- [ ] P0-IR3: Border
- [ ] P0-IR4: lucide/فارسی/contrast
- [ ] P1-IR5: Forecast
- [ ] P1-IR6: Status badge
- [ ] P1-IR7: Circular progress
- [ ] P1-IR8: AddIrrigationModal
- [ ] P2-IR9: History
- [ ] P2-IR10: Calendar
- [ ] P2-IR11: Water stats

## ۰۹ — Pests
- [ ] P0-PT1: فارسی
- [ ] P0-PT2: انتخاب زمین
- [ ] P0-PT3: Severity slider
- [ ] P0-PT4: آپلود عکس
- [ ] P0-PT5: lucide/border/contrast
- [ ] P1-PT6: لیست گزارش
- [ ] P1-PT7: Detail modal
- [ ] P1-PT8: Dropdown فارسی
- [ ] P1-PT9: AI identification
- [ ] P2-PT10: Risk Status
- [ ] P2-PT11: Stats
- [ ] P2-PT12: Empty state
- [ ] P2-PT13: Filter

## ۱۰ — Profile (جدید)
- [ ] ساختار اصلی
- [ ] مشخصات کاربر
- [ ] کارت پلن
- [ ] لیست ۴ پلن
- [ ] پشتیبانی
- [ ] خروج
- [ ] آواتار
- [ ] ویرایش
- [ ] Theme toggle
- [ ] آمار
- [ ] تغییر رمز
- [ ] نوتیفیکیشن
- [ ] درباره
- [ ] حذف حساب

EOF

# ساخت log
cat > /home/pro/DKN/cline_status/master_log.md << EOF
# 🚀 Master Log — DKN UI Fixes
شروع: \$(date '+%Y-%m-%d %H:%M:%S')

EOF

# شروع branch جدید
cd /home/pro/DKN/dadeh-kesht-novin
git checkout develop
git pull origin develop
git checkout -b fix/ui-all-screens-batch-1

# لاگ شروع
echo "[\$(date '+%Y-%m-%d %H:%M:%S')] ✅ آماده‌سازی کامل شد" >> /home/pro/DKN/cline_status/master_log.md
```

## 📋 مرحله ۱: نصب کتابخانه‌ها (یکجا)

```bash
cd /home/pro/DKN/dadeh-kesht-novin
pnpm --filter web add \
  lucide-react \
  framer-motion \
  react-leaflet \
  leaflet \
  @types/leaflet \
  recharts \
  react-circular-progressbar \
  react-markdown \
  remark-gfm \
  react-hook-form \
  @hookform/resolvers \
  zod

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📦 کتابخانه‌ها نصب شد" >> /home/pro/DKN/cline_status/master_log.md
```

## 📋 مرحله ۲: تنظیم Leaflet CSS (یکجا)

در `apps/web/src/app/globals.css` اضافه کن:

```css
@import 'leaflet/dist/leaflet.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* contrast در dark mode */
:root {
  --text-secondary: rgba(0, 0, 0, 0.65);
  --text-tertiary: rgba(0, 0, 0, 0.45);
}

.dark {
  --text-secondary: rgba(255, 255, 255, 0.85);
  --text-tertiary: rgba(255, 255, 255, 0.65);
}

/* Glow effect */
@layer utilities {
  .shadow-glow {
    box-shadow:
      0 0 0 1px rgba(16, 185, 129, 0.1),
      0 4px 20px -2px rgba(16, 185, 129, 0.15);
  }
  .dark .shadow-glow {
    box-shadow:
      0 0 0 1px rgba(16, 185, 129, 0.2),
      0 0 30px -5px rgba(16, 185, 129, 0.2);
  }
  .shadow-glow-lg {
    box-shadow:
      0 0 0 1px rgba(16, 185, 129, 0.15),
      0 8px 30px -5px rgba(16, 185, 129, 0.2);
  }
}
```

## 📋 مرحله ۳: اجرای صفحات (به ترتیب)

برای هر صفحه (01 تا 10):

### الگوی اجرا:
```
۱. فایل prompt.md صفحه X را بخوان
۲. تمام مشکلات P0 را fix کن (اولویت بالا)
۳. سپس P1، سپس P2
۴. بعد از هر fix: build و type-check
۵. checklist.md صفحه را به‌روز کن (تیک بزن)
۶. master_log.md را append کن
۷. بعد از اتمام: commit atomic
```

### الگوی لاگ:
```bash
SCREEN="01-login"
TASK_ID="P0-L1"
TASK_NAME="Login - +98 به چپ"

echo "─────────────────────────────────────" >> /home/pro/DKN/cline_status/master_log.md
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔧 $SCREEN: شروع $TASK_ID - $TASK_NAME" >> /home/pro/DKN/cline_status/master_log.md

# ... تغییرات ...

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $SCREEN: تکمیل $TASK_ID" >> /home/pro/DKN/cline_status/master_log.md
sed -i "s/- \[ \] $TASK_ID/- [x] $TASK_ID/" /home/pro/DKN/cline_status/master_checklist.md
```

### بعد از هر صفحه:
```bash
# commit atomic
cd /home/pro/DKN/dadeh-kesht-novin
git add .
git commit -m "fix(ui): صفحه $SCREEN — اصلاح X مشکل"
git push origin fix/ui-all-screens-batch-1
```

## 📋 مرحله ۴: لیست صفحات (به ترتیب اجرا)

| # | صفحه | فایل |
|---|------|------|
| ۱ | Login | `ui-fixes/screens/01-login/prompt.md` |
| ۲ | Register | `ui-fixes/screens/02-register/prompt.md` |
| ۳ | Dashboard | `ui-fixes/screens/03-dashboard/prompt.md` |
| ۴ | Farms List | `ui-fixes/screens/04-farms-list/prompt.md` |
| ۵ | Farm Create | `ui-fixes/screens/05-farm-create/prompt.md` |
| ۶ | Farm Detail | `ui-fixes/screens/06-farm-detail/prompt.md` |
| ۷ | AI Assistant | `ui-fixes/screens/07-ai-assistant/prompt.md` |
| ۸ | Irrigation | `ui-fixes/screens/08-irrigation/prompt.md` |
| ۹ | Pests | `ui-fixes/screens/09-pests/prompt.md` |
| ۱۰ | Profile | `ui-fixes/screens/10-profile/prompt.md` |

## 📋 مرحله ۵: PR نهایی

بعد از اتمام همه ۱۰ صفحه:

```bash
cd /home/pro/DKN/dadeh-kesht-novin

# Build نهایی
pnpm install
pnpm --filter web type-check
pnpm --filter web build

# اگه خطا داشت، fix کن

# Final commit (اگه نیاز)
git add .
git commit -m "fix(ui): همه ۱۰ صفحه — ۱۱۱ مشکل برطرف شد"

# Push
git push origin fix/ui-all-screens-batch-1

# PR با gh CLI
gh pr create \
  --base develop \
  --head fix/ui-all-screens-batch-1 \
  --title "fix(ui): اصلاح UI همه ۱۰ صفحه (۱۱۱ مشکل)" \
  --body "این PR مشکلات UI را در ۱۰ صفحه برطرف می‌کند:

## صفحات اصلاح شده
- ۰۱ — Login (۹ مشکل)
- ۰۲ — Register (۱۰ مشکل)
- ۰۳ — Dashboard (۱۱ مشکل)
- ۰۴ — Farms List (۱۰ مشکل)
- ۰۵ — Farm Create (۹ مشکل)
- ۰۶ — Farm Detail (۱۲ مشکل)
- ۰۷ — AI Assistant (۱۲ مشکل)
- ۰۸ — Irrigation (۱۱ مشکل)
- ۰۹ — Pests (۱۳ مشکل)
- ۱۰ — Profile (۱۴ مشکل — ساخت از صفر)

## تغییرات کلی
- همه ایموجی‌ها → lucide-react
- همه متن‌ها فارسی شدن
- همه کارت‌ها border + glow
- contrast در شب بهبود یافت
- نقشه Leaflet واقعی
- Bug های critical رفع شد

تست شده در: day + night mode
Build: ✅ بدون خطا"
```

## 📋 مرحله ۶: گزارش نهایی

```bash
# در master_log.md اضافه کن:
cat >> /home/pro/DKN/cline_status/master_log.md << EOF

═══════════════════════════════════════════════════════════════
✅ گزارش نهایی
═══════════════════════════════════════════════════════════════
پایان: \$(date '+%Y-%m-%d %H:%M:%S')
شاخه: fix/ui-all-screens-batch-1
PR: https://github.com/littleprogrammer369/DKN/pull/[NUMBER]
صفحات اصلاح شده: ۱۰
تعداد commit: \$(git log --oneline | wc -l)
فایل ویرایش شده: \$(git diff --name-only | wc -l)

## وضعیت checklist:
تکمیل: \$(grep -c '\[x\]' /home/pro/DKN/cline_status/master_checklist.md)
باقی‌مانده: \$(grep -c '\[ \]' /home/pro/DKN/cline_status/master_checklist.md)
═══════════════════════════════════════════════════════════════
EOF
```

## ⚠️ نکات مهم

1. **از P0 شروع کن** (بحرانی‌ترین)
2. **هر commit atomic** باشد (یک commit برای هر صفحه یا چند fix مرتبط)
3. **build بعد از هر صفحه**
4. **اگه prompt نامفهوم بود، به من بگو** (نه به کاربر)
5. **اگه با کد موجود conflict داشت، در log توضیح بده**
6. **همه فایل‌های تولید شده را در log ثبت کن**

## 📂 فایل‌های تولید شده در پایان

- `/home/pro/DKN/cline_status/master_checklist.md` — checklist کلی
- `/home/pro/DKN/cline_status/master_log.md` — لاگ زمان‌بندی شده
- Branch: `fix/ui-all-screens-batch-1`
- PR: لینک GitHub
- ۱۰ صفحه UI اصلاح شده

---

## 🚀 شروع کن!

این پرامپت را در Cline کپی و اجرا کن.
Cline باید خودش قدم به قدم پیش برود و در پایان PR تحویل دهد.
```

---

## 📋 خلاصه سریع

| چیز | کجا |
|------|------|
| پرامپت‌های صفحات | `ui-fixes/screens/XX-name/prompt.md` |
| نکته‌های صفحات | `ui-fixes/screens/XX-name/notes.md` |
| چک‌لیست‌ها | `ui-fixes/screens/XX-name/checklist.md` |
| اسکرین‌شات‌ها | `ui-fixes/screens/XX-name/screenshots/` |
| Checklist کلی | `/home/pro/DKN/cline_status/master_checklist.md` |
| لاگ کلی | `/home/pro/DKN/cline_status/master_log.md` |

---

**🚀 این فایل را در کنار بقیه فایل‌ها در Cline بگذار!**
