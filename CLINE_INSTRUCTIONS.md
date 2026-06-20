# 🤖 دستورالعمل Cline — داده کشت نوین

> این فایل دستورالعمل اصلی Cline CLI است.
> Cline باید **قبل از شروع هر کاری** این فایل را به‌طور کامل بخواند.
> پس از خواندن، طبق مراحل زیر عمل کند.

---

## 📋 فهرست وظایف Cline

1. [مرور کلی پروژه](#مرور)
2. [فایل‌های مرجع](#فایل-های-مرجع)
3. [قوانین کار](#قوانین)
4. [مراحل اجرا](#مراحل)
5. [نحوه نوشتن لاگ](#لاگ)
6. [نحوه ادامه بعد از قطع](#ادامه)
7. [نحوه رفع خطا](#خطا)

---

## 🎯 مرور کلی <a name="مرور"></a>

شما (Cline) قرار است یک پروژه کشاورزی هوشمند به نام **«داده کشت نوین»** را روی سرور Ubuntu 20.04 از ۰ تا ۱۰۰ پیاده‌سازی کنید.

### محصول چیست؟
یک اپ وب و موبایل (PWA + Android) برای کشاورزان ایرانی که با کمک:
- تصاویر ماهواره‌ای (NDVI, EVI)
- داده‌های IoT
- هوش مصنوعی
- آب‌وهوای زنده

توصیه‌های هوشمند برای آبیاری، کوددهی، آفات و برداشت ارائه می‌دهد.

### اولویت محصول اول
**گندم** — تمام فیچرها اول برای گندم بهینه شوند.

### زمان‌بندی
MVP در ۳ ماه — ۱۰ مرحله اصلی.

### بودجه
رایگان! از مدل‌های AI رایگان (Gemini, DeepSeek, OpenRouter) استفاده کنید.

---

## 📂 فایل‌های مرجع <a name="فایل-های-مرجع"></a>

قبل از شروع هر کاری، **این فایل‌ها را بخوانید:**

| فایل | چرا باید بخوانی |
|------|----------------|
| 📘 **`PROJECT_SPEC.md`** | مستند کامل پروژه — تئوری، نیازهای کارفرما، معماری، زیرساخت، پیاده‌سازی |
| 🎨 **`dadeh_kesht_novin.html`** | UI مرجع کارفرما — طراحی ۷ صفحه اصلی اپ |
| 📕 **`CLINE_INSTRUCTIONS.md`** | همین فایل — دستورالعمل کار شما |
| 📗 **`AGENT_LOG.md`** | فایل لاگ — هر کاری که می‌کنید اینجا بنویسید |

### ترتیب خواندن
```
۱. PROJECT_SPEC.md (مستند اصلی)
۲. dadeh_kesht_novin.html (UI مرجع)
۳. CLINE_INSTRUCTIONS.md (این فایل)
۴. AGENT_LOG.md (وضعیت فعلی)
```

---

## ⚖️ قوانین کار <a name="قوانین"></a>

### ✅ بایدها

1. **همیشه `AGENT_LOG.md` را update کنید** بعد از هر اقدام
2. **از مدل‌های AI رایگان استفاده کنید** (Gemini → DeepSeek → OpenRouter)
3. **همه commit ها با پیام فارسی** باشند
4. **تست کنید** قبل از commit
5. **از Git branch برای هر فیچر** استفاده کنید
6. **مستندات را به‌روز نگه دارید**
7. **فارسی‌سازی** را رعایت کنید (اعداد، تاریخ، پیام‌ها)

### ❌ نبایدها

1. ❌ فایل‌های ضروری را حذف نکنید (PROJECT_SPEC.md, AGENT_LOG.md, CLINE_INSTRUCTIONS.md, dadeh_kesht_novin.html)
2. ❌ API key ها را hardcode نکنید — از `.env` استفاده کنید
3. ❌ تغییرات بدون تست push نکنید
4. ❌ پلن‌های پولی (GPT-4, Claude) را بدون اجازه استفاده نکنید
5. ❌ iOS اپ نسازید (در MVP نیست)
6. ❌ سخت‌افزار آبیاری را کنترل نکنید (فقط نمایش)
7. ❌ محصولات غیر از گندم اضافه نکنید (در MVP)

---

## 🚀 مراحل اجرا <a name="مراحل"></a>

### مرحله ۰: آماده‌سازی سرور

**هدف:** نصب Node.js, pnpm, Docker, PostgreSQL+PostGIS, Redis, Apache

**اقدامات:**
1. بررسی نصب بودن `node`, `pnpm`, `docker`, `apache2`, `psql`, `redis-cli`
2. اگر نصب نیستند، نصب کن (دستورات در PROJECT_SPEC.md بخش ۵)
3. ایجاد دیتابیس `dadeh_kesht_novin` با کاربر `dkn_user`
4. فعال‌سازی PostGIS extension
5. ایجاد کاربر non-root `dkn-app` با sudo
6. تنظیم فایروال (UFW)
7. **به‌روزرسانی `AGENT_LOG.md`**
8. **به‌روزرسانی وضعیت در `AGENT_LOG.md`**

**معیار تکمیل:**
- ✅ `node --version` = v20.x
- ✅ `pnpm --version` = 8.x
- ✅ `docker --version` نصب
- ✅ `psql -c "SELECT PostGIS_Version()"` موفق
- ✅ `redis-cli ping` = PONG
- ✅ `apache2ctl -v` نصب

---

### مرحله ۱: راه‌اندازی پروژه

**هدف:** کلون پروژه و نصب وابستگی‌ها

**اقدامات:**
1. فایل `PROJECT_SPEC.md` را کامل بخوانید
2. اگر پروژه clone نشده، clone کنید یا فایل‌ها را کپی کنید
3. `pnpm install` اجرا کنید
4. `cp services/api/.env.example services/api/.env`
5. **ویرایش `.env`** با مقادیر واقعی:
   - `GEMINI_API_KEY` (از [aistudio.google.com](https://aistudio.google.com))
   - `OPENWEATHER_API_KEY` (از openweathermap.org)
   - `JWT_SECRET` (32+ کاراکتر تصادفی)
   - `DATABASE_URL` (با رمز واقعی)
6. `docker-compose up -d` (Postgres + Redis + MinIO)
7. `cd services/api && pnpm prisma generate && pnpm prisma migrate dev --name init`
8. `pnpm type-check` (بررسی خطا)
9. `pnpm dev` در دو ترمینال (یکی web، یکی api)
10. تست: `curl http://localhost:3000` و `curl http://localhost:3001/api/docs`

**معیار تکمیل:**
- ✅ `pnpm install` بدون خطا
- ✅ `docker-compose ps` همه سرویس‌ها Up
- ✅ `pnpm prisma migrate dev` موفق
- ✅ Frontend در `localhost:3000` باز می‌شود
- ✅ API Docs در `localhost:3001/api/docs` باز می‌شود

---

### مرحله ۲: تبدیل UI کارفرما به React

**هدف:** تبدیل `dadeh_kesht_novin.html` به ۷ کامپوننت Next.js

**اقدامات:**
1. فایل `dadeh_kesht_novin.html` را **کامل** بخوانید
2. طراحی بصری را حفظ کنید:
   - رنگ‌ها: `#2BB673`, `#58C4B6`
   - فونت Vazirmatn
   - Glassmorphism
   - RTL
3. ۷ صفحه Next.js در `apps/web/src/components/screens/` بسازید:
   - `login-screen.tsx`
   - `dashboard-screen.tsx`
   - `farms-screen.tsx`
   - `irrigation-screen.tsx`
   - `pest-screen.tsx`
   - `ai-screen.tsx`
   - `profile-screen.tsx`
4. State management با Zustand در `apps/web/src/store/app-store.ts`
5. از Lucide Icons استفاده کنید (نه emoji)
6. از Recharts استفاده کنید (نه Chart.js)
7. Navigation با `currentScreen` در state
8. تست کنید در مرورگر: `http://localhost:3000`

**معیار تکمیل:**
- ✅ هر ۷ صفحه کار می‌کند
- ✅ Navigation بین صفحات با BottomNav
- ✅ طراحی بصری هماهنگ با `dadeh_kesht_novin.html`
- ✅ Login → Dashboard → BottomNav کار می‌کند

---

### مرحله ۳: احراز هویت

**هدف:** OTP + JWT + Login UI

**اقدامات:**
1. Backend (`services/api/src/modules/auth/`):
   - `POST /auth/otp/send` — ارسال OTP (mock با console.log)
   - `POST /auth/otp/verify` — تأیید + ساخت JWT
   - `POST /auth/register` — ثبت‌نام
   - `POST /auth/login` — ورود
2. Frontend (`apps/web/src/components/screens/login-screen.tsx`):
   - فرم OTP (شماره → کد)
   - فرم ثبت‌نام کامل
   - ذخیره token در localStorage
3. JWT Guard برای protected routes
4. تست با curl:
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/otp/send -d '{"phone":"09123456789"}' -H "Content-Type: application/json"
   ```

**معیار تکمیل:**
- ✅ ارسال OTP کار می‌کند
- ✅ تأیید OTP کار می‌کند
- ✅ Token تولید می‌شود
- ✅ Login UI کار می‌کند

---

### مرحله ۴: مدیریت زمین با نقشه

**هدف:** CRUD زمین + نقشه Leaflet + محاسبه مساحت

**اقدامات:**
1. Backend (`services/api/src/modules/farms/`):
   - CRUD endpoints
   - ذخیره GeoJSON در PostGIS
   - محاسبه مساحت
2. Frontend:
   - نقشه Leaflet با OpenStreetMap
   - قابلیت ترسیم چندضلعی (Leaflet.Draw)
   - محاسبه خودکار مساحت
   - لیست زمین‌ها با کارت
3. تست: ایجاد زمین → نمایش در لیست → ویرایش → حذف

**معیار تکمیل:**
- ✅ ایجاد زمین با نقشه کار می‌کند
- ✅ مساحت خودکار محاسبه می‌شود
- ✅ لیست زمین‌ها نمایش داده می‌شود

---

### مرحله ۵: داشبورد و متریک‌ها

**هدف:** نمایش متریک‌های real-time

**اقدامات:**
1. Backend:
   - Mock generator برای متریک‌ها (هر ساعت)
   - GET /farms/:id/metrics
   - اتصال به OpenWeatherMap API
   - NDVI mock (از Sentinel-2 API یا mock)
2. Frontend:
   - Health Score Ring با animation
   - ۶ متریک با Sparkline
   - نمودار روند (تب‌ها)
   - پیش‌بینی آب‌وهوا
3. تست

**معیار تکمیل:**
- ✅ متریک‌ها هر ساعت update می‌شوند
- ✅ نمودارها render می‌شوند
- ✅ آب‌وهوا نمایش داده می‌شود

---

### مرحله ۶: آبیاری و آفات

**هدف:** توصیه‌های هوشمند + ریسک آفات

**اقدامات:**
1. Backend:
   - موتور توصیه آبیاری (rule-based)
   - موتور پیش‌بینی آفات گندم
   - Seed data آفات گندم
2. Frontend:
   - صفحه Irrigation با AI Hero
   - ۳ Zone با Progress
   - صفحه Pest با ۳ Gauge
   - لیست تهدیدات
3. تست

**معیار تکمیل:**
- ✅ توصیه آبیاری نمایش داده می‌شود
- ✅ ریسک آفات محاسبه می‌شود
- ✅ UI کامل کار می‌کند

---

### مرحله ۷: دستیار AI

**هدف:** چت با Gemini/DeepSeek/OpenRouter

**اقدامات:**
1. Backend (`services/api/src/modules/ai/`):
   - سرویس AI با fallback chain
   - System prompt با دانش کشاورزی ایران
   - Context مزرعه در پرامپت
   - Rate limiting
   - ذخیره تاریخچه
2. Frontend:
   - چت کامل
   - Suggestions
   - Typing indicator
3. تست:
   - سؤال: «کِی آبیاری کنم؟» → پاسخ مرتبط

**معیار تکمیل:**
- ✅ پاسخ AI در کمتر از ۵ ثانیه
- ✅ فارسی و ساده
- ✅ Fallback کار می‌کند

---

### مرحله ۸: اعلان‌ها و گزارش‌ها

**هدف:** Push + SMS + PDF

**اقدامات:**
1. Backend:
   - WebSocket برای real-time
   - BullMQ برای صف
   - PDF با puppeteer
2. Frontend:
   - صفحه اعلان‌ها
   - Badge تعداد
   - Toast برای real-time
   - صفحه گزارش‌ها
3. تست

---

### مرحله ۹: تنظیمات Apache

**هدف:** Deploy روی production

**اقدامات:**
1. ایجاد `/etc/apache2/sites-available/dadeh-kesht-novin.conf`
2. Reverse proxy
3. SSL با certbot
4. تست

---

### مرحله ۱۰: تست نهایی

**هدف:** آماده برای production

**اقدامات:**
1. E2E تست با Playwright
2. Lighthouse
3. Security headers
4. مستندات نهایی

---

## 📝 نحوه نوشتن لاگ <a name="لاگ"></a>

### قانون لاگ
**هر کاری که انجام می‌دهید، باید در `AGENT_LOG.md` ثبت شود.**

### فرمت لاگ

```markdown
## [تاریخ] [ساعت] — [عملیات]

**مرحله:** [شماره مرحله]
**وضعیت:** ✅ موفق / ⚠️ با خطا / ❌ ناموفق

### اقدامات:
- [لیست اقدامات انجام شده]

### نتیجه:
- [خلاصه نتیجه]

### خطاها (در صورت وجود):
- خطا: [پیام خطا]
- راه‌حل: [راه‌حل اعمال‌شده]

### فایل‌های تغییر یافته:
- [لیست فایل‌ها]

### مرحله بعدی:
- [کار بعدی]
```

### مثال واقعی

```markdown
## ۲۰۲۶-۰۶-۱۹ ۱۴:۳۰ — نصب PostgreSQL

**مرحله:** ۰
**وضعیت:** ✅ موفق

### اقدامات:
- اضافه کردن PostgreSQL repository
- نصب postgresql-15 و postgresql-15-postgis-3
- ایجاد کاربر dkn_user و دیتابیس dadeh_kesht_novin
- فعال‌سازی PostGIS extension
- تنظیم pg_hba.conf برای md5

### نتیجه:
- PostgreSQL 15.7 نصب شد
- PostGIS 3.4.1 فعال شد
- دیتابیس آماده

### فایل‌های تغییر یافته:
- /etc/postgresql/15/main/pg_hba.conf
- AGENT_LOG.md

### مرحله بعدی:
- نصب Redis
```

---

## 🔄 نحوه ادامه بعد از قطع <a name="ادامه"></a>

### اگر Cline قطع شد، چه کنم؟

1. **فایل `AGENT_LOG.md` را بخوانید** — آخرین وضعیت را می‌بینید
2. **بخش «مرحله فعلی» را پیدا کنید**
3. **بخش «مرحله بعدی» را بخوانید**
4. **ادامه دهید از آنجا**

### الگوی ادامه

```
$ cat AGENT_LOG.md
# آخرین entry را می‌خوانید
# مثال: "مرحله ۲ - نیمه‌تمام - login-screen.tsx ساخته شده، dashboard در حال ساخت"

$ cline
"AGENT_LOG.md را بخوان. از مرحله ۲ ادامه بده: dashboard-screen.tsx را طبق dadeh_kesht_novin.html کامل کن"
```

---

## 🐛 نحوه رفع خطا <a name="خطا"></a>

### اگر خطا رخ داد:

1. **در `AGENT_LOG.md` ثبت کن:**
   ```markdown
   ### خطاها:
   - خطا: `Error: Cannot find module '@nestjs/core'`
   - راه‌حل: `cd services/api && pnpm install`
   ```

2. **اگر خطای Cline/Environment بود:**
   - دستور را عوض کن
   - اگه نشد، به مرحله قبلی برگرد

3. **اگر خطای منطقی بود:**
   - در `AGENT_LOG.md` توضیح بده
   - راه‌حل را مستند کن

4. **اگر گیر کردی:**
   - `git status` بزن
   - `cat AGENT_LOG.md` بزن
   - به آخرین مرحله موفق برگرد

---

## 🎯 اولویت‌بندی کار

اگر زمان کم است:

| اولویت | فیچر |
|--------|------|
| 🔴 **P0** | Login + Dashboard + AI Chat + Farms list |
| 🟡 **P1** | Irrigation + Pest + Auth JWT |
| 🟢 **P2** | Map + Satellite + Notifications |
| 🔵 **P3** | Reports + Payments + iOS |

**حداقل قابل قبول:** مرحله ۰ تا ۷

---

## 📞 وقتی به مشکل خوردید

1. مستندات `PROJECT_SPEC.md` را بخوانید
2. اگر UI مشکل داشت، `dadeh_kesht_novin.html` را ببینید
3. اگر Backend مشکل داشت، لاگ NestJS را چک کنید
4. اگر Frontend مشکل داشت، Console مرورگر را چک کنید
5. اگر باز هم نشد، در `AGENT_LOG.md` مستند کنید و ادامه دهید

---

## 🚀 شروع!

اگر همه چیز را خواندید:

```bash
# فایل‌ها را تایید کنید:
ls -la
# باید این‌ها را ببینید:
# PROJECT_SPEC.md
# CLINE_INSTRUCTIONS.md (این فایل)
# AGENT_LOG.md
# dadeh_kesht_novin.html

# شروع مرحله ۰
claude "PROJECT_SPEC.md و CLINE_INSTRUCTIONS.md و AGENT_LOG.md را بخوان. مرحله ۰ (آماده‌سازی سرور) را شروع کن. هر کاری که می‌کنی در AGENT_LOG.md بنویس."
```

---

**موفق باشید! 🌿🚀**
