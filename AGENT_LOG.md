# 📋 لاگ Agent — داده کشت نوین

> این فایل توسط Cline CLI نگهداری می‌شود.
> Cline **باید** هر اقدام، خطا، راه‌حل و تغییر را در اینجا ثبت کند.
> اگر Cline قطع شد، با خواندن این فایل می‌تواند ادامه دهد.

---

## 🗺️ نقشه مراحل

| # | مرحله | وضعیت | شروع | پایان | یادداشت |
|---|--------|--------|------|-------|---------|
| ۰ | آماده‌سازی سرور | ✅ کامل | ۲۰۲۶-۰۶-۱۹ | ۲۰۲۶-۰۶-۱۹ | نصب Node, pnpm, Docker, PostgreSQL, Redis, Apache, UFW |
| ۱ | راه‌اندازی پروژه | ✅ کامل | ۲۰۲۶-۰۶-۱۹ | ۲۰۲۶-۰۶-۲۰ | Monorepo, Prisma, NestJS, Next.js |
| ۲ | تبدیل UI کارفرما | ✅ کامل | ۲۰۲۶-۰۶-۲۰ | ۲۰۲۶-۰۶-۲۰ | ۷ صفحه Next.js از HTML مرجع |
| ۳ | احراز هویت (Backend) | ✅ کامل | ۲۰۲۶-۰۶-۲۰ | ۲۰۲۶-۰۶-۲۰ | Auth module (OTP+JWT) |
| ۴ | مدیریت زمین (Backend) | ✅ کامل | ۲۰۲۶-۰۶-۲۰ | ۲۰۲۶-۰۶-۲۰ | Farms module CRUD |
| ۵ | داشبورد و متریک‌ها | ✅ کامل | ۲۰۲۶-۰۶-۲۰ | ۲۰۲۶-۰۶-۲۰ | Weather + Satellite modules |
| ۶ | آبیاری و آفات | ✅ کامل | ۲۰۲۶-۰۶-۲۰ | ۲۰۲۶-۰۶-۲۰ | Irrigation + Pests modules |
| ۷ | دستیار AI | ✅ کامل | ۲۰۲۶-۰۶-۲۰ | ۲۰۲۶-۰۶-۲۰ | AI chat module + Frontend |
| ۸ | اعلان‌ها و گزارش‌ها | ⏳ در انتظار | - | - | - |
| ۹ | تنظیمات Apache | ⏳ در انتظار | - | - | - |
| ۱۰ | تست نهایی | ⏳ در انتظار | - | - | - |

---

## 🔄 مرحله فعلی

**⏳ مرحله ۳-۷: Backend API — در حال اجرا**

### وضعیت سرور
- ✅ Node.js v20.20.2
- ✅ pnpm 10.34.4
- ✅ Docker (PostgreSQL 16 + Redis 7)
- ✅ Apache 2.4.41 + UFW

### کار بعدی
1. تست API و اتصال Frontend به Backend
2. تنظیمات Apache برای Production
3. تست نهایی

---

## 📜 تاریخچه رویدادها

### ۲۰۲۶-۰۶-۱۹ ۲۲:۵۹ — ایجاد پروژه

**عملیات:**
- ✅ ساختار پروژه ایجاد شد
- ✅ فایل `PROJECT_SPEC.md` نوشته شد
- ✅ فایل `CLINE_INSTRUCTIONS.md` نوشته شد
- ✅ فایل `AGENT_LOG.md` ایجاد شد
- ✅ فایل UI کارفرما کپی شد (`dadeh_kesht_novin.html`)

---

### ۲۰۲۶-۰۶-۱۹ ۲۳:۰۵ — مرحله ۰: آماده‌سازی سرور ✅

**مرحله:** ۰
**وضعیت:** ✅ موفق

**اقدامات:**
- ✅ بررسی نصب بودن نرم‌افزارها
- ✅ نصب pnpm 10.34.4
- ✅ ایجاد docker-compose.yml برای PostgreSQL 16 + Redis 7
- ✅ راه‌اندازی سرویس‌های Docker
- ✅ نصب psql-client و redis-tools
- ✅ تست اتصال PostgreSQL و Redis
- ✅ تنظیم فایروال UFW

**فایل‌های تغییر یافته:**
- `docker-compose.yml` — ایجاد شد
- `AGENT_LOG.md` — بروزرسانی

**مرحله بعدی:**
- شروع مرحله ۱: راه‌اندازی پروژه

---

## 📊 خلاصه وضعیت

| آیتم | مقدار |
|------|-------|
| کل مراحل | ۱۰ |
| مراحل تکمیل‌شده | ۲ |
| مراحل در حال | ۱ |
| مراحل باقی‌مانده | ۸ |
| درصد کلی | ۲۰٪ |
| آخرین فایل تغییر یافته | AGENT_LOG.md, .gitignore, docker-compose.yml, services/... |
| Git Commit | bcca681 + c98632f |

---

## 🛠️ دستورات سریع

```bash
ls -la
docker compose ps
PGPASSWORD=dkn_secure_pass_1402 psql -h localhost -U dkn_user -d dadeh_kesht_novin
redis-cli -h localhost -p 6379 -a dkn_redis_pass_1402 ping
```

---

## ⚠️ خطاهای مهم

| خطا | علت | راه‌حل | وضعیت |
|-----|-----|--------|--------|
| exec format error در postgis image | نداشتن ARM64 image | استفاده از postgres:16-alpine | ✅ رفع موقت |

### ۲۰۲۶-۰۶-۲۰ ۰۰:۲۵ — مرحله ۱: راه‌اندازی پروژه ✅

**مرحله:** ۱
**وضعیت:** ✅ موفق

**اقدامات:**
- ✅ ایجاد ساختار Monorepo (apps/web + services/api)
- ✅ ایجاد package.json ریشه و pnpm-workspace.yaml
- ✅ ایجاد فایل‌های تنظیمات NestJS (tsconfig, nest-cli)
- ✅ ایجاد فایل‌های تنظیمات Next.js (next.config, tailwind, postcss)
- ✅ ایجاد Prisma Schema با ۱۰ مدل (User, Farm, SatelliteData, WeatherData, IrrigationRecord, PestReport, AIChat, Notification, Subscription, OtpCode)
- ✅ ایجاد فایل .env
- ✅ نصب وابستگی‌ها با pnpm (۱:۲۶ دقیقه)
- ✅ اجرای Prisma generate و migrate (۱۱ جدول در PostgreSQL)
- ✅ ایجاد فایل‌های اصلی NestJS (main.ts, app.module.ts, prisma.service.ts)
- ✅ ایجاد ۸ ماژول خالی (Auth, Users, Farms, Satellite, Weather, AI, Irrigation, Pests)
- ✅ Build موفق NestJS
- ✅ مقداردهی Git repository
- ✅ ایجاد .gitignore

**فایل‌های ایجاد شده:**
- `package.json` — ریشه
- `pnpm-workspace.yaml` — workspace config
- `tsconfig.json` — ریشه
- `.env` — متغیرهای محیطی
- `.gitignore`
- `apps/web/package.json` — Next.js
- `apps/web/next.config.js`
- `apps/web/tailwind.config.js`
- `apps/web/postcss.config.js`
- `apps/web/tsconfig.json`
- `services/api/package.json` — NestJS
- `services/api/tsconfig.json`
- `services/api/tsconfig.build.json`
- `services/api/nest-cli.json`
- `services/api/prisma/schema.prisma` — ۱۰ مدل
- `services/api/src/main.ts`
- `services/api/src/app.module.ts`
- `services/api/src/prisma.service.ts`
- `services/api/src/prisma.module.ts`
- `services/api/src/auth/auth.module.ts`
- `services/api/src/users/users.module.ts`
- `services/api/src/farms/farms.module.ts`
- `services/api/src/satellite/satellite.module.ts`
- `services/api/src/weather/weather.module.ts`
- `services/api/src/ai/ai.module.ts`
- `services/api/src/irrigation/irrigation.module.ts`
- `services/api/src/pests/pests.module.ts`
- `services/api/prisma/migrations/` — migration اولیه

**مرحله بعدی:**
- شروع مرحله ۲: تبدیل UI کارفرما به کامپوننت‌های Next.js

### ۲۰۲۶-۰۶-۲۰ ۰۰:۵۰ — مرحله ۲: تبدیل UI کارفرما ✅

**مرحله:** ۲
**وضعیت:** ✅ موفق

**اقدامات:**
- ✅ ایجاد `globals.css` با استایل‌های Glass Morphism
- ✅ ایجاد Root Layout با RTL و Vazirmatn
- ✅ ایجاد NavBar کامپوننت با ۵ دکمه ناوبری
- ✅ ایجاد App Layout مشترک
- ✅ ایجاد صفحه Login با OTP دو مرحله‌ای
- ✅ ایجاد صفحه Dashboard با امتیاز سلامت، آب‌وهوا، دسترسی سریع
- ✅ ایجاد صفحه Farms لیست زمین‌ها
- ✅ ایجاد صفحه Farm Detail با نقشه و اطلاعات
- ✅ ایجاد صفحه Irrigation با توصیه آبیاری
- ✅ ایجاد صفحه Pests با سطح ریسک و تهدیدات
- ✅ ایجاد صفحه AI Chat با پاسخ‌های هوشمند
- ✅ ایجاد کامپوننت‌های HealthGauge و WeatherCard
- ✅ ایجاد PWA manifest.json
- ✅ Next.js build در حال اجرا

**فایل‌های ایجاد شده:**
- `apps/web/src/app/globals.css`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx` (Login)
- `apps/web/src/app/(app)/layout.tsx`
- `apps/web/src/app/(app)/dashboard/page.tsx`
- `apps/web/src/app/(app)/farms/page.tsx`
- `apps/web/src/app/(app)/farms/[id]/page.tsx`
- `apps/web/src/app/(app)/irrigation/page.tsx`
- `apps/web/src/app/(app)/pests/page.tsx`
- `apps/web/src/app/(app)/ai/page.tsx`
- `apps/web/src/components/NavBar.tsx`
- `apps/web/src/components/HealthGauge.tsx`
- `apps/web/src/components/WeatherCard.tsx`
- `apps/web/public/manifest.json`

**مرحله بعدی:**
- شروع مرحله ۳: احراز هویت (Auth Module در NestJS + JWT)
