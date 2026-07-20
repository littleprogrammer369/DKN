# 📘 Technical Blueprint — داده کشت نوین

> مستند کامل فنی پروژه از ۰ تا ۱۰۰
> برای جلسه سرمایه‌گذاری و تیم فنی
> تاریخ: ژوئن ۲۰۲۶ | نسخه: ۱.۰

---

## ۱. نمای کلی سیستم

```
┌──────────────────────────────────────────┐
│  📱 FRONTEND (Next.js 14 PWA + Android)  │
│  React + TypeScript + Tailwind + Recharts│
└─────────────────┬────────────────────────┘
                  │ REST + WebSocket
┌─────────────────▼────────────────────────┐
│       🌐 Apache Reverse Proxy + SSL       │
└─────────────────┬────────────────────────┘
                  │
┌─────────────────▼────────────────────────┐
│   🔧 BACKEND (NestJS 10 API)             │
│   TypeScript + Prisma + Swagger + JWT    │
└────┬──────────┬──────────┬──────────┬─────┘
     │          │          │          │
     ▼          ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────┐
│PostgreSQL│ │ Redis  │ │ AI      │ │External│
│ PostGIS │ │ Cache  │ │ Multi-  │ │ APIs   │
│         │ │ Queue  │ │ Model   │ │(SMS,   │
│         │ │        │ │(Gemini) │ │Weather)│
└─────────┘ └────────┘ └─────────┘ └────────┘
```

---

## ۲. Frontend (Next.js 14)

### Tech Stack
- Next.js 14 (App Router) + TypeScript 5.5
- Tailwind CSS 3.4
- Zustand 4.5 (Client State)
- React Query 5 (Server State)
- Recharts 2.12 (نمودار)
- Leaflet 1.9 (نقشه)
- Framer Motion 11 (انیمیشن)

### Pages
- Login/Register
- Onboarding (تشخیص سطح دانش)
- Dashboard
- Farms (List + Detail + Map)
- Irrigation
- Pest
- AI Chat
- Profile

### State Management
```typescript
interface AppState {
  currentScreen, isAuthenticated, user,
  language, farms, selectedFarmId,
  metrics, satelliteData, chatHistory,
  notifications, isOnline
}
```

### Design System
- **Primary:** `#2BB673` (سبز کشاورزی)
- **Secondary:** `#58C4B6` (فیروزه‌ای)
- **Font:** Vazirmatn
- **Border Radius:** 14-24px
- **Glassmorphism:** backdrop-blur(20px)

---

## ۳. Backend (NestJS 10)

### Modules (۱۰ ماژول)
1. **Auth** — OTP + JWT + bcrypt
2. **Users** — Profile + Settings
3. **Farms** — CRUD + GeoJSON
4. **Metrics** — Real-time data
5. **Irrigation** — AI توصیه + Schedule
6. **Pest** — Threats + Alerts
7. **AI** — Multi-Model Chat
8. **Satellite** — NDVI/EVI
9. **Notifications** — Push + SMS
10. **Reports** — PDF + Excel

### API Endpoints
```
POST   /api/v1/auth/otp/send
POST   /api/v1/auth/otp/verify
POST   /api/v1/auth/register
GET    /api/v1/users/me
GET    /api/v1/farms
POST   /api/v1/farms
GET    /api/v1/farms/:id/metrics
GET    /api/v1/farms/:id/irrigation/recommendations
POST   /api/v1/ai/chat
GET    /api/v1/notifications
```

### Security
- bcrypt (12 rounds)
- JWT (HS256, 30 days)
- Refresh Token (90 days)
- 2FA (Enterprise)
- RBAC (5 roles)
- Helmet + Throttler

---

## ۴. Database (PostgreSQL + PostGIS)

### ۱۳ Models
1. User
2. Farm
3. FarmZone
4. FarmMetrics
5. SatelliteData
6. IrrigationRecommendation
7. IrrigationSchedule
8. PestThreat
9. PestAlert
10. ChatMessage
11. Notification
12. Report
13. IoTSensor

### Indexes
- phone, username (User)
- farmId + timestamp (Metrics)
- farmId + date (Satellite)
- GIST (geometry — PostGIS)

---

## ۵. AI Layer (Multi-Model + Personalization)

### Strategy
```
Layer 1: Gemini 1.5 Flash (رایگان، فارسی عالی)
   ↓ خطا
Layer 2: DeepSeek Chat (رایگان)
   ↓ خطا
Layer 3: OpenRouter Llama 3.1 (رایگان)
   ↓ خطا
Fallback: Default Response
```

### Personal Context (هر کاربر)
```typescript
interface UserAIContext {
  user: {
    expertiseLevel: 'simple' | 'farmer' | 'expert' | 'engineer',
    city, province, yearsOfExperience
  },
  farm: {
    name, crop, area, growthStage
  },
  conditions: {
    soilMoisture, airTemperature, ndvi,
    lastIrrigation, lastFertilizer
  }
}
```

### Expertise Levels (۴ سطح)
- **Simple:** 🌱 مبتدی — emoji، بدون اصطلاح، ۱۰۰ کلمه
- **Farmer:** 🌾 با تجربه — اصطلاح رایج، ۲۰۰ کلمه
- **Expert:** 🌳 خبره — اصطلاح تخصصی، ۳۰۰ کلمه
- **Engineer:** 🔬 مهندس — فرمول، مقاله، ۵۰۰ کلمه

### Fine-tune (آینده)
- فاز ۲: Fine-tune Llama 3 روی GPU ($500/ماه)
- فاز ۳: مدل اختصاصی ($2-5K یک‌بار)

---

## ۶. Infrastructure

### Server
- Ubuntu 20.04 LTS
- 4 vCPU, 8GB RAM, 80GB SSD
- Location: Iran (ArvanCloud)

### Docker
```yaml
postgres: postgis/postgis:16-3.4
redis: redis:7-alpine
minio: minio/minio (S3-compatible)
```

### Apache
- Reverse Proxy + mod_ssl
- Let's Encrypt SSL
- Security Headers (Helmet)
- Gzip compression

### PM2
- 2 instances (cluster mode) for API
- 1 instance for Web

---

## ۷. Security (Defence in Depth)

### ۶ لایه امنیتی
1. **Network:** UFW Firewall + Apache Headers
2. **Transport:** HTTPS + TLS 1.3 + HSTS
3. **Application:** Helmet + Input Validation
4. **Authentication:** JWT + bcrypt + 2FA
5. **Authorization:** RBAC (5 roles)
6. **Data:** Encryption + Location: Iran

### Compliance
- مطابقت با قوانین حریم خصوصی ایران
- Backup روزانه
- RTO: 1 ساعت, RPO: 24 ساعت

---

## ۸. Day/Night Mode

- **Auto-detect** با `prefers-color-scheme`
- **Manual toggle** در Profile
- **Day Theme:** Light green gradient
- **Night Theme:** Dark blue with green accent

---

## ۹. User Expertise Levels

### Onboarding (۵ سؤال)
- چند سال است کشاورزی می‌کنید؟
- تحصیلات شما چیست؟
- آیا با اصطلاحات کشاورزی آشنا هستید؟
- از تکنولوژی استفاده می‌کنید؟
- هدف شما از اپ چیست؟

### UI Differences
- **Simple:** فونت بزرگ، emoji، دکمه بزرگ
- **Engineer:** فونت کوچک، فرمول، Debug Mode

---

## ۱۰. Roadmap

### فاز ۱ (۳ ماه): MVP
- Authentication
- Dashboard
- AI Chat (Multi-Model)
- Day/Night Mode
- Farm Management
- Irrigation + Pest

### فاز ۲ (۶ ماه): ویژگی‌ها
- PWA (Offline)
- Push + SMS
- Multi-language
- Computer Vision

### فاز ۳ (۱۲ ماه): AI شخصی
- Fine-tune Llama 3
- GPU Server
- Custom Model

### فاز ۴ (۱۸ ماه): مقیاس
- Kubernetes
- Multi-server
- CDN

### فاز ۵ (۲۴ ماه): تسلط
- صادرات
- B2B
- Marketplace

---

## ۱۱. سوالات سرمایه‌گذار

### Q: چرا Next.js؟
A: SSR + SEO + PWA. با Capacitor می‌توان APK اندروید ساخت.

### Q: هزینه AI؟
A: ۰ تومان با Gemini + DeepSeek + OpenRouter (رایگان).

### Q: امنیت؟
A: Defence in Depth با ۶ لایه. داده فقط در ایران.

### Q: مقیاس‌پذیری؟
A: Docker + Kubernetes (آینده). در ۱۰K کاربر multi-server.

### Q: چرا شما موفق می‌شوید؟
A: اولین پلتفرم بومی. ۴ سطح دانش. داده محلی.

---

## ۱۲. خلاصه

- ✅ Frontend: Next.js + TypeScript
- ✅ Backend: NestJS + Prisma
- ✅ Database: PostgreSQL + PostGIS
- ✅ AI: Multi-Model + Personalization
- ✅ Infrastructure: Docker + Apache + PM2
- ✅ Security: Defence in Depth
- ✅ UX: Day/Night + Expertise Levels
- ✅ Roadmap: ۵ فاز، ۵ سال

---

**© ۲۰۲۶ داده کشت نوین — Technical Blueprint v1.0**
