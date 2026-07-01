# 🤖 پرامپت ۰: Setup محیط توسعه‌دهنده جدید

> **این پرامپت را در Cline CLI نفر جدید اجرا کنید.**
> هدف: راه‌اندازی کامل محیط کار در سرور مجازی Ubuntu 20.

---

## 📋 پرامپت اصلی

```
وظیفه: راه‌اندازی کامل محیط توسعه برای پروژه داده کشت نوین.

## Context
- سرور: Ubuntu Server 20.04
- پروژه: DKN (داده کشت نوین)
- ریپو: https://github.com/littleprogrammer369/DKN
- Cline CLI در دسترس

## مرحله ۱: بررسی سیستم

1. بررسی کن OS Ubuntu 20 باشد:
   bash: lsb_release -a

2. اگر نیست، اطلاع بده و ادامه نده.

3. آپدیت:
   bash: sudo apt update && sudo apt upgrade -y

## مرحله ۲: نصب Node.js 20

1. نصب NVM:
   bash: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   bash: source ~/.bashrc

2. نصب Node.js 20:
   bash: nvm install 20
   bash: nvm use 20
   bash: nvm alias default 20

3. بررسی:
   bash: node --version
   bash: npm --version

## مرحله ۳: نصب pnpm

bash:
corepack enable
npm install -g pnpm
pnpm --version

## مرحله ۴: نصب Docker

bash:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

docker --version
docker compose version

## مرحله ۵: نصب ابزارهای کمکی

bash:
sudo apt install -y git postgresql-client redis-tools

git --version

## مرحله ۶: نصب Cline CLI (اگه نصب نیست)

bash:
npm install -g cline
cline --version

## مرحله ۷: تنظیم Git

bash:
git config --global user.name "[NAME]"
git config --global user.email "[EMAIL]"
git config --global init.defaultBranch main

## مرحله ۸: Clone کردن ریپو

1. رفتن به home:
   bash: cd ~

2. Clone:
   bash: git clone https://github.com/littleprogrammer369/DKN.git

3. رفتن به پوشه:
   bash: cd DKN

4. لیست فایل‌ها:
   bash: ls -la

## مرحله ۹: نصب Dependencies

bash:
cd ~/DKN
pnpm install

# اگه خطا داد:
pnpm install --frozen-lockfile

## مرحله ۱۰: تنظیم Environment Variables

1. کپی env example:
   bash: cp services/api/.env.example services/api/.env

2. نمایش محتوا:
   bash: cat services/api/.env.example

3. سؤال از کاربر: کلیدهای واقعی را از مسئول تیم بگیرید:
   - JWT_SECRET (از مسئول)
   - DATABASE_URL (از مسئول)
   - GEMINI_API_KEY (از مسئول)
   - سایر کلیدها

4. ویرایش env:
   bash: nano services/api/.env

## مرحله ۱۱: راه‌اندازی دیتابیس

bash:
docker compose up -d
sleep 5
docker compose ps

# اگه PostgreSQL و Redis Up هستند، ادامه بده

cd services/api
pnpm prisma generate
pnpm prisma migrate deploy
cd ../..

## مرحله ۱۲: تست اجرا

### Terminal 1: Backend
bash:
cd ~/DKN
pnpm --filter api dev

### Terminal 2: Frontend
bash:
cd ~/DKN
pnpm --filter web dev

### بررسی در مرورگر
- http://your_server_ip:3000 → باید UI نمایش داده شود
- http://your_server_ip:3001/api/docs → باید Swagger نمایش داده شود

## مرحله ۱۳: تأیید نهایی

1. اگه همه OK است، بگو: "✅ محیط آماده است"
2. اگه خطا دارد، debug کن

## مرحله ۱۴: اولین Git Workflow

1. شاخه develop:
   bash: cd ~/DKN
   bash: git checkout develop
   bash: git pull origin develop

2. شاخه feature:
   bash: git checkout -b feature/[YOURNAME]-setup-test

3. یک تغییر کوچک:
   bash: echo "Test by [YOURNAME] at $(date)" >> README.md

4. Commit:
   bash: git add .
   bash: git commit -m "docs: setup test by [YOURNAME]"

5. Push:
   bash: git push origin feature/[YOURNAME]-setup-test

6. اطلاع: "PR ایجاد شد. لطفاً در GitHub تأیید و merge کنید"

## پایان

بگو: "✅ Onboarding کامل شد. [YOURNAME] آماده کار است."

اگه خطایی رخ داد:
1. خطا را در AGENT_LOG.md ثبت کن
2. راه‌حل پیشنهاد بده
3. در Telegram اطلاع بده
```

---

## 🔑 کلیدهای مورد نیاز

این کلیدها را از **نفر ۱ (مسئول)** بگیرید:

```env
JWT_SECRET=<random-32-char>
DATABASE_URL=postgresql://dkn_user:PASS@localhost:5432/dadeh_kesht_novin
GEMINI_API_KEY=<from aistudio.google.com>
# سایر کلیدها اختیاری هستند برای شروع
```

---

## ⚠️ نکات مهم

1. **هرگز** `.env` را commit نکن (در `.gitignore` است)
2. **هرگز** کلیدها را share نکن (حتی در chat)
3. اگه git credential ذخیره نشده، دفعه اول push باید token وارد کنید
4. اگه Docker permission denied → logout/login یا `newgrp docker`

---

## 🆘 رفع مشکلات رایج

### خطا: "nvm: command not found"
```bash
# NVM را دوباره نصب کن:
rm -rf ~/.nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
```

### خطا: "Cannot connect to Docker daemon"
```bash
sudo usermod -aG docker $USER
newgrp docker
# یا logout و دوباره login
```

### خطا: "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### خطا: "ECONNREFUSED 5432" (PostgreSQL)
```bash
docker compose ps
docker compose up -d postgres
docker compose logs postgres
```

### خطا: PR ایجاد نمی‌شود
```bash
# مطمئن شو remote درست است
git remote -v
# اگه اشتباه بود:
git remote set-url origin https://YOUR_TOKEN@github.com/littleprogrammer369/DKN.git
```

---

## ✅ Checklist پایان

- [ ] Node.js 20 نصب و فعال
- [ ] pnpm نصب
- [ ] Docker نصب و در حال اجرا
- [ ] Git تنظیم شده
- [ ] ریپو clone شده
- [ ] Dependencies نصب
- [ ] .env تنظیم
- [ ] دیتابیس migrate شده
- [ ] اپ روی localhost اجرا می‌شود
- [ ] اولین PR ایجاد و merge شد

---

**🚀 بعد از اتمام، به نفر ۱ اطلاع بده تا شما را به features اصلی assign کند.**
