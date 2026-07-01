# ✨ Features — لیست کارها و مالک

> این فایل به‌روز می‌شود. هر نفر مالک features مشخص شده است.

**آخرین به‌روزرسانی:** [تاریخ]

---

## 🎯 استراتژی کلی

هر feature = **end-to-end** (Frontend + Backend + Database).
هر نفر مالک یک feature کامل است. این یعنی:
- تداخل کم
- مسئولیت روشن
- تست ساده‌تر

---

## 🔵 نفر ۱: [نام شما]

### P0 (اولویت بالا)

| Feature | Frontend | Backend | Database | تخمین |
|---------|----------|----------|----------|--------|
| **Authentication (OTP + Password)** | ✅ | ✅ | ✅ | ۱ هفته |
| **AI Chat (Multi-Model)** | ✅ | ✅ | ✅ | ۱ هفته |
| **Dashboard** | ✅ | - | - | ۳ روز |
| **Onboarding (سطح دانش)** | ✅ | ✅ | ✅ | ۲ روز |
| **Day/Night Mode** | ✅ | - | - | ۱ روز |

### P1

| Feature | Frontend | Backend | Database | تخمین |
|---------|----------|----------|----------|--------|
| **Profile** | ✅ | ✅ | ✅ | ۲ روز |
| **Notifications** | ✅ | ✅ | ✅ | ۳ روز |
| **Settings** | ✅ | ✅ | - | ۱ روز |
| **PWA + Offline** | ✅ | - | - | ۲ روز |

### P2 (آینده)

| Feature | اولویت | یادداشت |
|---------|--------|---------|
| Multi-language | پایین | کردی، عربی، ترکی |
| Voice input/output | پایین | TTS + STT |
| Gamification | پایین | Achievement |

---

## 🟢 نفر ۲: [نام همکار]

### P0 (اولویت بالا)

| Feature | Frontend | Backend | Database | تخمین |
|---------|----------|----------|----------|--------|
| **Farm Management (CRUD + Map)** | ✅ | ✅ | ✅ | ۱ هفته |
| **Farm Detail** | ✅ | ✅ | - | ۲ روز |
| **Irrigation Page** | ✅ | ✅ | ✅ | ۱ هفته |
| **Pest Page (3 Gauge + Threats)** | ✅ | ✅ | ✅ | ۱ هفته |
| **Metrics Module** | ✅ | ✅ | ✅ | ۱ هفته |
| **Map with Leaflet** | ✅ | - | - | ۳ روز |

### P1

| Feature | Frontend | Backend | Database | تخمین |
|---------|----------|----------|----------|--------|
| **Reports (PDF + Excel)** | ✅ | ✅ | - | ۳ روز |
| **Sensors Integration (IoT)** | - | ✅ | ✅ | ۱ هفته |
| **Satellite Integration** | - | ✅ | ✅ | ۱ هفته |
| **Harvest Tracking** | ✅ | ✅ | ✅ | ۳ روز |

### P2

| Feature | اولویت | یادداشت |
|---------|--------|---------|
| Weather API | متوسط | OpenWeatherMap |
| Multi-tenant | پایین | برای تعاونی‌ها |

---

## 🔄 Shared (هر دو باید هماهنگ کنند)

### Backend Shared
- `services/api/src/common/` (Prisma, Guards, Filters)
- `services/api/src/modules/notifications/` (interface)

### Frontend Shared
- `apps/web/src/lib/` (api, utils, theme)
- `apps/web/src/store/` (Zustand stores)
- `apps/web/src/components/ui/` (UI primitives)

### Packages Shared
- `packages/types/` (TypeScript types)
- `packages/utils/` (helper functions)

### قوانین Shared
1. اگر نفر ۱ باید type جدید اضافه کند → PR اول، merge، بعد نفر ۲ استفاده کند
2. اگر هر دو همزمان نیاز دارند → جلسه sync
3. اگر conflict → pair programming

---

## 📊 Tracking با GitHub Issues

هر feature = یک Issue با:
- **Labels:** `feature`, `P0`/`P1`/`P2`, `frontend`/`backend`/`fullstack`
- **Assignee:** نفر مسئول
- **Milestone:** Sprint
- **Project:** Kanban board

### Milestones (Sprints)
- **Sprint 1 (هفته ۱-۲):** P0 features
- **Sprint 2 (هفته ۳-۴):** بقیه P0 + شروع P1
- **Sprint 3 (هفته ۵-۶):** P1 features
- **Sprint 4 (هفته ۷-۸):** P2 features + polish

---

## ✅ Definition of Ready (آماده برای شروع)

یک feature آماده شروع است وقتی:
- [ ] Issue در GitHub ایجاد شده
- [ ] Label و Assignee دارد
- [ ] در Sprint قرار دارد
- [ ] Acceptance criteria مشخص است
- [ ] با نفر دیگر sync شده (اگه shared است)
- [ ] وابستگی‌ها بررسی شده

---

## 🎯 Sprint فعلی: [نام Sprint]

**تاریخ:** [از تاریخ] تا [تا تاریخ]

### Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

### در حال انجام (نفر ۱)
- [ ] Feature 1
- [ ] Feature 2

### در حال انجام (نفر ۲)
- [ ] Feature 1
- [ ] Feature 2

### بلاکرها
- (هیچ)

---

**🌿 این فایل هر هفته به‌روز می‌شود.**
