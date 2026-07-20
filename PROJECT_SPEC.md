# 📋 مستند کامل پروژه — داده کشت نوین

> این فایل تنها منبع حقیقت (Single Source of Truth) پروژه است.
> Cline CLI باید این فایل را به‌طور کامل بخواند و طبق آن عمل کند.

---

## ۱. معرفی پروژه

### نام محصول
**داده کشت نوین** (Dadeh Kesht Novin)

### شعار
> «هوش مصنوعی در خدمت کشاورزی»

### توضیح یک‌خطی
اولین و تنها پلتفرم بومی ایران که فناوری‌های ماهواره‌ای، IoT و AI را با یک دستیار هوش مصنوعی اختصاصی یکپارچه می‌کند و در لحظه، با زبانی ساده، به کشاورز می‌گوید چه کار کند، کِی آبیاری کند، کِی سم بزند، چقدر کود بدهد و بهترین زمان برداشت چه موقع است.

### مزیت رقابتی
- کاهش هدر رفت آب
- افزایش ۳۰٪ سود خالص کشاورز
- در مقیاس ملی، جلوگیری از تبدیل محصولات به ضایعات

### محصول هدف اولیه
**گندم** (آفات، توصیه‌ها، محاسبات همه برای گندم بهینه شده‌اند)

### مخاطبان هدف
- کشاورزان خرد (۱-۵ هکتار) — **اولویت اصلی**
- کشاورزان بزرگ (۵-۵۰ هکتار)
- شرکت‌ها و تعاونی‌ها
- سازمان‌های دولتی (آینده)

### منطقه تست بتا
**ساوه** ❤️ — ۱۰ کاربر اول

---

## ۲. اهداف کمی

| شاخص | هدف MVP | هدف نهایی |
|------|---------|-----------|
| کاربر فعال | ۱۰۰ | ۱۰,۰۰۰ |
| دقت توصیه AI | > ۸۵٪ | > ۹۵٪ |
| زمان پاسخ | < ۲s | < ۱s |
| Retention ماه اول | > ۶۰٪ | > ۸۰٪ |
| NPS | > ۴۰ | > ۶۰ |
| افزایش سود | +۱۰٪ | +۳۰٪ |

---

## ۳. نیازمندی‌های کارفرما (۹۰ پاسخ)

### ۳.۱ احراز هویت و کاربران

| سؤال | پاسخ کارفرما |
|------|--------------|
| روش ورود | ✅ موبایل + کد OTP، ورود با گوگل، ورود با اثر انگشت |
| احراز هویت دو مرحله‌ای (2FA) | ✅ فقط پلن سازمانی + اختیاری برای کاربر |
| انواع کاربران | ✅ کشاورز حقیقی + شرکت/سازمان |
| تأیید هویت (KYC) | ✅ فقط با موبایل (ساده) |
| ورود مهمان | ✅ بله، با محدودیت |
| دعوت دوستان | ✅ بله، با پاداش |

### ۳.۲ مدیریت زمین

| سؤال | پاسخ |
|------|------|
| اطلاعات زمین | ✅ نام، محصول، GPS، نوع خاک (اختیاری)، تاریخ کشت، منبع آب، سیستم آبیاری، شهر/استان |
| قابلیت‌های نقشه | ✅ نمایش، ترسیم چندضلعی، محاسبه خودکار مساحت، لایه ماهواره، لایه NDVI، GPS زنده، آفلاین، OpenStreetMap |
| تعداد زمین | پلن رایگان: ۱، بقیه: ۳ |
| اشتراک‌گذاری | فقط مشاهده (read-only) |
| بخش‌بندی | سفارشی توسط کاربر |
| تاریخچه | بله، چند فصل |
| تگ‌گذاری | بله، با تگ دلخواه |

### ۳.۳ داشبورد و پایش

| سؤال | پاسخ |
|------|------|
| شاخص‌های ماهواره | NDVI + EVI + SAVI + NDWI + MSI |
| منبع ماهواره | ترکیبی: Sentinel-2 (رایگان، هر ۵ روز) + Planet (پولی، روزانه) + Maxar |
| سنسورها | سنسور رطوبت خاک + ایستگاه هواشناسی |
| فرکانس | هر ساعت |
| منبع آب‌وهوا | ترکیبی: OpenWeatherMap + WeatherAPI + سازمان هواشناسی ایران |
| مقایسه ادوار | بله + فصل به فصل |

### ۳.۴ آبیاری

| سؤال | پاسخ |
|------|------|
| اتوماسیون | فقط توصیه (دستی) — بدون کنترل خودکار در MVP |
| اتصال سخت‌افزار | فقط نمایش بدون کنترل — **در آینده** |
| روش‌ها | قطره‌ای + بارانی + سطحی + زیرزمینی |
| محاسبه آب | هر دو: بر اساس محصول + بر اساس تبخیر |
| گزارش صرفه‌جویی | فقط حجم آب |
| هشدار نشتی | خیر — حذف از MVP |

### ۳.۵ آفات و بیماری‌ها

| سؤال | پاسخ |
|------|------|
| روش تشخیص | ترکیب همه: داده محیطی + گزارش + تصویر |
| تشخیص با تصویر | ✅ بله — **ولی در MVP نیست، برای فاز ۲** |
| آفات اولویت | آفات رایج **گندم** |
| توصیه سم | فقط با ماده مؤثره (نه نام تجاری) |
| تاریخچه سم‌پاشی | بله |
| کتابخانه آفات | بله، با تصویر |

### ۳.۶ دستیار AI

| سؤال | پاسخ |
|------|------|
| قابلیت‌ها | پاسخ به سؤالات + تحلیل داده مزرعه + توصیه عملیات |
| مدل زبانی | **OpenAI GPT-4** یا **Claude** — یادداشت کارفرما: «Anthropic و OpenAI تحلیلی خوب دارن، DeepSeek ارزون ولی ضعیف. پیشنهاد: آخرین مدل GPT/Claude.» |
| دسترسی AI به داده | فقط خلاصه |
| حافظه | بله، بلند مدت |
| تشخیص صوتی | بله، فارسی |
| آموزش تعاملی | متنی |
| محدودیت استفاده | بر اساس توکن (کنترل هزینه) |

> **نکته مهم:** کارفرما GPT-4/Claude را ترجیح داده، ولی باید از **مدل‌های رایگان** به‌عنوان جایگزین استفاده شود (Gemini، DeepSeek، OpenRouter).

### ۳.۷ کوددهی و برداشت

| سؤال | پاسخ |
|------|------|
| توصیه کوددهی | هر دو: آزمایش خاک + نوع محصول |
| آپلود آزمایش خاک | ✅ با OCR + دستی |
| ثبت عملیات | بله، کامل (لاگ) |
| پیش‌بینی برداشت | بله، با AI |
| اتصال بازار | فقط نمایش قیمت (بدون خرید/فروش) |

### ۳.۸ اعلان‌ها

| سؤال | پاسخ |
|------|------|
| کانال‌ها | Push Notification + SMS |
| رویدادهای بحرانی | بیماری + تنش آبی + سرمازدگی + طوفان + خرابی سنسور |
| تنظیمات اعلان | سفارشی کامل |
| ساعات سکوت | خیر |
| اعلان بازاریابی | بله، برای پلن رایگان |

### ۳.۹ گزارش‌ها

| سؤال | پاسخ |
|------|------|
| نوع گزارش | هفتگی + ماهانه + فصلی + سالانه + سفارشی |
| فرمت خروجی | PDF |
| اشتراک‌گذاری | بله |
| گزارش خودکار | با ایمیل |

### ۳.۱۰ پلن‌ها و پرداخت

| سؤال | پاسخ |
|------|------|
| پلن‌ها | رایگان + پایه + حرفه‌ای + سازمانی |
| محدودیت رایگان | ۱ زمین + بدون AI + گزارش محدود + ۷ روز تاریخچه |
| درگاه پرداخت | زرین‌پال + اسنپ‌پی + درگاه بانکی |
| قیمت‌گذاری | سالانه (با تخفیف) |
| دوره آزمایشی | ۳۰ روز |
| کد تخفیف | با پاداش معرفی |
| فاکتور رسمی | بله |

### ۳.۱۱ پشتیبانی

| سؤال | پاسخ |
|------|------|
| کانال‌ها | چت + تلفن + تلگرام + مرکز تماس |
| ساعات | ۲۴/۷ |
| پایگاه دانش | دسته‌بندی شده |
| ویدئو آموزشی | در اپ |

### ۳.۱۲ پلتفرم و زیرساخت

| سؤال | پاسخ |
|------|------|
| پلتفرم | وب (PWA) + اندروید — **بدون iOS در فاز اول** |
| آفلاین | فقط نمایش داده‌های ذخیره شده |
| تکنولوژی فرانت | **انتخاب تیم فنی** |
| بک‌اند | **انتخاب تیم فنی** |
| زبان | فقط فارسی |
| تم تیره | دستی |
| واحد | هکتار/متریک |
| کاربران | کمتر از ۱۰۰۰ + ۱۰۰۰-۱۰۰۰۰ — **در MVP** |

### ۳.۱۳ سخت‌افزار و یکپارچه‌سازی

| سؤال | پاسخ |
|------|------|
| سخت‌افزار | IoT + ایستگاه هواشناسی |
| پروتکل | LoRaWAN + 4G/5G |
| دوربین موبایل | اختیاری |
| GPS موبایل | اختیاری |
| سیستم‌های خارجی | خیر |

### ۳.۱۴ امنیت و حریم خصوصی

| سؤال | پاسخ |
|------|------|
| سطح امنیت | بالا (2FA + رمزنگاری) + سازمانی (کامل) |
| محل داده | فقط ایران |
| تأییدیه قانونی | حریم خصوصی ایران |
| خروجی داده | بله |

### ۳.۱۵ اهداف تجاری

| سؤال | پاسخ |
|------|------|
| مخاطب | همه موارد (B2C + B2B + B2G) |
| محصول هدف | گندم |
| زمان‌بندی | **MVP در ۳ ماه** |
| فازبندی | ۲ فاز (MVP + کامل) |
| بودجه | بسته به نیاز |
| بازاریابی | فقط طراحی و توسعه (بدون بازاریابی) |
| تست بتا | ۱۰ کاربر |
| نکته آزاد | «پر شده با ❤️ در ساوه» |

---

## ۴. معماری سیستم

### ۴.۱ معماری کلی

```
┌──────────────────────────────────────────┐
│  📱 Frontend (Next.js PWA + Android APK) │
│  React + TypeScript + Tailwind + Recharts│
└─────────────────┬────────────────────────┘
                  │ REST + WebSocket
┌─────────────────▼────────────────────────┐
│      🌐 Apache (Reverse Proxy + SSL)     │
│  your-domain.com → localhost:3000/3001   │
└─────────────────┬────────────────────────┘
                  │
┌─────────────────▼────────────────────────┐
│       🔧 Backend (NestJS API)            │
│  TypeScript + Prisma + Swagger + JWT     │
└──────┬─────────┬──────────┬─────────┬────┘
       │         │          │         │
       ▼         ▼          ▼         ▼
┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│PostgreSQL│ │ Redis  │ │  AI    │ │   SMTP   │
│ PostGIS  │ │ Cache  │ │ Gemini │ │  SMS     │
└──────────┘ └────────┘ │DeepSeek│ └──────────┘
                       │OpenRouter│
                       └────────┘
```

### ۴.۲ ساختار Monorepo

```
dadeh-kesht-novin/
├── apps/
│   └── web/                  # Next.js 14 (Frontend)
│       ├── src/
│       │   ├── app/          # App Router
│       │   ├── components/   # کامپوننت‌ها
│       │   ├── lib/          # توابع کمکی
│       │   ├── store/        # Zustand state
│       │   └── types/        # TypeScript types
│       └── package.json
├── services/
│   └── api/                  # NestJS (Backend)
│       ├── src/
│       │   ├── modules/      # feature modules
│       │   │   ├── auth/
│       │   │   ├── farms/
│       │   │   ├── metrics/
│       │   │   ├── irrigation/
│       │   │   ├── pest/
│       │   │   ├── ai/
│       │   │   └── notifications/
│       │   ├── common/       # shared (prisma, guards)
│       │   └── main.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
└── packages/
    ├── types/                # TypeScript types مشترک
    ├── utils/                # توابع کمکی مشترک
    └── ui/                   # کامپوننت‌های مشترک
```

### ۴.۳ Frontend Stack

| تکنولوژی | دلیل انتخاب |
|-----------|------------|
| **Next.js 14** (App Router) | SSR + SEO + Image Optimization |
| **TypeScript** | ایمنی نوع، IDE بهتر |
| **Tailwind CSS** | سرعت توسعه، هماهنگی با UI |
| **Zustand** | State ساده، بدون boilerplate |
| **React Query** | Server state + cache |
| **Recharts** | نمودارهای تعاملی |
| **Framer Motion** | انیمیشن‌های نرم |
| **Lucide Icons** | آیکون‌های زیبا (نه emoji) |
| **Leaflet** | نقشه رایگان + OpenStreetMap |
| **Radix UI** | Accessibility + Headless components |

### ۴.۴ Backend Stack

| تکنولوژی | دلیل |
|-----------|------|
| **NestJS** | ساختار ماژولار، TypeScript-native |
| **PostgreSQL 15 + PostGIS** | داده‌های مکانی، ACID |
| **Prisma ORM** | type-safe، migration آسان |
| **Redis** | Cache + Queue (BullMQ) |
| **JWT + Passport** | احراز هویت امن |
| **Swagger** | مستندات خودکار |
| **Helmet** | Security headers |
| **Throttler** | Rate limiting |
| **class-validator** | Validation فارسی |

### ۴.۵ هوش مصنوعی

سه لایه با fallback:

```
لایه ۱: Google Gemini 1.5 Flash (رایگان، سریع)
     ↓ اگه خطا
لایه ۲: DeepSeek Chat (رایگان، خوب برای فارسی)
     ↓ اگه خطا
لایه ۳: OpenRouter (Llama 3.1 70B رایگان)
     ↓ اگه خطا
Fallback: پاسخ ساده
```

> **توجه:** کارفرما GPT-4/Claude را ترجیح داده. ولی چون ما در محیط رایگان توسعه می‌دهیم، ابتدا از مدل‌های رایگان استفاده می‌کنیم. در production، می‌توان به GPT-4o-mini ارتقا داد.

### ۴.۶ مدل‌های دیتابیس (Prisma)

```prisma
// خلاصه — فایل کامل: services/api/prisma/schema.prisma
- User              (کاربر)
- Farm              (مزرعه)
- FarmZone          (بخش‌های مزرعه)
- FarmMetrics       (متریک‌های لحظه‌ای)
- SatelliteData     (NDVI, EVI, ...)
- IrrigationRecommendation
- IrrigationSchedule
- PestThreat        (آفات)
- PestAlert         (هشدارها)
- ChatMessage       (پیام‌های AI)
- Notification      (اعلان‌ها)
- Report            (گزارش‌ها)
```

---

## ۵. زیرساخت سرور (Ubuntu 20.04)

### ۵.۱ مشخصات مورد نیاز

| منبع | حداقل | توصیه‌شده |
|------|--------|-----------|
| CPU | ۱ core | ۲ core |
| RAM | ۲GB | ۴GB |
| Storage | ۲۰GB | ۵۰GB |
| OS | Ubuntu 20.04 LTS | Ubuntu 20.04 LTS |

### ۵.۲ نصب‌ها

```bash
# Node.js 20 (از nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20 && nvm use 20

# pnpm
corepack enable && npm install -g pnpm

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# PostgreSQL 15 + PostGIS
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-15 postgresql-15-postgis-3

# Redis
sudo apt install -y redis-server

# Apache + SSL
sudo apt install -y apache2
sudo a2enmod proxy proxy_http proxy_wstunnel ssl headers rewrite
sudo apt install -y certbot python3-certbot-apache

# Cline CLI
npm install -g cline

# PM2 (process manager)
npm install -g pm2
```

### ۵.۳ ساختار دیتابیس

```sql
-- ایجاد کاربر و دیتابیس
CREATE USER dkn_user WITH PASSWORD 'SECURE_PASSWORD';
CREATE DATABASE dadeh_kesht_novin OWNER dkn_user;

-- فعال‌سازی PostGIS
\c dadeh_kesht_novin
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### ۵.۴ فایروال

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Apache Full'
sudo ufw enable
```

---

## ۶. طراحی UI/UX

### ۶.۱ تم بصری

| عنصر | مقدار |
|------|-------|
| **رنگ اصلی** | `#2BB673` (سبز کشاورزی) |
| **رنگ ثانویه** | `#58C4B6` (فیروزه‌ای) |
| **Success** | `#22C55E` |
| **Warning** | `#F59E0B` |
| **Danger** | `#EF4444` |
| **Info** | `#3B82F6` |
| **متن اصلی** | `#1F2937` |
| **متن ثانویه** | `#4B5563` |
| **پس‌زمینه** | گرادیانت `#F7FBF8 → #EEF8F3 → #F5FAFA` |
| **فونت** | Vazirmatn (۴۰۰-۸۰۰) |
| **Border Radius** | ۱۴-۲۴px |
| **Glass Effect** | `backdrop-filter: blur(20px)` |

### ۶.۲ ۷ صفحه اصلی

| # | صفحه | هدف | المان‌های کلیدی |
|---|------|-----|----------------|
| ۱ | **Login/Register** | احراز هویت | لوگو، تب‌ها، فرم OTP/Password |
| ۲ | **Dashboard** | نمای کلی | Health Score Ring، ۶ متریک، نمودار، توصیه AI، آب‌وهوا |
| ۳ | **Farms** | مدیریت زمین | لیست کارت، آمار، دکمه افزودن، مدال ترسیم |
| ۴ | **Irrigation** | کنترل آبیاری | AI Hero، ۴ متریک، ۲ نمودار، ۳ Zone، ۳ دکمه کنترل |
| ۵ | **Pest** | پایش آفات | ۳ Gauge ریسک، لیست تهدیدات، تایم‌لاین، توصیه |
| ۶ | **AI Chat** | چت با AI | Header، پیام‌ها، Suggestions، Input |
| ۷ | **Profile** | تنظیمات | آواتار، ۳ آمار، ۵ منو، Logout |

### ۶.۳ Navigation Flow

```
Login ──→ Dashboard (پیش‌فرض)
            ├── Farms
            ├── Irrigation
            ├── Pest
            ├── AI Chat
            └── Profile
                └── Logout → Login
```

### ۶.۴ Bottom Navigation

```
[داشبورد] [زمین‌ها] [آبیاری] [آفات] [AI] [پروفایل]
```

### ۶.۵ فایل مرجع UI

**فایل:** `dadeh_kesht_novin.html` (همین پوشه)

این فایل HTML/CSS/JS توسط کارفرما ارائه شده و **مرجع اصلی طراحی** است. Cline باید:
1. این فایل را بخواند
2. طراحی بصری (رنگ، فونت، Glassmorphism) را حفظ کند
3. ساختار را به React/Next.js تبدیل کند
4. داده‌های hardcode شده را با state واقعی جایگزین کند

---

## ۷. پیاده‌سازی Frontend (Next.js)

### ۷.۱ ساختار فایل

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # صفحه اصلی (با state screen)
│   │   ├── providers.tsx     # React Query
│   │   └── globals.css       # Tailwind + custom CSS
│   ├── components/
│   │   ├── ui/               # Button, Card, Input, Badge
│   │   ├── layout/           # BottomNav
│   │   └── screens/          # ۷ صفحه اصلی
│   ├── lib/
│   │   └── utils.ts          # توابع فارسی و کمکی
│   └── store/
│       └── app-store.ts      # Zustand
├── tailwind.config.ts        # تم اختصاصی
├── next.config.js
└── package.json
```

### ۷.۲ State Management

با Zustand:

```typescript
interface AppState {
  currentScreen: 'login' | 'dashboard' | 'farms' | 'irrigation' | 'pest' | 'ai' | 'profile';
  isAuthenticated: boolean;
  user: User | null;
  farms: Farm[];
  selectedFarmId: string | null;
  metrics: FarmMetrics | null;
  satelliteData: SatelliteData | null;
  chatHistory: ChatMessage[];
  notifications: AppNotification[];
}
```

### ۷.۳ صفحه Login

```typescript
// apps/web/src/components/screens/login-screen.tsx
'use client';
import { useState } from 'react';
import { Sprout, Bot, Satellite, Droplets } from 'lucide-react';
// دو تب: "ورود" و "ثبت‌نام"
// ورود: نام کاربری + تلفن (نمایش فعلی)
// ثبت‌نام: نام + نام خانوادگی + نام کاربری + رمز + تکرار رمز
```

### ۷.۴ صفحه Dashboard

```typescript
// apps/web/src/components/screens/dashboard-screen.tsx
// شامل:
// 1. Health Score Ring (SVG با animation)
// 2. ۶ متریک با Sparkline (Recharts)
// 3. بینش ماهواره‌ای (NDVI, EVI)
// 4. توصیه‌های AI (۳ کارت با اولویت)
// 5. پیش‌بینی آب‌وهوا
// 6. نمودار روند (تب: رطوبت/دما/بارش/سلامت)
```

### ۷.۵ صفحه Farms

```typescript
// apps/web/src/components/screens/farms-screen.tsx
// 1. Header با دکمه "+ افزودن زمین"
// 2. کارت آمار کلی
// 3. لیست کارت‌های مزرعه
// 4. مدال افزودن (با نقشه)
// 5. مدال ترسیم محدوده (Leaflet)
```

### ۷.۶ صفحه Irrigation

```typescript
// apps/web/src/components/screens/irrigation-screen.tsx
// 1. AI Hero با توصیه
// 2. ۴ متریک
// 3. نمودار رطوبت
// 4. نمودار مصرف آب هفتگی
// 5. وضعیت ۳ بخش
```

### ۷.۷ صفحه Pest

```typescript
// apps/web/src/components/screens/pest-screen.tsx
// 1. ۳ Gauge نیم‌دایره (آفات/بیماری/علف هرز)
// 2. لیست تهدیدات (با اولویت و درصد احتمال)
// 3. تایم‌لاین هشدارها
// 4. توصیه‌های پیشگیری AI
```

### ۷.۸ صفحه AI Chat

```typescript
// apps/web/src/components/screens/ai-screen.tsx
// 1. Header با آواتار AI و وضعیت آنلاین
// 2. Chat area با پیام‌ها
// 3. Suggestions (افقی)
// 4. Input + دکمه ارسال
// 5. Typing indicator
```

### ۷.۹ صفحه Profile

```typescript
// apps/web/src/components/screens/profile-screen.tsx
// 1. آواتار + نام + نقش + badge
// 2. آمار (مزرعه/مساحت/عضویت)
// 3. ۵ آیتم منو
// 4. دکمه خروج
```

---

## ۸. پیاده‌سازی Backend (NestJS)

### ۸.۱ ساختار

```
services/api/
├── src/
│   ├── main.ts               # entry point
│   ├── app.module.ts         # root module
│   ├── modules/
│   │   ├── auth/             # OTP + JWT
│   │   ├── farms/            # CRUD farms
│   │   ├── metrics/          # realtime data
│   │   ├── irrigation/       # smart irrigation
│   │   ├── pest/             # pest monitoring
│   │   ├── ai/               # AI assistant
│   │   ├── notifications/    # push + SMS
│   │   └── reports/          # PDF generation
│   └── common/
│       ├── prisma/           # PrismaService
│       ├── guards/           # JWT guard
│       └── filters/          # error handlers
├── prisma/
│   └── schema.prisma         # دیتابیس
└── .env.example
```

### ۸.۲ Auth Module

```typescript
// services/api/src/modules/auth/auth.service.ts
class AuthService {
  // ارسال OTP به موبایل
  async sendOtp(phone: string): Promise<{ expiresIn: number }>;
  
  // تأیید OTP و ورود
  async verifyOtp(phone: string, code: string): Promise<{
    user: User;
    token: string;
    isNew: boolean;
  }>;
  
  // ثبت‌نام با رمز عبور
  async register(data: { ... }): Promise<{ user; token }>;
  
  // ورود با رمز عبور
  async loginWithPassword(username, password): Promise<{ user; token }>;
}
```

### ۸.۳ API Endpoints

```
POST   /api/v1/auth/otp/send           ارسال OTP
POST   /api/v1/auth/otp/verify         تأیید OTP
POST   /api/v1/auth/register           ثبت‌نام
POST   /api/v1/auth/login              ورود

GET    /api/v1/users/me                پروفایل من
PUT    /api/v1/users/me                ویرایش

GET    /api/v1/farms                   لیست زمین‌ها
POST   /api/v1/farms                   ایجاد
GET    /api/v1/farms/:id               جزئیات
PUT    /api/v1/farms/:id               ویرایش
DELETE /api/v1/farms/:id               حذف

GET    /api/v1/farms/:id/metrics       متریک فعلی
GET    /api/v1/farms/:id/metrics/history  تاریخچه
GET    /api/v1/farms/:id/satellite     NDVI

GET    /api/v1/farms/:id/irrigation/recommendations
POST   /api/v1/irrigation/schedules    زمان‌بندی
GET    /api/v1/farms/:id/water-usage   مصرف آب

GET    /api/v1/farms/:id/pest/threats  تهدیدات
POST   /api/v1/farms/:id/pest/spray    ثبت سم‌پاشی
GET    /api/v1/pest/library            کتابخانه آفات

POST   /api/v1/ai/chat                 ارسال پیام
GET    /api/v1/ai/history              تاریخچه
DELETE /api/v1/ai/history              پاک کردن

GET    /api/v1/notifications           لیست
PUT    /api/v1/notifications/:id/read  خوانده شد

GET    /api/v1/reports                 لیست
POST   /api/v1/reports/generate        تولید
GET    /api/v1/reports/:id/download    دانلود
```

---

## ۹. تنظیمات Apache

### ۹.۱ VirtualHost

```apache
# /etc/apache2/sites-available/dadeh-kesht-novin.conf
<VirtualHost *:80>
    ServerName your-domain.com
    
    # API
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    # Frontend
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # WebSocket
    ProxyPass /ws ws://localhost:3001/ws
    ProxyPassReverse /ws ws://localhost:3001/ws
    
    # Security Headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    ErrorLog ${APACHE_LOG_DIR}/dkn-error.log
    CustomLog ${APACHE_LOG_DIR}/dkn-access.log combined
</VirtualHost>
```

### ۹.۲ فعال‌سازی

```bash
sudo a2ensite dadeh-kesht-novin
sudo systemctl restart apache2

# SSL
sudo certbot --apache -d your-domain.com
```

---

## ۱۰. نقشه راه (۱۰ مرحله)

| # | مرحله | زمان | خروجی |
|---|--------|------|--------|
| ۰ | آماده‌سازی سرور | ۱۵ دقیقه | Node, Docker, Postgres, Apache, SSL |
| ۱ | راه‌اندازی پروژه | ۳۰ دقیقه | Monorepo + Prisma migrate |
| ۲ | تبدیل UI کارفرما | ۲ ساعت | ۷ صفحه React |
| ۳ | احراز هویت | ۳ ساعت | OTP + JWT + UI |
| ۴ | مدیریت زمین با نقشه | ۴ ساعت | CRUD + نقشه + محاسبه مساحت |
| ۵ | داشبورد و متریک‌ها | ۴ ساعت | API + Chart + Weather |
| ۶ | آبیاری و آفات | ۳ ساعت | توصیه + ریسک |
| ۷ | دستیار AI | ۴ ساعت | Gemini + DeepSeek + OpenRouter |
| ۸ | اعلان‌ها و گزارش‌ها | ۳ ساعت | Push + SMS + PDF |
| ۹ | تنظیمات Apache | ۱ ساعت | VirtualHost + SSL |
| ۱۰ | تست نهایی | ۲ ساعت | E2E + Lighthouse + Security |

**جمع:** ~۲۵ ساعت کار

---

## ۱۱. متغیرهای محیطی (.env)

```bash
# Server
NODE_ENV=development
PORT=3001
CORS_ORIGINS=http://localhost:3000,http://your-domain.com

# Database
DATABASE_URL=postgresql://dkn_user:PASSWORD@localhost:5432/dadeh_kesht_novin?schema=public
REDIS_URL=redis://:PASSWORD@localhost:6379

# JWT (32+ کاراکتر تصادفی)
JWT_SECRET=GENERATE_RANDOM_STRING_HERE
JWT_EXPIRES_IN=30d

# AI (رایگان)
GEMINI_API_KEY=                # از aistudio.google.com
DEEPSEEK_API_KEY=              # از platform.deepseek.com
OPENROUTER_API_KEY=            # از openrouter.ai

# Weather
OPENWEATHER_API_KEY=
WEATHERAPI_KEY=

# Satellite
SENTINEL_HUB_CLIENT_ID=
SENTINEL_HUB_CLIENT_SECRET=

# Payment
ZARINPAL_MERCHANT_ID=
SNAPPPAY_API_KEY=

# SMS
KAVENEGAR_API_KEY=

# Push
FCM_SERVER_KEY=
```

---

## ۱۲. دستورات مهم

### نصب
```bash
pnpm install
cd services/api && pnpm prisma generate && pnpm prisma migrate dev
```

### اجرا (Development)
```bash
# Frontend
pnpm --filter web dev          # پورت ۳۰۰۰

# Backend
pnpm --filter api dev          # پورت ۳۰۰۱
```

### اجرا (Production با PM2)
```bash
pnpm build
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### دستورات Prisma
```bash
cd services/api
pnpm prisma generate           # تولید کلاینت
pnpm prisma migrate dev        # migration جدید
pnpm prisma migrate deploy     # اعمال در production
pnpm prisma studio             # UI دیتابیس
```

### Docker
```bash
docker-compose up -d           # شروع
docker-compose down            # توقف
docker-compose logs -f         # لاگ
```

---

## ۱۳. معیارهای موفقیت (Acceptance Criteria)

### US-001: ثبت‌نام
- ✅ کاربر در کمتر از ۳۰ ثانیه ثبت‌نام کند
- ✅ شماره موبایل اعتبارسنجی شود
- ✅ کد OTP در ۶۰ ثانیه ارسال شود
- ✅ خطاها به فارسی باشند

### US-002: ترسیم زمین
- ✅ کاربر بتواند با کشیدن چندضلعی ترسیم کند
- ✅ مساحت خودکار محاسبه شود
- ✅ GeoJSON در PostGIS ذخیره شود
- ✅ خطای GPS مدیریت شود

### US-003: مشاهده سلامت
- ✅ امتیاز در کمتر از ۲ ثانیه نمایش داده شود
- ✅ عدد ۰-۱۰۰ با رنگ‌بندی مناسب
- ✅ آخرین زمان بروزرسانی نمایش داده شود

### US-004: توصیه آبیاری
- ✅ زمان + مدت + میزان آب
- ✅ درصد اطمینان
- ✅ دکمه اقدام فعال
- ✅ اعلان تأیید پس از اقدام

### US-005: چت با AI
- ✅ پاسخ در کمتر از ۵ ثانیه
- ✅ فارسی ساده
- ✅ حافظه مکالمه
- ✅ محدودیت توکن

---

## ۱۴. فایل‌های مرجع در پروژه

| فایل | توضیح |
|------|-------|
| **`dadeh_kesht_novin.html`** | UI مرجع کارفرما — Cline باید از این شروع کند |
| **`CLINE_INSTRUCTIONS.md`** | دستورالعمل دقیق برای Cline |
| **`AGENT_LOG.md`** | فایل لاگ — Cline هر کاری که می‌کند را اینجا بنویسد |

---

## ۱۵. ریسک‌ها

| ریسک | راه‌حل |
|------|--------|
| هزینه بالای AI API | استفاده از مدل‌های رایگان (Gemini/DeepSeek/OpenRouter) |
| کیفیت پایین Sentinel-2 | ترکیب با Planet برای نقاط بحرانی |
| پذیرش پایین کشاورزان | UI بسیار ساده + آموزش |
| اینترنت ضعیف روستا | آفلاین‌ترین تجربه ممکن |
| قطعی Cline CLI | فایل AGENT_LOG.md برای ادامه کار |

---

## ۱۶. خلاصه برای Cline

اگر Cline این فایل را خوانده:
1. **هدف:** ساخت MVP در ۳ ماه
2. **محصول:** گندم (اول)
3. **پلتفرم:** PWA + Android
4. **محل داده:** فقط ایران
5. **AI:** ابتدا رایگان (Gemini → DeepSeek → OpenRouter)
6. **Backend:** NestJS + Prisma + PostgreSQL
7. **Frontend:** Next.js + Tailwind
8. **Deploy:** Apache روی Ubuntu 20
9. **UI مرجع:** `dadeh_kesht_novin.html`
10. **دستورالعمل:** `CLINE_INSTRUCTIONS.md`
11. **لاگ:** `AGENT_LOG.md`

**شروع کن! 🚀**

---

**آخرین بروزرسانی:** ۱۹ ژوئن ۲۰۲۶
**نسخه:** ۱.۰
**ساخته شده برای پروژه «داده کشت نوین»** 🌿
