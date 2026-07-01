# 🤖 پرامپت Cline: Push فایل‌های فعلی پروژه به GitHub

> **این پرامپت را در Cline CLI اجرا کنید تا فایل‌های فعلی پروژه از سرور به GitHub push شوند.**
> **پیش‌نیاز:** ریپو `DKN` در GitHub ساخته شده + فایل‌های اولیه (README, team/, docs/) push شده.

---

## 📋 پرامپت اصلی

```
وظیفه: push کردن تمام فایل‌های فعلی پروژه از سرور به GitHub.

## Context
- Working directory: /home/pro/DKN/dadeh-kesht-novin
- Target: https://github.com/littleprogrammer369/DKN
- Branch: develop (نه main!)
- PAT: $GITHUB_TOKEN
- فایل‌های فعلی پروژه (Frontend + Backend + Database + Docs)

## مرحله ۱: بررسی فایل‌های فعلی

bash:
cd /home/pro/DKN/dadeh-kesht-novin
ls -la
echo "---"
git status 2>/dev/null || echo "No git repo here"

## مرحله ۲: تشخیص فایل‌های source

این فایل‌ها باید push شوند:
✅ apps/ (Frontend Next.js)
✅ services/ (Backend NestJS)
✅ packages/ (Shared types/utils/ui)
✅ docs/ (Documentation)
✅ README.md, .gitignore, CONTRIBUTING.md, etc.
✅ prisma/schema.prisma
✅ ecosystem.config.js
✅ docker-compose.yml

این فایل‌ها نباید push شوند:
❌ node_modules/
❌ dist/, .next/, build/
❌ .env, .env.local
❌ logs/
❌ coverage/
❌ *.log

## مرحله ۳: Setup Git (اگر نیست)

bash:
cd /home/pro/DKN/dadeh-kesht-novin

git config --global user.name "littleprogrammer369"
git config --global user.email "your@email.com"

# اگر git repo نیست:
git init
git checkout -b develop
git remote add origin https://${GITHUB_TOKEN}@github.com/littleprogrammer369/DKN.git

# اگر هست ولی remote ندارد:
git remote add origin https://${GITHUB_TOKEN}@github.com/littleprogrammer369/DKN.git

## مرحله ۴: بررسی .gitignore

اگر .gitignore نیست یا ناقص است، این را اضافه کن:

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.next/
out/
build/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
logs/
npm-debug.log*
pnpm-debug.log*

# IDE
.vscode/
.idea/
.DS_Store
*.swp

# Testing
coverage/

# Cache
.cache/
.turbo/

# Temporary
tmp/
*.tmp
```

## مرحله ۵: افزودن فایل‌ها

bash:
cd /home/pro/DKN/dadeh-kesht-novin
git add .

# اگر فایلی که نباید اضافه شده را دیدی، reset کن:
# git reset HEAD node_modules/ 2>/dev/null
# git reset HEAD .env 2>/dev/null
# git reset HEAD dist/ 2>/dev/null

# بررسی فایل‌های اضافه شده
git status --short

# لیست فایل‌های source (نباید بیش از ۲۰۰ فایل باشد)
git ls-files | wc -l

## مرحله ۶: Commit

bash:
git commit -m "🚀 Initial commit: Full MVP code (Frontend + Backend + Database + Docs)

- Frontend: Next.js 14 with 7 pages
- Backend: NestJS with 10 modules
- Database: Prisma schema with 13 models
- Infrastructure: Docker, PM2, Apache configs
- Documentation: Complete technical blueprint

Co-authored-by: littleprogrammer369"

## مرحله ۷: Push به develop

bash:
git push -u origin develop

# اگر خطای "rejected" داد:
# git pull origin develop --rebase
# git push origin develop

# اگر خطای "Authentication failed":
# Token را بررسی کن
# echo $GITHUB_TOKEN

## مرحله ۸: تأیید و راهنمای PR

بعد از push موفق:
1. بگو: "✅ کدها push شد به develop"
2. لینک: https://github.com/littleprogrammer369/DKN
3. راهنما برای PR:
   - برو به GitHub
   - پیام "Compare & pull request" ظاهر می‌شود
   - Create PR از develop به main
   - عنوان: `🚀 Initial Release: MVP v1.0`
   - بعد از تأیید، merge

## مرحله ۹: بررسی فایل‌های ضروری

بعد از push، مطمئن شو این فایل‌ها در GitHub هستند:

bash:
git ls-files | head -50

# باید شامل:
# ✅ apps/web/package.json
# ✅ apps/web/src/app/page.tsx
# ✅ apps/web/src/components/screens/...
# ✅ services/api/package.json
# ✅ services/api/src/main.ts
# ✅ services/api/prisma/schema.prisma
# ✅ services/api/src/modules/...
# ✅ docker-compose.yml
# ✅ ecosystem.config.js
# ✅ README.md
# ❌ node_modules/ (نباید باشد)
# ❌ .env (نباید باشد)

## مرحله ۱۰: نهایی

بگو:
- ✅ پروژه کامل در GitHub
- 📊 [X] فایل source
- 👥 نفر جدید آماده clone است
- 🚀 مرحله بعد: شروع کار موازی

## رفع خطاها

### "Permission denied"
```bash
# Token را بررسی کن
echo $GITHUB_TOKEN
# باید ghp_xxx باشد

# اگه خالی است:
export GITHUB_TOKEN=ghp_your_token_here
```

### "Repository not found"
```bash
# URL و نام ریپو را بررسی کن
git remote -v
# باید https://github.com/littleprogrammer369/DKN باشد
```

### "Branch develop not found"
```bash
# ابتدا develop را push کن
git checkout -b develop
git push -u origin develop
```

### "Large files"
```bash
# اگه node_modules یا dist اضافه شده:
git rm -r --cached node_modules/
git rm -r --cached dist/
git commit -m "fix: remove large files"
```

### "Merge conflict"
```bash
# احتمالاً PR قبلی merge نشده
# یا develop در GitHub خالی است
# ادامه نده، ابتدا وضعیت GitHub را بررسی کن
```

## نکات مهم

⚠️ فقط فایل‌های source را push کن
⚠️ .env را commit نکن
⚠️ node_modules را commit نکن
⚠️ قبل از commit، git status را بررسی کن
⚠️ پیام commit باید واضح باشد

## در پایان

بعد از push موفق:
1. ✅ به کاربر اطلاع بده
2. ✅ لینک PR را بده
3. ✅ خلاصه فایل‌های push شده را بگو
4. ✅ منتظر تأیید برای merge بمان
```

---

## 🔐 قبل از اجرا

```bash
# در سرور مطمئن شوید:
export GITHUB_TOKEN=ghp_your_token_here
echo $GITHUB_TOKEN
```

اگر خالی است، در `~/.bashrc` اضافه کنید:
```bash
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.bashrc
source ~/.bashrc
```

---

## ✅ Checklist قبل از اجرا

- [ ] ریپو `DKN` در GitHub ساخته شده
- [ ] PAT با scope `repo` ساخته شده
- [ ] PAT در سرور تنظیم شده (`GITHUB_TOKEN`)
- [ ] Collaborator اضافه شده
- [ ] Branch Protection فعال
- [ ] فایل‌های اولیه (README, team/, docs/) قبلاً push شده
- [ ] فایل‌های پروژه در `/home/pro/DKN/dadeh-kesht-novin` موجود

---

**🚀 اجرا کن!**
