# 🚀 Onboarding — راه‌اندازی محیط کار

> **این فایل را قدم به قدم دنبال کنید تا محیط کار شما آماده شود.**
> مدت زمان: ~۳۰ دقیقه

---

## 🎯 اهداف Onboarding

در پایان این راهنما:
- ✅ سرور مجازی Ubuntu 20 آماده باشد
- ✅ Node.js 20 + pnpm نصب باشد
- ✅ Docker + PostgreSQL + Redis نصب باشد
- ✅ Cline CLI آماده باشد
- ✅ ریپو clone شده باشد
- ✅ اپ روی localhost اجرا شود

---

## مرحله ۱: بررسی سرور مجازی

### ۱.۱ اتصال به سرور
```bash
ssh your_username@your_server_ip
```

### ۱.۲ بررسی سیستم
```bash
# سیستم‌عامل
lsb_release -a
# باید: Ubuntu 20.04 LTS

# آپدیت
sudo apt update && sudo apt upgrade -y
```

### ۱.۳ اگه Ubuntu 20 نیست
```bash
# اگه نیاز به نصب دارد، از ابزار cloud provider استفاده کنید
```

---

## مرحله ۲: نصب ابزارهای پایه

### ۲.۱ Node.js 20
```bash
# NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# بررسی
node --version   # v20.x.x
npm --version    # 10.x.x
```

### ۲.۲ pnpm
```bash
corepack enable
npm install -g pnpm
pnpm --version   # 8.x.x
```

### ۲.۳ Git
```bash
# اگه نصب نیست
sudo apt install -y git

git --version
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### ۲.۴ Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

docker --version
docker compose version
```

### ۲.۵ PostgreSQL Client (اختیاری)
```bash
sudo apt install -y postgresql-client redis-tools
```

### ۲.۶ Cline CLI
```bash
npm install -g cline
cline --version
```

---

## مرحله ۳: Clone کردن ریپو

### ۳.۱ رفتن به home directory
```bash
cd ~
```

### ۳.۲ Clone ریپو
```bash
# از GitHub (نیاز به collaborator access)
git clone https://github.com/littleprogrammer369/DKN.git

cd DKN
ls -la
```

### ۳.۳ اگه خطای authentication داد
```bash
# با Personal Access Token
git clone https://YOUR_TOKEN@github.com/littleprogrammer369/DKN.git

# یا SSH (اگه SSH key تنظیم شده)
git clone git@github.com:littleprogrammer369/DKN.git
```

---

## مرحله ۴: نصب Dependencies

```bash
cd ~/DKN
pnpm install

# اگه خطا داد:
pnpm install --frozen-lockfile
```

---

## مرحله ۵: تنظیم Environment

### ۵.۱ کپی env example
```bash
cp services/api/.env.example services/api/.env
```

### ۵.۲ ویرایش با کلیدهای واقعی
```bash
nano services/api/.env
```

حداقل این‌ها را تنظیم کنید (از مسئول تیم بگیرید):
```bash
JWT_SECRET=your-random-32-char-secret
DATABASE_URL=postgresql://dkn_user:password@localhost:5432/dadeh_kesht_novin
GEMINI_API_KEY=AIzaSy...
```

**ذخیره:** Ctrl+O, Enter, Ctrl+X

---

## مرحله ۶: راه‌اندازی دیتابیس

### ۶.۱ با Docker
```bash
docker compose up -d

# بررسی
docker compose ps
# باید PostgreSQL و Redis Up باشند
```

### ۶.۲ Migration
```bash
cd services/api
pnpm prisma generate
pnpm prisma migrate deploy
cd ../..
```

### ۶.۳ (اختیاری) Seed Data
```bash
cd services/api
pnpm prisma db seed
cd ../..
```

---

## مرحله ۷: اجرای اپ

### ۷.۱ Terminal ۱: Backend
```bash
cd ~/DKN
pnpm --filter api dev
# باید روی http://localhost:3001 اجرا شود
```

### ۷.۲ Terminal ۲: Frontend
```bash
cd ~/DKN
pnpm --filter web dev
# باید روی http://localhost:3000 اجرا شود
```

### ۷.۳ بررسی
```bash
# در مرورگر:
# http://your_server_ip:3000  → باید UI لود شود
# http://your_server_ip:3001/api/docs  → باید Swagger نمایش داده شود
```

---

## مرحله ۸: اولین Commit

### ۸.۱ یک branch جدید بسازید
```bash
cd ~/DKN
git checkout develop
git pull origin develop
git checkout -b feature/yourname-setup
```

### ۸.۲ یک تغییر کوچک
```bash
# مثلاً یک کامنت در README.md اضافه کنید
echo "<!-- Added by [Your Name] on $(date) -->" >> README.md
```

### ۸.۳ Commit و Push
```bash
git add .
git commit -m "docs: onboarding test by [Your Name]"
git push origin feature/yourname-setup
```

### ۸.۴ ایجاد PR در GitHub
1. برو به https://github.com/littleprogrammer369/DKN
2. روی **Compare & pull request** کلیک کنید
3. عنوان: `docs: onboarding test by [Your Name]`
4. **Create pull request**

### ۸.۵ منتظر تأیید بمان
- نفر ۱ (مسئول) PR را review می‌کند
- بعد از تأیید، merge می‌شود
- ✅ شما رسماً عضو تیم شدید!

---

## 🆘 رفع مشکلات

### مشکل: Node.js نصب نمی‌شود
```bash
# بررسی NVM
ls -la ~/.nvm
# اگه خالی بود:
rm -rf ~/.nvm
# دوباره نصب کن
```

### مشکل: Docker permission denied
```bash
sudo usermod -aG docker $USER
newgrp docker
# یا logout/login
```

### مشکل: PostgreSQL connection refused
```bash
docker compose ps
docker compose logs postgres
```

### مشکل: Port 3000 اشغال
```bash
lsof -ti:3000 | xargs kill -9
```

### مشکل: PR نمی‌توانم merge کنم
- مطمئن شو CI pass شده
- منتظر review بمان
- اگه conflict دارد، با هم حل کنید

---

## 📞 تماس با تیم

اگه در هر مرحله مشکل داشتید:
1. در GitHub Issue بپرسید
2. در Telegram group پیام دهید
3. با نفر ۱ (مسئول) تماس بگیرید

---

## ✅ Checklist نهایی

- [ ] سرور Ubuntu 20 آماده
- [ ] Node.js 20 نصب
- [ ] pnpm نصب
- [ ] Docker نصب
- [ ] Git تنظیم
- [ ] Cline CLI نصب
- [ ] ریپو clone شد
- [ ] Dependencies نصب
- [ ] .env تنظیم
- [ ] دیتابیس راه‌اندازی
- [ ] اپ روی localhost اجرا می‌شود
- [ ] اولین PR ایجاد و merge شد

---

**🎉 تبریک! شما آماده کار روی پروژه هستید!**
