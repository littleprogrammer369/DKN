# 🏗 Project Architecture — داده کشت نوین

> **فلسفه: هر Feature = End-to-End** (Frontend + Backend + Database + Docs)
> وقتی تسک Feature X می‌گیرید، 0 تا 100 آن را خودتان می‌سازید.

---

## 🎯 فلسفه معماری

### ✅ Feature-Based (نه Layer-Based)

```
❌ Layer-Based (تداخل زیاد):
- نفر A: همه Frontend
- نفر B: همه Backend
- نفر C: همه Database
→ Integration دردسرساز

✅ Feature-Based (بدون تداخل):
- نفر A: Feature X کامل (UI + API + DB + Tests + Docs)
- نفر B: Feature Y کامل (UI + API + DB + Tests + Docs)
- هرکس مالک end-to-end
```

### 🏆 مزایا
- ✅ بدون تداخل
- ✅ مسئولیت روشن
- ✅ Integration آسان
- ✅ تست سریع
- ✅ Onboarding راحت‌تر

---

## 📂 ساختار Monorepo

```
DKN/
│
├── apps/
│   └── web/                          # 🌐 Frontend (Next.js 14)
│       ├── src/
│       │   ├── app/                  # Next.js App Router
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx          # Entry (state-based routing)
│       │   │   ├── providers.tsx     # React Query
│       │   │   └── globals.css
│       │   │
│       │   ├── components/
│       │   │   ├── ui/              # 🧱 UI primitives
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── badge.tsx
│       │   │   │   ├── modal.tsx
│       │   │   │   └── theme-toggle.tsx
│       │   │   │
│       │   │   ├── layout/          # 🏗 Layout
│       │   │   │   ├── bottom-nav.tsx
│       │   │   │   ├── header.tsx
│       │   │   │   └── app-shell.tsx
│       │   │   │
│       │   │   ├── widgets/         # 🧩 Reusable widgets
│       │   │   │   ├── health-gauge.tsx
│       │   │   │   ├── weather-card.tsx
│       │   │   │   ├── metric-card.tsx
│       │   │   │   ├── farm-zone-map.tsx
│       │   │   │   └── day-night-toggle.tsx
│       │   │   │
│       │   │   └── screens/         # 📱 Feature pages ← هر feature اینجا
│       │   │       ├── auth/        # Feature: Auth
│       │   │       │   ├── login-screen.tsx
│       │   │       │   ├── register-screen.tsx
│       │   │       │   └── onboarding-screen.tsx
│       │   │       ├── dashboard/   # Feature: Dashboard
│       │   │       │   └── dashboard-screen.tsx
│       │   │       ├── farms/       # Feature: Farms
│       │   │       │   ├── farms-screen.tsx
│       │   │       │   ├── farm-detail-screen.tsx
│       │   │       │   └── farm-map-widget.tsx
│       │   │       ├── irrigation/  # Feature: Irrigation
│       │   │       │   └── irrigation-screen.tsx
│       │   │       ├── pest/        # Feature: Pest
│       │   │       │   └── pest-screen.tsx
│       │   │       ├── ai-chat/     # Feature: AI Chat
│       │   │       │   ├── ai-screen.tsx
│       │   │       │   ├── chat-bubble.tsx
│       │   │       │   ├── typing-indicator.tsx
│       │   │       │   └── suggestion-chips.tsx
│       │   │       ├── weather/     # Feature: Weather
│       │   │       │   └── weather-screen.tsx
│       │   │       └── profile/     # Feature: Profile
│       │   │           └── profile-screen.tsx
│       │   │
│       │   ├── lib/                  # 🛠 Utilities
│       │   │   ├── api.ts           # Axios + JWT interceptor
│       │   │   ├── utils.ts         # Persian helpers
│       │   │   ├── theme.ts         # Day/Night tokens
│       │   │   └── constants.ts
│       │   │
│       │   ├── store/               # 🗃 Zustand stores
│       │   │   ├── app-store.ts     # Screen, auth
│       │   │   ├── farm-store.ts    # Selected farm
│       │   │   ├── theme-store.ts   # Theme mode
│       │   │   └── chat-store.ts    # AI conversations
│       │   │
│       │   ├── hooks/               # 🪝 Custom hooks
│       │   │   ├── useAuth.ts
│       │   │   ├── useFarms.ts
│       │   │   ├── useMetrics.ts
│       │   │   ├── useDayNight.ts
│       │   │   └── useExpertise.ts
│       │   │
│       │   └── types/               # 📝 Local types
│       │
│       ├── public/
│       │   ├── icons/
│       │   └── manifest.json        # PWA
│       │
│       ├── tailwind.config.ts
│       ├── next.config.js
│       └── package.json
│
├── services/
│   └── api/                          # 🔧 Backend (NestJS)
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   │
│       │   ├── modules/              # 📦 Feature modules ← هر feature اینجا
│       │   │   ├── auth/            # Feature: Auth
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── dto/
│       │   │   │   │   ├── login.dto.ts
│       │   │   │   │   ├── register.dto.ts
│       │   │   │   │   └── verify-otp.dto.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   └── jwt.strategy.ts
│       │   │   │   └── __tests__/
│       │   │   │       └── auth.service.spec.ts
│       │   │   │
│       │   │   ├── users/           # Feature: Users
│       │   │   ├── farms/           # Feature: Farms
│       │   │   │   ├── farms.module.ts
│       │   │   │   ├── farms.controller.ts
│       │   │   │   ├── farms.service.ts
│       │   │   │   ├── dto/
│       │   │   │   └── __tests__/
│       │   │   ├── metrics/         # Feature: Metrics
│       │   │   ├── irrigation/      # Feature: Irrigation
│       │   │   ├── pest/            # Feature: Pest
│       │   │   ├── ai/              # Feature: AI Chat
│       │   │   │   ├── ai.module.ts
│       │   │   │   ├── ai.controller.ts
│       │   │   │   ├── ai.service.ts        # Multi-model logic
│       │   │   │   ├── dto/
│       │   │   │   └── __tests__/
│       │   │   ├── satellite/       # Feature: Satellite
│       │   │   ├── weather/         # Feature: Weather
│       │   │   │   ├── weather.module.ts
│       │   │   │   ├── weather.controller.ts
│       │   │   │   ├── weather.service.ts   # OpenWeatherMap integration
│       │   │   │   └── __tests__/
│       │   │   ├── notifications/   # Feature: Notifications
│       │   │   └── reports/         # Feature: Reports
│       │   │
│       │   └── common/              # 🔧 Shared
│       │       ├── prisma/
│       │       │   ├── prisma.module.ts
│       │       │   └── prisma.service.ts
│       │       ├── guards/
│       │       │   ├── jwt-auth.guard.ts
│       │       │   └── roles.guard.ts
│       │       └── filters/
│       │           └── http-exception.filter.ts
│       │
│       ├── prisma/
│       │   ├── schema.prisma        # ← همه models اینجا
│       │   ├── migrations/
│       │   └── seed.ts              # Optional
│       │
│       └── package.json
│
├── packages/                        # 📚 Shared (Monorepo)
│   ├── types/                       # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── auth.ts
│   │   │   ├── farms.ts
│   │   │   ├── ai.ts
│   │   │   ├── weather.ts
│   │   │   └── index.ts            # Re-exports
│   │   └── package.json
│   │
│   ├── utils/                       # Shared utilities
│   │   ├── src/
│   │   │   ├── persian.ts          # Persian numbers, dates
│   │   │   ├── geometry.ts         # Area calculations
│   │   │   ├── validators.ts       # Zod schemas
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ui/                          # Shared UI components
│       ├── src/
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   └── index.ts
│       └── package.json
│
├── docs/                            # 📚 Documentation
│   ├── TECHNICAL_BLUEPRINT.md       # معماری کلی
│   ├── ARCHITECTURE.md              # این فایل
│   ├── features/                    # ← Feature-specific docs
│   │   ├── auth.md
│   │   ├── ai-chat.md
│   │   ├── weather.md
│   │   ├── farms.md
│   │   └── ...
│   └── adr/                        # Architecture Decision Records
│       └── 0001-multi-model-ai.md
│
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.md
│   │   └── feature.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── team/                            # 👥 Team docs
│   ├── README.md
│   ├── ONBOARDING.md
│   ├── WORKFLOW.md
│   ├── FEATURES.md
│   ├── COMMUNICATION.md
│   └── prompts/
│
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── BRANCHING.md
├── LICENSE
└── package.json
```

---

## 🎯 هر Feature جدید کجا اضافه شود

### وقتی تسک "Feature X" می‌گیرید:

#### ۱. Frontend (1 folder)
```
apps/web/src/components/screens/<feature>/
├── <feature>-screen.tsx       # Main page component
├── <sub-component>.tsx        # Sub-components (اختیاری)
└── index.ts                   # Re-exports
```

#### ۲. Backend (1 folder)
```
services/api/src/modules/<feature>/
├── <feature>.module.ts        # @Module decorator
├── <feature>.controller.ts    # REST endpoints
├── <feature>.service.ts       # Business logic
├── dto/                       # Request/Response DTOs
│   ├── create-<feature>.dto.ts
│   └── update-<feature>.dto.ts
├── strategies/                # Guards/strategies (اختیاری)
└── __tests__/
    └── <feature>.service.spec.ts
```

#### ۳. Database (1 model)
```prisma
// services/api/prisma/schema.prisma

model <Feature> {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  // ... fields

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@map("<features>")
}
```

سپس:
```bash
cd services/api
pnpm prisma migrate dev --name add_<feature>
```

#### ۴. Types (اختیاری)
```
packages/types/src/<feature>.ts

export interface <Feature> {
  id: string;
  // ... fields
}

// در index.ts اضافه کن:
export * from './<feature>';
```

#### ۵. Documentation
```
docs/features/<feature>.md

# <Feature>

## توضیح
## API Endpoints
## Data Flow
## Screenshots
## Known Issues
```

---

## 🛠 ابزارها و Pattern ها

### Frontend
| ابزار | کاربرد |
|--------|---------|
| **Next.js 14** | App Router + SSR |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling + Glassmorphism |
| **Zustand** | Client state |
| **React Query** | Server state + cache |
| **Recharts** | Charts |
| **Leaflet** | Maps (OSM) |
| **Framer Motion** | Animations |
| **react-hook-form** | Forms |
| **Zod** | Schema validation |
| **Radix UI** | Accessible primitives |

### Backend
| ابزار | کاربرد |
|--------|---------|
| **NestJS 10** | Modular framework |
| **TypeScript** | Type safety |
| **Prisma 5** | ORM |
| **PostgreSQL 15** | Database |
| **Redis 7** | Cache + Queue |
| **JWT + Passport** | Auth |
| **bcrypt** | Password hashing |
| **class-validator** | DTO validation |
| **Swagger** | API docs |
| **BullMQ** | Job queue |
| **Helmet** | Security headers |

### AI Layer
| ابزار | نقش |
|--------|------|
| **Gemini 1.5 Flash** | Primary (رایگان) |
| **DeepSeek Chat** | Fallback 1 (رایگان) |
| **OpenRouter Llama 3.1** | Fallback 2 (رایگان) |
| **System Prompt** | Dynamic per expertise level |

---

## 📝 نام‌گذاری (Naming Conventions)

### فایل‌ها
| نوع | الگو | مثال |
|------|------|-------|
| Component | `PascalCase.tsx` | `LoginScreen.tsx` |
| Utility | `camelCase.ts` | `formatDate.ts` |
| Type | `camelCase.ts` | `authTypes.ts` |
| Module (NestJS) | `kebab-case.module.ts` | `auth.module.ts` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_RETRY` |

### متغیرها
| نوع | الگو | مثال |
|------|------|-------|
| Component | `PascalCase` | `LoginForm` |
| Function | `camelCase` | `formatDate()` |
| Constant | `UPPER_SNAKE_CASE` | `API_URL` |
| Boolean | `is/has/can/should` | `isLoading` |

### Branches
| نوع | الگو | مثال |
|------|------|-------|
| Feature | `feature/<name>-<author>` | `feature/ai-chat-reza` |
| Bug fix | `fix/<description>-<author>` | `fix/login-validation-ali` |
| Hotfix | `hotfix/<description>` | `hotfix/security-patch` |

### Commits
```
feat(scope): description
fix(scope): description
docs: description
refactor(scope): description
test(scope): description
```

---

## 🚀 Workflow یک Feature جدید

وقتی تسک "Feature X" می‌گیرید:

### مرحله ۱: طراحی (۱ روز)
- [ ] Issue را بخوان
- [ ] طراحی UI (mockup یا متن)
- [ ] API contract تعریف کن
- [ ] با تیم sync کن (اگه shared است)

### مرحله ۲: Backend (۱-۲ روز)
- [ ] Module در `services/api/src/modules/<feature>/`
- [ ] Controller + Service + DTOs
- [ ] Prisma Schema (اگه نیاز است) + Migration
- [ ] Unit Tests
- [ ] Swagger decorators

### مرحله ۳: Frontend (۱-۲ روز)
- [ ] Screen در `apps/web/src/components/screens/<feature>/`
- [ ] State (Zustand + React Query)
- [ ] API Integration
- [ ] Loading + Error states
- [ ] UI polish

### مرحله ۴: Test + Documentation (نیم روز)
- [ ] Manual test
- [ ] Documentation در `docs/features/<feature>.md`
- [ ] PR review
- [ ] Merge

---

## 📊 مثال کامل: Feature "AI Chat"

### تسک: "پیاده‌سازی چت با AI"

### فایل‌های ایجاد شده:
```
apps/web/src/components/screens/ai-chat/
├── ai-screen.tsx              # Main page
├── chat-bubble.tsx            # Message bubble
├── typing-indicator.tsx       # Loading dots
└── suggestion-chips.tsx       # Quick replies

services/api/src/modules/ai/
├── ai.module.ts               # Module config
├── ai.controller.ts           # POST /ai/chat
├── ai.service.ts              # Multi-model logic
├── dto/
│   └── chat.dto.ts
└── __tests__/
    └── ai.service.spec.ts

services/api/prisma/schema.prisma
+ model ChatMessage { ... }

packages/types/src/ai.ts
+ export interface ChatMessage { ... }

docs/features/ai-chat.md
+ API docs, screenshots
```

### Branch: `feature/ai-chat-reza`
### PR Title: `feat(ai): چت با AI با context شخصی`

---

## ✅ قوانین مهم

### ✅ DO
- هر feature = end-to-end
- مالک کامل = FE + BE + DB + Tests + Docs
- Issue اول، کد بعد
- قبل از شروع، با تیم sync
- هر روز rebase از develop
- PR کوچک (< ۵۰۰ خط)

### ❌ DON'T
- یک نفر FE بزنه، دیگری BE (تداخل)
- بدون Issue شروع کن
- مستقیم push به main
- PR بزرگ (> ۱۰۰۰ خط)
- force push روی main/develop
- shared modules را بدون sync تغییر بده

---

## 🔄 Touch Points (نقاط اشتراک)

### Shared Modules (همه باید احتیاط کنند):
- `packages/types/` — Type definitions
- `packages/utils/` — Helper functions
- `packages/ui/` — Shared components
- `services/api/src/common/` — Guards, filters, prisma
- `apps/web/src/components/ui/` — UI primitives
- `apps/web/src/lib/` — API client, utils
- `apps/web/src/store/` — Zustand stores

### اگر نیاز به تغییر shared module:
1. ابتدا در Issue بحث کن
2. در standup sync با تیم
3. اگر OK، PR جداگانه
4. بعد از merge، feature PR

---

## 🆘 کمک

### سوال دارم:
1. این فایل را دوباره بخوان
2. در GitHub Issue بپرس
3. در Telegram پیام بده

### بلاکر:
- فوری در Telegram
- اگه بیش از ۲ ساعت، جلسه

---

## 🎯 خلاصه

**هر Feature = یک Folder = یک نفر = end-to-end**

وقتی تسک می‌گیرید، مالک کامل آن feature هستید. از UI تا API تا Database تا Documentation. این یعنی:
- ✅ بدون تداخل با دیگران
- ✅ مسئولیت کامل
- ✅ تست آسان
- ✅ Onboarding سریع

**موفق باشید! 🌿**
