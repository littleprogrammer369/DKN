# راهنمای توسعه دهنده - داده کشت نوین

## 1. UI/UX Guidelines

اصول کلی:
- تمام صفحات RTL (dir=rtl) با فونت Vazirmatn
- رنگ اصلی برند: #2BB673 (brand-green)
- حداکثر عرض صفحه: max-w-[420px] (موبایل فرست)
- پس زمینه: گرادینت سبز ملایم

کلاس های CSS قابل استفاده (در globals.css):
- کارت: .glass, .glass-deep, .card
- دکمه: .btn-primary (گرادینت سبز), .btn-outline
- اینپوت: .input-glass
- نشانگر: .badge, .badge-success, .badge-warn, .badge-danger
- چت: .msg-ai, .msg-user, .bubble-ai, .bubble-user
- nav-bar, section-title, chip, prog-bg, prog-fill

ساختار هر صفحه:
<div className="mb-4">
  <p className="text-xs text-gray-500">توضیح</p>
  <h1 className="text-lg font-extrabold text-gray-800">عنوان</h1>
</div>

NavBar (5 آیتم ثابت):
1. داشبورد (/dashboard) - icon: ◉
2. زمین ها (/farms) - icon: ⬡
3. دستیار (/ai) - icon: ✦
4. آبیاری (/irrigation) - icon: 💧
5. آفات (/pests) - icon: 🔍

نکته: برای اضافه کردن آیتم به NavBar با تیم هماهنگ کنید.

## 2. Frontend Guidelines

نکات کلیدی:
- Token در localStorage با کلید "token"
- هدر: Authorization: Bearer {token}
- fetch("/api/v1/xxx", { headers: { Authorization: "Bearer " + token } })
- اعداد فارسی: onlyDigits() از lib/utils.ts
- تاریخ شمسی: JALALI_MONTHS و jalaliToGregorian()
- همیشه loading + error + empty states داشته باشید
- اگر لاگین نیست: router.push("/")
- استایل فقط Tailwind (کلاس های سفارشی در globals.css)
- TypeScript و interface برای type definitions

## 3. Backend Guidelines

ساختار هر Module:
- xxx.module.ts + xxx.controller.ts + xxx.service.ts
- ماژول جدید را در app.module.ts import کنید
- Prefix: /api/v1 (global)
- Auth: @UseGuards(AuthGuard("jwt"))
- کاربر: req.user.id
- Validation: class-validator
- پیام خطا به فارسی

## 4. Database Guidelines

- فقط Prisma (raw SQL ممنوع)
- IDها: uuid @db.Uuid
- Soft delete: isActive
- migration: pnpm prisma migrate dev --name <name>

## 5. Security Guidelines

- bcryptjs hash با salt rounds 10
- همیشه ownership بررسی شود (userId == req.user.id)
- هرگز token در URL نگذارید
- هرگز password در response برنگردانید
- .env برای environment variables

## 6. Git Workflow

Branches: master (stable), develop (main), feature/<name>, fix/<name>

Commit format: feat(scope): desc | fix(scope): desc | docs(scope): desc

Workflow:
git checkout develop && git pull
git checkout -b feature/my-feature
# code + commits
git push origin feature/my-feature
# Create PR on GitHub

Rules: no direct push to master | no force push | PR < 500 lines

## 7. Feature Workflow (0 تا 100)

1. Backend: module + controller + service + schema (if needed)
2. Frontend: page + components + API integration
3. Loading + Error + Empty states
4. UI مطابق Design System
5. PR to develop
