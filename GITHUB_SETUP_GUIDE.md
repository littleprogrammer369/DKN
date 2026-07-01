# 🚀 راهنمای راه‌اندازی GitHub — پروژه داده کشت نوین

> **این راهنما قدم به قدم توضیح می‌دهد چطور ریپو `DKN` را در GitHub بسازید.**
> حتی اگه با GitHub آشنایی ندارید، با این راهنما می‌تونید.

---

## 🎯 چرا GitHub؟

- ✅ **Backup کد** — اگه سرور خراب بشه، کد حفظ می‌شه
- ✅ **همکاری تیمی** — چند نفر همزمان روی کد کار کنن
- ✅ **تاریخچه** — هر تغییر ثبت می‌شه
- ✅ **Branching** — بدون خراب کردن، ویژگی جدید اضافه کنید
- ✅ **Pull Request** — review قبل از merge
- ✅ **CI/CD** — تست خودکار (آینده)

---

## 📋 خلاصه مراحل (۱۵ دقیقه)

| # | مرحله | زمان | ابزار |
|---|--------|------|--------|
| ۱ | ساخت ریپو در GitHub | ۲ دقیقه | github.com |
| ۲ | تنظیم Description و Topics | ۱ دقیقه | github.com |
| ۳ | ساخت Personal Access Token (PAT) | ۲ دقیقه | github.com |
| ۴ | اضافه کردن Collaborator (نفر جدید) | ۲ دقیقه | github.com |
| ۵ | تنظیم Branch Protection | ۳ دقیقه | github.com |
| ۶ | ایجاد اولین Commit (از طریق CLI) | ۵ دقیقه | سرور |
| ۷ | تأیید نهایی | ۱ دقیقه | github.com |

---

## گام ۱: ساخت ریپو در GitHub

### ۱.۱ ورود به GitHub
1. به [github.com](https://github.com) بروید
2. با اکانت `littleprogrammer369` وارد شوید

### ۱.۲ ایجاد ریپو جدید
1. روی **+** در بالای صفحه کلیک کنید
2. **New repository** را انتخاب کنید
3. تنظیمات:
   - **Owner:** `littleprogrammer369`
   - **Repository name:** `DKN` (دقیقاً با حروف بزرگ)
   - **Description:** `پلتفرم کشاورزی هوشمند با هوش مصنوعی — داده کشت نوین`
   - **Visibility:** 🔒 **Private** (پیشنهاد می‌شه — کد تجاری است)
   - **Initialize:** ❌ هیچ‌کدام را تیک نزنید (no README, no .gitignore, no license)
4. روی **Create repository** کلیک کنید

### ✅ نتیجه: ریپو خالی ساخته شد
URL ریپو: `https://github.com/littleprogrammer369/DKN`

---

## گام ۲: تنظیم Description و Topics

### ۲.۱ در صفحه ریپو
1. روی آیکون ⚙️ کنار **About** کلیک کنید
2. در **Description:** بنویسید:
   > پلتفرم کشاورزی هوشمند با هوش مصنوعی — داده کشت نوین
3. در **Website:** بنویسید: `https://dadeh-kesht-novin.ir` (یا خالی بذارید)
4. در **Topics:** این کلمات را اضافه کنید:
   ```
   agriculture, ai, nextjs, nestjs, typescript, iran, persian, iot, satellite
   ```
5. **Save** بزنید

---

## گام ۳: ساخت Personal Access Token (PAT)

### ⚠️ چرا PAT؟
Cline نمی‌تونه با رمز عبور GitHub کار کنه. نیاز به **PAT** دارد.

### ۳.۱ مراحل
1. در GitHub، روی آواتار خود کلیک کنید (بالا-راست)
2. **Settings** را انتخاب کنید
3. در پایین منوی چپ: **Developer settings**
4. در منوی چپ: **Personal access tokens** → **Tokens (classic)**
5. روی **Generate new token** → **Generate new token (classic)** کلیک کنید

### ۳.۲ تنظیمات Token
- **Note:** `DKN Server Token (Cline CLI)`
- **Expiration:** `90 days` (یا `No expiration` اگه می‌خواهید)
- **Scopes:** تیک بزنید:
  - ✅ `repo` (دسترسی کامل به ریپو)
  - ✅ `workflow` (برای GitHub Actions)
  - ✅ `write:packages` (اگه بعداً نیاز شد)

### ۳.۳ Generate
1. روی **Generate token** کلیک کنید
2. **مهم:** Token را کپی کنید و در جای امن ذخیره کنید
3. فرمت: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 🔒 امنیت Token
- هرگز Token را در Git commit نکنید
- هرگز در chat یا ایمیل به اشتراک نذارید
- اگه لو رفت، **Revoke** کنید و جدید بسازید

---

## گام ۴: اضافه کردن Collaborator (نفر جدید)

### ۴.۱ پیدا کردن Username یا Email نفر جدید
از همکار جدیدتان **GitHub username** یا **email** را بپرسید.

### ۴.۲ اضافه کردن
1. در ریپو، روی **Settings** کلیک کنید
2. در منوی چپ: **Collaborators** (یا **Collaborators and teams**)
3. روی **Add people** کلیک کنید
4. بنویسید: username یا email نفر جدید
5. **Choose role:** `Write` (نه Admin — امن‌تر)
6. روی **Add [username] to this repository** کلیک کنید

### ۴.۳ تأیید
نفر جدید باید:
1. به ایمیلش برود
2. روی لینک invitation کلیک کند
3. تأیید کند

---

## گام ۵: تنظیم Branch Protection

### ⚠️ چرا مهم؟
- نمی‌گذاره کسی مستقیم روی `main` push کنه
- نیاز به Pull Request و review دارد
- تست خودکار قبل از merge اجباری می‌شود

### ۵.۱ تنظیم main branch
1. در **Settings** → **Branches** (منوی چپ)
2. روی **Add rule** کلیک کنید
3. **Branch name pattern:** `main`
4. تنظیمات:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: `1`
   - ✅ **Require status checks to pass before merging** (بعد از CI)
   - ✅ **Do not allow bypassing the above settings**
5. روی **Create** کلیک کنید

### ۵.۲ تنظیم develop branch
همان مراحل، با **Branch name pattern:** `develop` و تعداد approval: `1`

---

## گام ۶: ایجاد اولین Commit (از سرور)

### ۶.۱ در سرور، فایل‌ها را از `github-setup/` بگیرید
```bash
# ابتدا فایل‌ها را از workspace دانلود کنید
# سپس به سرور منتقل کنید
```

### ۶.۲ در سرور
```bash
cd ~  # یا هر جایی که می‌خواهید
mkdir DKN
cd DKN

# کپی فایل‌ها از repo-files/ در اینجا
# (شامل README.md, .gitignore, CONTRIBUTING.md, ...)

# Git Setup
git init
git config --global user.name "littleprogrammer369"
git config --global user.email "your-email@example.com"

# Personal Access Token را در URL قرار دهید
git remote add origin https://YOUR_TOKEN@github.com/littleprogrammer369/DKN.git

# یا بهتر: از SSH استفاده کنید (بعد از تنظیم SSH key)
```

### ۶.۳ ایجاد برانچ develop
```bash
# main ساخته شده (خالی)
# develop برای توسعه
git checkout -b develop

# افزودن همه فایل‌ها
git add .

# اولین commit
git commit -m "🎉 Initial commit: project structure and documentation"

# Push به develop
git push -u origin develop
```

### ۶.۴ ایجاد PR از develop به main
1. در GitHub، یک Pull Request خودکار ظاهر می‌شود
2. روی **Compare & pull request** کلیک کنید
3. عنوان: `🎉 Initial Setup: Documentation and Structure`
4. تأیید و **Merge pull request** بزنید
5. **Confirm merge**
6. **Delete branch** (develop را پاک نکنید! فقط main merge شد)

---

## گام ۷: تأیید نهایی

### ✅ چک‌لیست
- [ ] ریپو `https://github.com/littleprogrammer369/DKN` ساخته شده
- [ ] Description و Topics تنظیم شده
- [ ] PAT ساخته شده و ذخیره شده (در جای امن)
- [ ] Collaborator با دسترسی Write اضافه شده
- [ ] Branch Protection روی main و develop فعال است
- [ ] اولین commit روی develop push شده
- [ ] PR از develop به main merge شده
- [ ] README در GitHub نمایش داده می‌شود

---

## 🔄 Workflow روزانه (بعد از راه‌اندازی)

### برای شما (مسئول دپارتمان):
```
۱. در GitHub.com Issues را چک کنید
۲. PR های در انتظار review را بررسی کنید
۳. بعد از تأیید، Merge کنید
```

### برای Cline (کدنویسی):
```bash
# شروع روز
cd ~/DKN
git checkout develop
git pull origin develop

# کار روی ویژگی جدید
git checkout -b feature/my-feature
# ... کدنویسی ...
git add .
git commit -m "feat: my feature description"
git push origin feature/my-feature

# در GitHub: ایجاد PR از feature به develop
# بعد از تأیید و merge، پاک کردن برانچ
```

### برای همکار جدید:
```
۱. invitation ایمیل را تأیید کنید
۲. ریپو را clone کنید:
   git clone https://github.com/littleprogrammer369/DKN.git
3. README.md را بخوانید
4. CONTRIBUTING.md را بخوانید
5. BRANCHING.md را بخوانید
6. شروع به کار!
```

---

## 🆘 رفع مشکلات

### مشکل: "Permission denied" در push
```bash
# Token را دوباره تنظیم کنید
git remote set-url origin https://NEW_TOKEN@github.com/littleprogrammer369/DKN.git
```

### مشکل: "Repository not found"
- مطمئن شوید URL درست است
- مطمئن شوید Token معتبر است
- مطمئن شوید ریپو private نیست برای شما

### مشکل: نمی‌توانم collaborator اضافه کنم
- مطمئن شوید Owner ریپو هستید
- GitHub ممکنه ۷ روز طول بکشه برای دعوت جدید

### مشکل: Push نمی‌شود ولی Pull کار می‌کند
- Token نیاز به `repo` scope دارد (نه فقط `public_repo`)

---

## 📁 فایل‌های ریپو (که من می‌سازم)

در پوشه `github-setup/repo-files/` آماده است:

```
repo-files/
├── README.md                       # معرفی + Setup + Workflow
├── .gitignore                       # فایل‌های ignore شده
├── CONTRIBUTING.md                  # راهنمای مشارکت
├── BRANCHING.md                     # استراتژی branching
├── LICENSE                          # MIT License
├── docs/
│   └── TECHNICAL_BLUEPRINT.md       # مستند کامل پروژه
└── .github/
    ├── workflows/
    │   └── ci.yml                   # GitHub Actions (CI)
    ├── ISSUE_TEMPLATE/
    │   ├── bug.md                   # قالب گزارش bug
    │   └── feature.md               # قالب درخواست ویژگی
    └── PULL_REQUEST_TEMPLATE.md     # قالب PR
```

**همه آماده‌اند.** فقط به سرور منتقل کنید و در گام ۶ commit کنید.

---

## 🎯 بعد از راه‌اندازی

وقتی این ۷ گام تمام شد:
- ✅ پروژه در GitHub است
- ✅ همکار جدید دسترسی دارد
- ✅ ساختار branching مشخص است
- ✅ Cline می‌تواند در فاز بعد کدها را push کند

**به من بگویید "مرحله ۱ تمام شد"** تا مرحله ۲ (Day/Night mode + رفع ایرادات) رو شروع کنیم.

---

**🚀 موفق باشید!**
