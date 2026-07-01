# 🤖 پرامپت ۱: شروع Feature جدید

> **وقتی نفر جدید می‌خواهد روی یک feature کار کند، این پرامپت را اجرا کند.**

---

## 📋 پرامپت اصلی

```
وظیفه: شروع کار روی یک feature جدید.

## Context
- Issue: #[شماره issue در GitHub]
- Feature: [نام feature]
- مالک: [نام نفر جدید]
- شاخه هدف: develop

## مرحله ۱: Sync با develop

bash:
cd ~/DKN
git checkout develop
git pull origin develop

## مرحله ۲: ایجاد شاخه feature

نام شاخه باید این الگو را داشته باشد:
feature/<category>-<short-name>-<yourname>

مثال‌ها:
- feature/auth-otp-reza
- feature/farm-crud-ali
- feature/ai-chat-sara

bash:
git checkout -b feature/[BRANCH-NAME]

## مرحله ۳: بررسی Issue

قبل از شروع:
1. Issue را در GitHub بخوان
2. Acceptance criteria را مرور کن
3. اگه سوال داری، در Issue کامنت بگذار
4. اگه با کار دیگری تداخل داره، با هم sync کن

## مرحله ۴: طراحی (اگه feature بزرگ است)

اگه feature بیش از ۲ روز کار دارد:
1. طراحی در Issue یا docs کنید
2. API contract تعریف کنید (اگه backend)
3. UI mockup (اگه frontend)
4. با نفر ۱ review کنید

## مرحله ۵: شروع کدنویسی

### قوانین
- TypeScript با type کامل (بدون any)
- کامنت فارسی برای منطق پیچیده
- Commit های کوچک و frequent
- Format خودکار با prettier

### Commit Pattern
bash:
# مثال:
git add services/api/src/modules/farms/farms.service.ts
git commit -m "feat(farms): اضافه کردن create farm endpoint"

git add services/api/src/modules/farms/__tests__/
git commit -m "test(farms): اضافه کردن تست برای create"

## مرحله ۶: تست محلی

### Backend
bash:
cd services/api
pnpm type-check
pnpm lint || echo "warnings only"
pnpm test

### Frontend
bash:
cd apps/web
pnpm type-check
pnpm lint || echo "warnings only"
pnpm build  # تست build

### Manual Test
bash:
cd ~/DKN
pnpm --filter api dev  # terminal 1
pnpm --filter web dev  # terminal 2
# در مرورگر: http://localhost:3000
# تست feature دستی

## مرحله ۷: Push و PR

bash:
git push origin feature/[BRANCH-NAME]

# در GitHub:
# 1. Create PR
# 2. عنوان: feat(<scope>): description
# 3. توضیح: چه + چرا + چطور تست
# 4. Closes #XXX
# 5. Reviewer: [نفر ۱]
# 6. Labels: feature, P0/P1

## مرحله ۸: Review Cycle

1. منتظر review بمان
2. اگه تغییر خواسته شد، fix و push مجدد
3. بعد از تأیید، merge توسط نفر ۱

## مرحله ۹: بعد از Merge

bash:
git checkout develop
git pull origin develop
git branch -d feature/[BRANCH-NAME]

# ادامه به feature بعدی
git checkout -b feature/[NEXT-FEATURE]
```

---

## 💡 Best Practices

### ✅ DO
- هر روز حداقل ۱ commit
- PR کوچک (< ۵۰۰ خط تغییر)
- قبل از PR، rebase روی develop
- در PR description توضیح بده چه + چرا
- اگه blocked، فوری اطلاع بده

### ❌ DON'T
- PR بزرگ (> ۱۰۰۰ خط)
- commit "WIP" یا "fix" بدون توضیح
- force push روی main/develop
- مستقیم push به main (Branch Protection!)
- merge بدون review

---

## 🆘 بلاکرها

اگه بلاکر شدی:
1. مستند کن چه چیزی بلاک است
2. در GitHub Issue کامنت بگذار
3. در Telegram فوری اطلاع بده
4. اگه بیش از ۲ ساعت طول کشید، جلسه فوری

---

## ✅ Checklist قبل از PR

- [ ] همه کد کار می‌کنه (build + dev)
- [ ] TypeScript بدون error
- [ ] Lint بدون error جدید
- [ ] تست‌ها pass
- [ ] Manual test انجام شده
- [ ] Documentation به‌روز (اگه API جدید)
- [ ] Commit messages واضح
- [ ] Branch name درست
- [ ] rebase روی develop

---

**🚀 شروع کن!**
