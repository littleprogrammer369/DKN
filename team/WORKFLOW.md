# 🔄 Workflow تیم — تقسیم کار موازی

> این فایل توضیح می‌دهد چطور دو نفر بدون تداخل روی یک پروژه کار کنند.

---

## 👥 اعضای تیم

| نقش | نام | تمرکز اصلی |
|------|-----|------------|
| **نفر ۱ (مسئول)** | [نام شما] | Frontend + AI + Security + Integrations |
| **نفر ۲ (جدید)** | [نام همکار] | Backend + Database + Features دامداری |

---

## 🎯 تقسیم Features

### 🔵 نفر ۱: Frontend + AI

**P0 (اولویت بالا — هفته اول):**
- [ ] Login + Register + OTP
- [ ] Onboarding (تشخیص سطح دانش)
- [ ] Dashboard اصلی
- [ ] AI Chat (Multi-Model)
- [ ] Day/Night Mode
- [ ] Theme Switcher

**P1:**
- [ ] Profile
- [ ] Notifications (Push + SMS)
- [ ] Settings
- [ ] PWA (Offline mode)

### 🟢 نفر ۲: Backend + Data Features

**P0 (اولویت بالا — هفته اول):**
- [ ] Farm Management (CRUD + Map)
- [ ] Farm Detail Screen
- [ ] Irrigation Page (AI توصیه)
- [ ] Pest Page (3 Gauge)
- [ ] Metrics Module (Real-time)
- [ ] Map with Leaflet

**P1:**
- [ ] Reports Module (PDF + Excel)
- [ ] Sensors Integration (IoT)
- [ ] Database Optimization
- [ ] Backend Architecture

---

## 📐 قوانین کار موازی (بدون تداخل)

### ۱. هر feature = یک branch جدا

```bash
# الگوی نام‌گذاری:
feature/<category>-<short-name>-<author>

# مثال‌ها:
feature/auth-otp-reza
feature/farm-crud-ali
feature/ai-chat-sara
feature/irrigation-recommendations-hassan
```

### ۲. فایل‌های مشترک = هماهنگی اول

اگر نفر ۱ و ۲ هر دو باید یک فایل shared را تغییر دهند:
1. اول یکی از آن‌ها PR ایجاد می‌کند
2. دیگری صبر می‌کند تا merge شود
3. سپس دیگری از develop pull می‌کند
4. سپس کار خود را شروع می‌کند

**مثال:**
```bash
# نفر ۱: تغییر در packages/types/index.ts
git checkout -b feature/types-auth
# ... تغییرات ...
git commit -m "feat(types): اضافه کردن Auth types"
git push origin feature/types-auth
# PR → merge به develop

# نفر ۲: بعد از merge نفر ۱
git checkout develop
git pull origin develop  # types جدید را می‌گیرد
git checkout -b feature/farm-types
# حالا می‌تواند از types جدید استفاده کند
```

### ۳. روزانه sync

```bash
# هر روز صبح:
git checkout develop
git pull origin develop
```

### ۴. قبل از PR: rebase

```bash
git checkout feature/my-feature
git fetch origin
git rebase origin/develop
# حل conflict اگه وجود داشت
git push origin feature/my-feature --force-with-lease
```

---

## 📅 Daily Standup (هر روز ۱۰ دقیقه)

**زمان:** هر روز صبح ۱۰:۰۰

**هر نفر ۳ سؤال جواب می‌دهد:**
1. **دیروز** چه کار کردم؟
2. **امروز** چه می‌کنم؟
3. **blocker** دارم؟

**محل:** Telegram group یا تماس صوتی ۱۰ دقیقه‌ای

---

## 🔄 Git Workflow هر نفر

### شروع روز
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

### حین کار
```bash
# commit های کوچک و frequent
git add .
git commit -m "feat: اضافه کردن X"
git commit -m "test: اضافه کردن تست برای X"
```

### پایان روز
```bash
# اگه کار تمام است:
git push origin feature/my-feature
# ایجاد PR در GitHub

# اگه نیمه‌تمام است:
git push origin feature/my-feature
# بدون PR، فقط push برای backup
```

### قبل از PR
```bash
git fetch origin
git rebase origin/develop
# حل conflict
git push origin feature/my-feature --force-with-lease
```

### بعد از تأیید و merge
```bash
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```

---

## 📋 Definition of Done (DoD)

یک feature آماده merge است وقتی:

- [ ] کد نوشته شده
- [ ] تست نوشته شده (اگه منطق تجاری دارد)
- [ ] type-check pass شده
- [ ] lint pass شده
- [ ] روی localhost تست شده
- [ ] در dev branch تست شده (با داده واقعی)
- [ ] README یا docs به‌روز شده (اگه API جدید)
- [ ] PR description کامل است
- [ ] حداقل ۱ reviewer تأیید کرده
- [ ] CI pass شده
- [ ] Conflict با develop حل شده

---

## 🚨 حل Conflict

اگر دو نفر همزمان یک فایل را تغییر دادند:

### روش ۱: Pair Programming
- هر دو با هم در یک جلسه
- یکی resolve می‌کند
- دیگری review می‌کند

### روش ۲: تقسیم فایل
- اگر conflict در یک فایل بزرگ است
- فایل را به دو فایل تقسیم کنید
- هر کس مالک یک فایل

### روش ۳: آخرین نفر برنده
- اگر تغییرات نفر B بر اساس نفر A است
- نفر B merge می‌کند و conflict را حل می‌کند

---

## 📊 Weekly Release

**هر جمعه:**
1. Merge develop → main
2. Tag version (مثلاً v0.1.0)
3. Deploy به staging
4. تست smoke
5. اگه OK، deploy به production

**Release checklist:**
- [ ] همه features تست شده
- [ ] CI pass
- [ ] مستندات به‌روز
- [ ] CHANGELOG.md update
- [ ] version bump در package.json

---

## 🛡 Code Review

### قوانین
- هر PR باید حداقل ۱ review داشته باشد
- Reviewer نباید خود author باشد
- Review باید در ۲۴ ساعت انجام شود

### Reviewer چه چک کند
- [ ] کد تمیز و خوانا است
- [ ] منطق درست است
- [ ] تست‌ها کافی هستند
- [ ] type-safe است
- [ ] با convention ها مطابقت دارد
- [ ] performance خوب است
- [ ] امنیت رعایت شده

---

## 📞 Escalation

| مشکل | کجا مطرح کنیم |
|------|---------------|
| فنی (bug، conflict) | GitHub Issue |
| معماری | جلسه فوری + Issue |
| team (تعارض) | صحبت مستقیم + mediator |
| فوری (سرور down) | تلفن + Telegram فوری |

---

**🌿 با رعایت این قوانین، پروژه منظم پیش می‌رود و هیچ‌کس قفل نمی‌شود.**
