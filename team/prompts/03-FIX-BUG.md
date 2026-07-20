# 🤖 پرامپت ۳: رفع Bug

> **وقتی یک bug پیدا شد، این پرامپت را اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: رفع یک bug.

## Context
- Issue: #[شماره bug]
- Bug: [توضیح کوتاه]
- اولویت: [P0 بحرانی / P1 مهم / P2 عادی]

## مرحله ۱: درک Bug

1. Issue را بخوان
2. Steps to reproduce را مرور کن
3. Expected vs Actual را بفهم
4. اگه واضح نیست، سؤال بپرس

## مرحله ۲: بازتولید Bug

1. محیط local را راه‌اندازی کن:
   bash:
   cd ~/DKN
   pnpm --filter api dev  # terminal 1
   pnpm --filter web dev  # terminal 2

2. Steps را دنبال کن
3. تأیید کن bug رخ می‌دهد

## مرحله ۳: Debug

### روش ۱: Console.log
```typescript
// در کد مشکوک:
console.log('DEBUG: value =', value);
```

### روش ۲: Debugger
- VS Code breakpoints
- Chrome DevTools (برای frontend)

### روش ۳: Logging
```bash
# Backend logs
pm2 logs dkn-api
# یا
tail -f logs/api-error.log
```

## مرحله ۴: تشخیص Root Cause

سؤال کن:
- چه تغییر کرده؟ (git log)
- آیا در محیط دیگر هم رخ می‌دهد؟
- آیا در شرایط خاص رخ می‌دهد؟ (race condition, memory leak)

### جستجو در Git
bash:
# آخرین تغییرات فایل مشکوک
git log --oneline path/to/file.ts

# تغییرات اخیر در شاخه develop
git log --oneline develop --since="2 weeks ago"
```

## مرحله ۵: نوشتن تست (TDD)

قبل از fix، یک تست بنویسید که bug را بازتولید کند:

```typescript
// services/api/src/modules/farms/__tests__/farms.service.spec.ts
describe('FarmsService', () => {
  it('should calculate area correctly', async () => {
    // Arrange
    const polygon = {...};
    // Act
    const area = service.calculateArea(polygon);
    // Assert
    expect(area).toBe(2.5);  // تست fail می‌شود
  });
});
```

تست باید fail شود → بعد fix → تست pass شود.

## مرحله ۶: Fix Bug

### قوانین
- کمترین تغییر ممکن
- بدون refactor اضافی
- فقط fix کن
- اگه refactor لازم است، در PR جداگانه

### مثال
```typescript
// ❌ قبل (bug):
function calculateArea(polygon) {
  return polygon.length * 100;  // اشتباه
}

// ✅ بعد (fix):
function calculateArea(polygon) {
  const R = 6371000;  // Earth radius in meters
  // محاسبه صحیح با Haversine
  let area = 0;
  for (let i = 0; i < polygon.length - 1; i++) {
    // ...
  }
  return area / 10000;  // m² to hectare
}
```

## مرحله ۷: Verify Fix

1. تست بنویسید و اجرا کنید → pass
2. Manual test در مرورگر
3. تست در محیط‌های مختلف (موبایل، دسکتاپ)
4. اگه regression دارید، fix کنید

```bash
cd services/api
pnpm test

cd ../..
pnpm --filter api dev
# در مرورگر تست کن
```

## مرحله ۱۸: Commit و PR

### Commit Message
```
fix(scope): description فارسی

توضیح کوتاه از root cause و fix.

مثال:
git commit -m "fix(farms): رفع محاسبه اشتباه مساحت با Haversine

- قبل: استفاده از فرمول ساده (× 100) که اشتباه بود
- بعد: استفاده از Haversine برای محاسبه دقیق
- تست اضافه شد

Fixes #XXX"
```

### Push و PR
bash:
git checkout develop
git pull origin develop
git checkout -b fix/[BRANCH-NAME]
git add .
git commit -m "fix: description"
git push origin fix/[BRANCH-NAME]

# ایجاد PR در GitHub
```

## مرحله ۹: بررسی Regression

قبل از merge، تست کنید:
- [ ] Bug اصلی fix شده
- [ ] تست‌های موجود pass
- [ ] هیچ feature دیگری broken نشده
- [ ] در محیط production-like تست شده

## مرحله ۱۰: مستندسازی

در Issue بنویسید:
- Root cause چه بود
- Fix چه کرد
- چطور تست کردید
- Risk assessment

## مرحله ۱۱: Hotfix (اگه بحرانی)

اگه bug بحرانی (سرور down):
- شاخه از **main** (نه develop)
- اسم: `hotfix/[BRANCH-NAME]`
- PR به **main**
- بعد از merge، cherry-pick یا merge به develop

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug
# ... fix ...
git push origin hotfix/critical-bug
# PR به main
# بعد از merge:
git checkout develop
git merge main
git push origin develop
```

---

## 🧪 الگوهای رایج Bug

### Null/Undefined
```typescript
// ❌ Crash
const name = user.name.toUpperCase();

// ✅ Safe
const name = user?.name?.toUpperCase() ?? '';
```

### Async/Await
```typescript
// ❌ Race condition
async function getData() {
  const a = await fetchA();
  const b = await fetchB();  // اگه fail بشه، a نمی‌ره
  return { a, b };
}

// ✅ Proper error handling
async function getData() {
  try {
    const a = await fetchA();
    const b = await fetchB();
    return { a, b };
  } catch (e) {
    logger.error(e);
    throw new ServiceException('Failed to fetch data');
  }
}
```

### SQL Injection (با Prisma امن است ولی...)
```typescript
// ✅ Prisma parameterized (safe)
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

### Memory Leak
```typescript
// ❌ Listener never removed
useEffect(() => {
  window.addEventListener('resize', handler);
}, []);

// ✅ Cleaned up
useEffect(() => {
  const handler = () => {...};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

---

## 🆘 بلاکر

اگه bug را نمی‌توانید حل کنید:
1. در Issue توضیح دهید چه امتحان کردید
2. در Telegram ping کنید
3. جلسه pair programming با نفر ۱

---

## ✅ Checklist

- [ ] Bug بازتولید شد
- [ ] Root cause شناسایی شد
- [ ] تست نوشته شد (قبل از fix fail می‌شود)
- [ ] Fix اعمال شد
- [ ] تست pass شد
- [ ] Manual test OK
- [ ] Regression test OK
- [ ] Commit message واضح
- [ ] PR ایجاد شد
- [ ] Documentation به‌روز

---

**🚀 باگ رفع شد! مستند کنید و یاد بگیرید.**
