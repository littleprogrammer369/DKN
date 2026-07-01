# 🚀 راهنمای راه‌اندازی GitHub — پروژه داده کشت نوین

> **این راهنما قدم به قدم توضیح می‌دهد چطور ریپو `DKN` را در GitHub بسازید و تیم را آماده کار موازی کنید.**

---

## 🎯 اهداف

بعد از اتمام:
- ✅ ریپو `DKN` در GitHub
- ✅ ریپو با Documentation کامل
- ✅ ریپو با CI/CD Pipeline
- ✅ نفر جدید (Collaborator) دسترسی دارد
- ✅ پوشه `team/` برای راهنمای نفر جدید آماده است
- ✅ Cline می‌تواند کدها را push کند

---

## 📋 فاز ۱: ساخت ریپو (شما — ۱۰ دقیقه)

### گام ۱: ساخت ریپو در GitHub
1. به [github.com](https://github.com) بروید
2. با اکانت `littleprogrammer369` وارد شوید
3. روی **+** → **New repository**
4. تنظیمات:
   - **Owner:** `littleprogrammer369`
   - **Repository name:** `DKN` (دقیقاً با حروف بزرگ)
   - **Description:** `پلتفرم کشاورزی هوشمند با هوش مصنوعی — داده کشت نوین`
   - **Visibility:** 🔒 **Private**
   - ❌ هیچ‌کدام Initialize را تیک نزنید
5. **Create repository**

URL: `https://github.com/littleprogrammer369/DKN`

### گام ۲: Description و Topics
- روی ⚙️ کنار About کلیک کنید
- **Description:** پلتفرم کشاورزی هوشمند با هوش مصنوعی — داده کشت نوین
- **Topics:** `agriculture, ai, nextjs, nestjs, typescript, iran, persian, iot, satellite`
- **Save**

### گام ۳: ساخت Personal Access Token
1. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token**
3. **Note:** `DKN Server Token`
4. **Expiration:** `90 days`
5. **Scopes:** `repo`, `workflow`, `write:packages`
6. **Generate token** و کپی کنید (مثلاً `ghp_xxxxx`)

🔒 **این Token را در جای امن ذخیره کنید.**

### گام ۴: اضافه کردن Collaborator
1. در ریپو: **Settings** → **Collaborators**
2. **Add people** → username یا email نفر جدید
3. **Choose role:** `Write`
4. **Add** → نفر جدید invitation را تأیید می‌کند

### گام ۵: Branch Protection
1. **Settings** → **Branches** → **Add rule**
2. **Branch name pattern:** `main`
3. تنظیمات:
   - ✅ Require pull request before merging
   - ✅ Require approvals: `1`
   - ✅ Require status checks (بعد از CI)
4. **Create**

همان را برای `develop` تکرار کنید.

---

## 📋 فاز ۲: آپلود فایل‌های اولیه (شما — ۱۰ دقیقه)

### گام ۶: Extract فایل‌ها در سرور

فایل ZIP را دانلود و extract کنید. در سرور:

```bash
cd ~/DKN/dadeh-kesht-novin
```

### گام ۷: تنظیم Git و PAT

```bash
cd ~  # یا هر جای دیگر
mkdir DKN
cd DKN

# کپی فایل‌ها از repo-files/ در اینجا
# (شامل README.md, .gitignore, team/, .github/, ...)

git init
git config --global user.name "littleprogrammer369"
git config --global user.email "your@email.com"

# PAT را در URL بگذارید
git remote add origin https://YOUR_TOKEN@github.com/littleprogrammer369/DKN.git
```

### گام ۸: اولین Commit

```bash
git checkout -b develop
git add .
git commit -m "🎉 Initial commit: project structure, docs, and team guidelines"
git push -u origin develop
```

### گام ۹: PR از develop به main
1. در GitHub، روی **Compare & pull request** کلیک کنید
2. عنوان: `🎉 Initial Setup: Documentation and Team Structure`
3. **Merge pull request** → **Confirm merge**

---

## 📋 فاز ۳: Cline Push کدها (بعد — اختیاری)

وقتی آماده شدید، پرامپت `CLINE_GIT_PROMPT.md` را در Cline CLI اجرا کنید.

---

## 📋 فاز ۴: Onboarding نفر جدید (۱۵ دقیقه)

### گام ۱۰: اشتراک‌گذاری لینک
به نفر جدید بفرستید:
- لینک ریپو: `https://github.com/littleprogrammer369/DKN`
- بگویید: "پوشه `team/` را بخوان، مخصوصاً `ONBOARDING.md`"

### گام ۱۱: نفر جدید شروع می‌کند
نفر جدید باید:
1. پوشه `team/ONBOARDING.md` را بخواند
2. پرامپت `team/prompts/00-SETUP.md` را در Cline خود اجرا کند
3. یک PR تست ایجاد کند
4. بعد از تأیید، کار روی features اصلی

---

## 📋 فاز ۵: شروع کار موازی (بعد از Onboarding)

### گام ۱۲: تقسیم Features
طبق `team/FEATURES.md`:
- **نفر ۱ (شما):** Auth + AI + Dashboard + Profile
- **نفر ۲ (جدید):** Farm Management + Irrigation + Pest + Metrics

### گام ۱۳: Daily Standup
هر روز ۱۰ دقیقه، ۳ سؤال:
- دیروز چه کار کردم؟
- امروز چه می‌کنم؟
- بلاکر دارم؟

### گام ۱۴: Weekly Release
هر جمعه:
- Merge develop → main
- Tag version
- Deploy

---

## 📂 فایل‌های ریپو (آماده)

```
repo-files/
├── README.md                       # معرفی
├── .gitignore                       # فایل‌های ignore
├── CONTRIBUTING.md                  # راهنمای مشارکت
├── BRANCHING.md                     # Git Flow
├── LICENSE                          # MIT
├── docs/
│   └── TECHNICAL_BLUEPRINT.md       # مستند کامل
├── .github/
│   ├── workflows/ci.yml             # CI/CD
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.md
│   │   └── feature.md
│   └── PULL_REQUEST_TEMPLATE.md
└── team/                           # ⭐ پوشه نفر جدید
    ├── README.md                    # نقطه شروع
    ├── ONBOARDING.md                # راه‌اندازی محیط
    ├── WORKFLOW.md                  # تقسیم کار
    ├── FEATURES.md                  # لیست features
    ├── COMMUNICATION.md             # روش ارتباطی
    └── prompts/                     # پرامپت‌های Cline
        ├── 00-SETUP.md
        ├── 01-NEW-FEATURE.md
        ├── 02-PULL-REQUEST.md
        └── 03-FIX-BUG.md
```

---

## 🔐 تنظیم PAT در سرور (مهم!)

```bash
# روش ۱: مستقیم
export GITHUB_TOKEN=ghp_your_token_here

# روش ۲: در .bashrc
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.bashrc
source ~/.bashrc

# بررسی
echo $GITHUB_TOKEN  # باید ghp_xxx نمایش دهد
```

---

## 🆘 رفع مشکلات

### خطا: "Authentication failed" در push
```bash
git remote set-url origin https://NEW_TOKEN@github.com/littleprogrammer369/DKN.git
```

### خطا: "Repository not found"
- URL را بررسی کنید
- Token معتبر است؟
- دسترسی به ریپو دارید؟

### خطا: "Branch not found"
```bash
git checkout -b develop
git push -u origin develop
```

### خطا: PR نمی‌توانم merge کنم
- CI pass شده؟
- Approval داده شده؟
- Conflict دارد؟

---

## ✅ Checklist نهایی

### ریپو
- [ ] ریپو `DKN` ساخته شده (Private)
- [ ] Description و Topics تنظیم
- [ ] PAT ساخته شده
- [ ] Collaborator با Write اضافه شده
- [ ] Branch Protection روی main و develop

### محتوا
- [ ] فایل‌های اولیه push شده به develop
- [ ] PR از develop به main merge شده
- [ ] README در GitHub نمایش داده می‌شود
- [ ] CI workflow فعال است

### تیم
- [ ] نفر جدید invitation را تأیید کرده
- [ ] نفر جدید `team/ONBOARDING.md` را خوانده
- [ ] نفر جدید محیط را راه‌اندازی کرده
- [ ] اولین PR نفر جدید merge شده

### شروع کار
- [ ] Features تقسیم شده (`team/FEATURES.md`)
- [ ] Daily standup شروع شده
- [ ] اولین feature در حال توسعه

---

## 🎯 بعد از اتمام

به من بگویید **"مرحله ۱ کامل شد"** تا مرحله ۲ شروع شود:
- Day/Night mode
- رفع ایرادات فعلی
- پرامپت‌های Cline برای بهبود

---

**🚀 موفق باشید!**
