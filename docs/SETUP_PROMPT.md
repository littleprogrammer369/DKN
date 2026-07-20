# Cline Prompt - راه اندازی محیط توسعه داده کشت نوین

این پرامپت را به Cline بدهید تا محیط توسعه را روی سرور Ubuntu 20 آماده کند.

---

## پرامپت Cline:

```text
من میخواهم محیط توسعه پروژه "داده کشت نوین" (DKN) را روی سرور Ubuntu 20.04 راه اندازی کنم.

## مرحله 1: پیش نیازهای سیستم
- sudo apt update && sudo apt upgrade -y
- نصب Node.js 20:
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
- نصب pnpm: sudo npm install -g pnpm
- نصب Docker: sudo apt install -y docker.io docker-compose
  sudo systemctl enable docker && sudo usermod -aG docker $USER
- نصب PM2: sudo npm install -g pm2
- نصب Git: sudo apt install -y git
- نصب Apache:
  sudo apt install -y apache2
  sudo a2enmod proxy proxy_http proxy_wstunnel headers rewrite ssl expires deflate

## مرحله 2: Clone پروژه
- git clone https://github.com/littleprogrammer369/DKN.git
- cd DKN
- git checkout develop

## مرحله 3: نصب وابستگی ها
- pnpm install

## مرحله 4: Environment Variables
- فایل .env موجود است. مقادیر API Keyها را تنظیم کن:
  GEMINI_API_KEY, OPENWEATHER_API_KEY, SENTINEL_HUB_CLIENT_ID/CLIENT_SECRET
- JWT_SECRET را با یک مقدار random جایگزین کن

## مرحله 5: دیتابیس
- docker compose up -d
- cd services/api && pnpm prisma migrate deploy && cd ../..

## مرحله 6: Build و Run
- pnpm build
- pm2 start ecosystem.config.js && pm2 save

## مرحله 7: Apache Configuration
- sudo cp apache/dkn.conf /etc/apache2/sites-available/dkn.conf
- sudo a2ensite dkn.conf
- sudo systemctl restart apache2
- (اختیاری) SSL با certbot برای دامنه واقعی

## مرحله 8: تست
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- از طریق Apache: http://YOUR_SERVER_IP

## اطلاعات دیتابیس:
- کاربر: dkn_user | رمز: dkn_secure_pass_1402 | دیتابیس: dadeh_kesht_novin
- PostgreSQL: 5432 | Redis: 6379 (رمز: dkn_redis_pass_1402)

## اطلاعات پروژه:
- Frontend: 3000 | Backend: 3001 | Apache: 80/443
- Node: >=20 | pnpm: >=8
```

---
نکته: Apache فقط برای production نیاز است. برای توسعه local از پورت های مستقیم استفاده کنید.
برای توسعه نیازی به API Key واقعی نیست (مقادیر mock در کد هست).
همیشه از شاخه develop برای کار استفاده کنید.
