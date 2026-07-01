# 🤖 پرامپت Cline — Push کدها به GitHub

> **این پرامپت را در فاز بعد (وقتی همه چیز آماده شد) در Cline CLI اجرا کنید.**
> **پیش‌نیاز:** ریپو `DKN` در GitHub ساخته شده + PAT تنظیم شده.

---

## 📋 پرامپت اصلی

```
وظیفه: push کردن تمام کدهای پروژه به ریپو GitHub.

## Context

- ریپو: https://github.com/littleprogrammer369/DKN
- شاخه اصلی: main (محافظت شده)
- شاخه توسعه: develop
- Personal Access Token (PAT) باید در env variable `GITHUB_TOKEN` باشد
- Working directory: ~/DKN (محل فعلی پروژه)

## مرحله ۱: بررسی وضعیت فعلی

۱. ابتدا وضعیت Git را بررسی کن:
   bash: git status
   bash: git log --oneline -5 2>/dev/null || echo "No commits yet"
   bash: git remote -v

۲. اگر git repo نیست:
   bash: git init
   bash: git checkout -b develop  # اگر main بود، develop بساز

۳. اگر remote نیست:
   bash: git remote add origin https://${GITHUB_TOKEN}@github.com/littleprogrammer369/DKN.git

## مرحله ۲: تنظیم Git Identity

bash:
git config --global user.name "Cline Agent"
git config --global user.email "cline@dadeh-kesht-novin.ir"

## مرحله ۳: ایجاد .gitignore (اگر نیست)

اگر فایل .gitignore وجود ندارد، یکی با این محتوا ایجاد کن:

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.next/
out/

# Environment
.env
.env.local

# Logs
*.log
logs/

# IDE
.vscode/
.idea/
.DS_Store

# Tests
coverage/

# Temporary
tmp/
*.tmp
```

## مرحله ۴: افزودن و Commit

bash:
# فقط فایل‌های source (نه docs و configs اضافی)
git add .

# وضعیت را ببین
git status

# اگر خیلی بزرگ است، exclude کن:
git reset HEAD logs/ 2>/dev/null
git reset HEAD *.log 2>/dev/null

# Commit
git commit -m "🚀 Initial commit: Full MVP code (Frontend + Backend + Database)"

## مرحله ۵: Push به develop

bash:
git push -u origin develop

# اگر خطا داد:
# 1. مطمئن شو GITHUB_TOKEN صحیح است
# 2. مطمئن شو PAT دارای scope "repo" است
# 3. مطمئن شو develop در GitHub وجود دارد

## مرحله ۶: راهنمای PR

بعد از push موفق:
1. به کاربر بگو:
   - "✅ کدها push شد به develop"
   - "🌐 برو به: https://github.com/littleprogrammer369/DKN"
   - "📝 یک PR از develop به main ایجاد کن"
   - "✅ بعد از تأیید، merge کن"

2. یک PR template را با این محتوا پر کن:
   ```
   ## 🚀 Initial MVP Release
   
   ### شامل:
   - ✅ Frontend (Next.js 14 PWA با ۷ صفحه)
   - ✅ Backend (NestJS با ۹ ماژول)
   - ✅ Database (Prisma Schema با ۱۳ مدل)
   - ✅ Infrastructure (Docker + Apache + PM2)
   - ✅ مستندات کامل
   
   ### آماده برای:
   - ✅ Production deploy
   - ✅ Team collaboration
   - ✅ CI/CD pipeline
   ```

## مرحله ۷: تأیید نهایی

بعد از merge:
bash:
git checkout main
git pull origin main
git log --oneline | head -5

بگو:
- "✅ پروژه در GitHub است"
- "📊 [X] commit ها"
- "👥 Collaborator می‌تواند شروع به کار کند"

## نکات مهم

⚠️ هیچ‌وقت فایل .env را commit نکن
⚠️ node_modules را commit نکن
⚠️ اگر خطای "Permission denied" داد، PAT را بررسی کن
⚠️ اگر خطای "Repository not found" داد، URL و PAT را بررسی کن
⚠️ اگر خطای "Branch not found" داد، ابتدا develop را push کن

## در صورت بروز خطا

اگر هر خطایی رخ داد:
1. خطا را در LOG ثبت کن
2. راه‌حل را به کاربر بگو
3. منتظر تأیید کاربر برای ادامه بمان
```

---

## 🔐 تنظیم PAT در سرور

قبل از اجرای پرامپت، در سرور:

```bash
# روش ۱: مستقیم در shell
export GITHUB_TOKEN=ghp_your_token_here

# روش ۲: ذخیره در .bashrc
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.bashrc
source ~/.bashrc

# روش ۳: استفاده از git credential helper
git config --global credential.helper store
# دفعه اول push، token را وارد کن، دفعات بعد ذخیره می‌شود
```

---

## 📋 Checklist قبل از اجرا

- [ ] ریپو `DKN` در GitHub ساخته شده
- [ ] PAT ساخته شده (scope: `repo`)
- [ ] PAT در سرور تنظیم شده (`GITHUB_TOKEN`)
- [ ] Collaborator اضافه شده (نفر جدید)
- [ ] Branch Protection روی main و develop فعال است
- [ ] فایل‌های اولیه (README, .gitignore, ...) قبلاً commit شده

---

## 🆘 رفع مشکلات رایج

### خطا: "Authentication failed"
```bash
# Token را دوباره تنظیم کن
git remote set-url origin https://NEW_TOKEN@github.com/littleprogrammer369/DKN.git
```

### خطا: "Repository not found"
- مطمئن شو URL درست است
- مطمئن شو PAT معتبر است
- مطمئن شو به ریپو دسترسی داری

### خطا: "src refspec develop does not match any"
- مطمئن شو در شاخه develop هستی
- `git checkout -b develop` بساز
- `git push -u origin develop` کن

### خطا: "failed to push some refs"
```bash
git pull origin develop --rebase
git push origin develop
```

---

**🚀 بعد از راه‌اندازی ریپو و تنظیم PAT، این پرامپت را اجرا کن.**
