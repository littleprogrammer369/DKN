# 🤖 پرامپت ۲: ایجاد Pull Request

> **وقتی کار feature تمام شد، این پرامپت را اجرا کنید تا PR ایجاد شود.**

---

## 📋 پرامپت اصلی

```
وظیفه: ایجاد Pull Request برای feature تکمیل شده.

## Context
- شاخه: [BRANCH-NAME]
- Issue: #[شماره]
- Reviewer: [نام نفر ۱]

## مرحله ۱: بررسی نهایی

bash:
cd ~/DKN

# ۱. مطمئن شو همه چیز OK است
pnpm type-check
pnpm lint || echo "warnings only"
pnpm test

# ۲. Manual test
pnpm --filter api dev  # terminal 1
pnpm --filter web dev  # terminal 2
# در مرورگر تست کن

## مرحله ۲: Rebase روی develop

bash:
git fetch origin
git rebase origin/develop

# اگه conflict:
# 1. فایل‌های conflict را باز کن
# 2. <<<<<<< HEAD را پیدا کن
# 3. بخش‌های لازم را نگه‌دار
# 4. git add .
# 5. git rebase --continue

## مرحله ۱۳: Push

bash:
git push origin feature/[BRANCH-NAME]

# اگه خطا داد (rejected):
git push origin feature/[BRANCH-NAME] --force-with-lease

## مرحله ۴: ایجاد PR در GitHub

### روش ۱: از طریق مرورگر
1. برو به: https://github.com/littleprogrammer369/DKN
2. پیام "Compare & pull request" ظاهر می‌شود
3. کلیک کن

### روش ۲: از طریق GitHub CLI (اختیاری)
اگه gh CLI نصب است:
bash:
gh pr create \
  --base develop \
  --head feature/[BRANCH-NAME] \
  --title "feat(scope): description" \
  --body "..."
```

## مرحله ۵: PR Title و Description

### Title Format
```
feat(scope): description فارسی

مثال‌ها:
- feat(auth): اضافه کردن OTP login
- fix(farms): رفع مشکل محاسبه مساحت
- docs(readme): به‌روزرسانی راهنمای setup
```

### Description Template
```markdown
## 📋 توصیف
<!-- توضیح کوتاه از تغییرات -->

## 🔗 Issue
Closes #XXX
<!-- یا: Fixes #XXX -->

## 🧪 نوع تغییر
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentation
- [ ] 🎨 Style
- [ ] ♻️ Refactor
- [ ] 🧪 Test
- [ ] 🔧 Chore

## 🧪 تست
- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] Edge cases covered

## ✅ Checklist
- [ ] کد تمیز و خوانا
- [ ] TypeScript types کامل
- [ ] Tests written
- [ ] Documentation updated
- [ ] CI passes
- [ ] Lint passes

## 📸 Screenshots
<!-- اگه UI تغییر کرده -->

## 📝 یادداشت برای Reviewer
<!-- هر نکته خاص -->
```

## مرحله ۶: Labels و Reviewers

### Labels
- `feature` یا `fix` یا `docs`
- `P0` / `P1` / `P2`
- `frontend` / `backend` / `fullstack`
- `breaking-change` (اگه breaking)

### Reviewers
- حداقل ۱ نفر (معمولاً نفر ۱)
- اگه breaking، ۲ نفر

### Assignees
- خودتان

## مرحله ۷: درخواست Review

1. بعد از ایجاد PR، در Telegram اطلاع بده
2. پیام: "🚨 PR #[شماره] آماده review: [عنوان]"
3. منتظر review بمان

## مرحله ۸: پاسخ به Review Comments

اگه reviewer کامنت گذاشت:

1. هر کامنت را بخوان
2. اگه موافقی، fix کن و push
3. اگه مخالفی، توضیح بده
4. اگه سوال داری، جواب بده

### Workflow
```
Reviewer: "اینجا چرا X کردی؟"
شما: "چون Y. می‌تونم Z هم بکنم. نظر شما چیه؟"
Reviewer: "Z بهتره"
شما: [fix] [commit] [push]
```

## مرحله ۹: بعد از تأیید

1. Reviewer تأیید می‌کند
2. CI pass می‌شود
3. Reviewer merge می‌کند (یا خودتان)

## مرحله ۱۰: بعد از Merge

bash:
git checkout develop
git pull origin develop
git branch -d feature/[BRANCH-NAME]

# شروع feature بعدی
git checkout -b feature/[NEXT-FEATURE]

## مرحله ۱۱: بستن Issue

اگه PR Issue را بسته:
- Issue خودکار بسته می‌شود
- اگه نشد، manually ببندید

---

## 🆘 رفع مشکلات

### CI Failed
1. روی "Details" کلیک کن
2. خطا را ببین
3. در local fix کن
4. push مجدد

### Conflict با develop
```bash
git fetch origin
git rebase origin/develop
# حل conflict
git rebase --continue
git push --force-with-lease
```

### Review طولانی شد
- در Telegram یادآوری کن
- اگه urgent، mention با @

### Reviewer نیست
- هر نفر دیگر تیم را اضافه کن
- در GitHub Settings → Code Owners تنظیم شود

---

## ✅ Checklist

- [ ] همه تست‌ها pass
- [ ] CI pass
- [ ] حداقل ۱ reviewer تأیید کرده
- [ ] Branch up-to-date با develop
- [ ] Description کامل
- [ ] Labels مناسب
- [ ] Screenshots (اگه UI)

---

**🚀 PR آماده! منتظر review باش.**
