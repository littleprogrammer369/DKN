# 🤖 پرامپت Cline — Push کدها به GitHub

> **این پرامپت را در فاز ۳ اجرا کنید (وقتی ریپو ساخته شد).**

---

## 📋 پرامپت اصلی

```
وظیفه: push کردن تمام کدهای پروژه به ریپو GitHub.

## Context

- ریپو: https://github.com/littleprogrammer369/DKN
- شاخه اصلی: main (محافظت شده)
- شاخه توسعه: develop
- Personal Access Token (PAT) در env: $GITHUB_TOKEN
- Working directory: ~/DKN/dadeh-kesht-novin

## مرحله ۱: بررسی وضعیت فعلی

bash:
git status
git log --oneline -5 2>/dev/null || echo "No commits yet"
git remote -v

## مرحله ۲: اگر Git repo نیست

bash:
git init
git checkout -b develop  # یا اگه main بود

git remote add origin https://${GITHUB_TOKEN}@github.com/littleprogrammer369/DKN.git

## مرحله ۳: تنظیم Git Identity

bash:
git config --global user.name "Cline Agent"
git config --global user.email "cline@dadeh-kesht-novin.ir"

## مرحله ۴: بررسی .gitignore

اگر .gitignore وجود ندارد، ایجاد کن:

```
node_modules/
dist/
.next/
out/
.env
.env.local
*.log
logs/
coverage/
.vscode/
.idea/
.DS_Store
*.tmp
```

## مرحله ۵: افزودن فایل‌ها

bash:
git add .

# اگه خیلی بزرگ است، exclude:
git reset HEAD logs/ 2>/dev/null
git reset HEAD *.log 2>/dev/null

# بررسی
git status

## مرحله ۶: Commit

bash:
git commit -m "🚀 Initial commit: Full MVP code (Frontend + Backend + Database + Docs)"

## مرحله ۷: Push

bash:
git push -u origin develop

# اگه خطا داد:
# 1. GITHUB_TOKEN را بررسی کن
# 2. PAT scope "repo" دارد؟
# 3. develop در GitHub وجود دارد؟

## مرحله ۸: راهنمای PR

بعد از push:
1. بگو: "✅ کدها push شد"
2. لینک: https://github.com/littleprogrammer369/DKN/pulls
3. یک PR از develop به main بساز
4. Reviewer: نفر ۱
5. Label: `feature`, `P0`
6. بعد از تأیید و merge، منتظر بمان

## مرحله ۹: تأیید

بعد از merge:
bash:
git checkout main
git pull origin main
git log --oneline | head -5

بگو:
- "✅ پروژه در GitHub است"
- "📊 [X] commits"
- "👥 نفر جدید می‌تواند شروع کند"

## نکات مهم

⚠️ .env را commit نکن
⚠️ node_modules را commit نکن
⚠️ force push نکن
⚠️ مستقیم به main push نکن

## رفع خطا

اگر خطا:
1. در LOG.md ثبت کن
2. راه‌حل به کاربر بگو
3. منتظر تأیید بمان
```

---

## 🔐 تنظیم PAT

قبل از اجرا:

```bash
export GITHUB_TOKEN=ghp_your_token_here
# یا در ~/.bashrc
```

---

## ✅ Checklist قبل از اجرا

- [ ] ریپو `DKN` در GitHub ساخته شده
- [ ] PAT ساخته شده (scope: `repo`)
- [ ] PAT در سرور تنظیم شده (`GITHUB_TOKEN`)
- [ ] Collaborator اضافه شده
- [ ] Branch Protection فعال
- [ ] فایل‌های اولیه قبلاً push شده

---

**🚀 وقتی آماده شد، اجرا کن.**
