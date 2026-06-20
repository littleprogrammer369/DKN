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
| ۲ | تبدیل UI کارفرما | ⏳ در حال اجرا | ۲۰۲۶-۰۶-۲۰ | - | تبدیل HTML به کامپوننت‌های Next.js |
| ۳ | احراز هویت | ⏳ در انتظار | - | - | - |
| ۴ | مدیریت زمین با نقشه | ⏳ در انتظار | - | - | - |
| ۵ | داشبورد و متریک‌ها | ⏳ در انتظار | - | - | - |
| ۶ | آبیاری و آفات | ⏳ در انتظار | - | - | - |
| ۷ | دستیار AI | ⏳ در انتظار | - | - | - |
| ۸ | اعلان‌ها و گزارش‌ها | ⏳ در انتظار | - | - | - |
| ۹ | تنظیمات Apache | ⏳ در انتظار | - | - | - |
| ۱۰ | تست نهایی | ⏳ در انتظار | - | - | - |

---

## 🔄 مرحله فعلی

**⏳ مرحله ۲: تبدیل UI کارفرما — در حال اجرا**

### وضعیت سرور
- ✅ Node.js v20.20.2
- ✅ pnpm 10.34.4
- ✅ Docker 28.1.1
- ✅ PostgreSQL 16 (کانتینر dkn-postgres)
- ✅ Redis 7 (کانتینر dkn-redis)
- ✅ Apache 2.4.41
- ✅ UFW فعال
- ✅ psql-client و redis-tools نصب شده

### کار بعدی
1. تبدیل HTML UI مرجع (`dadeh_kesht_novin.html`) به کامپوننت‌های Next.js
2. ایجاد فایل‌های Layout, صفحه Login, Dashboard, Farms, Irrigation, Pests, AI Chat
3. تطبیق استایل‌ها با Tailwind

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
| مراحل تکمیل‌شده | ۱ |
| مراحل در حال | ۱ |
| مراحل باقی‌مانده | ۹ |
| درصد کلی | ۱۰٪ |

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
