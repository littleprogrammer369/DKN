# 📦 راهنمای استقرار — داده کشت نوین

> تاریخ: ۲۰۲۶-۰۶-۲۰ | نسخه: ۱.۰

---

## ۱. پیش‌نیازهای سرور

### سیستم‌عامل
- Ubuntu 20.04 یا 22.04 (x86_64 یا ARM64)

### نرم‌افزارهای مورد نیاز
```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm
npm install -g pnpm

# Docker + Docker Compose
sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER

# Apache
sudo apt-get install -y apache2

# سایر
sudo apt-get install -y postgresql-client redis-tools git
```

---

## ۲. انتقال پروژه به سرور

```bash
scp dadeh-kesht-novin.tar.gz user@server:/home/app/
ssh user@server
cd /home/app
tar xzf dadeh-kesht-novin.tar.gz
cd dadeh-kesht-novin
```

---

## ۳. تنظیم دیتابیس

### ۳.۱ فایل `.env` را بررسی کن:
```env
DATABASE_URL="postgresql://dkn_user:dkn_secure_pass_1402@localhost:5432/dadeh_kesht_novin?schema=public"
JWT_SECRET=dkn-jwt-secret-change-in-production-1402
JWT_EXPIRES_IN=30d
REDIS_URL=redis://default:dkn_redis_pass_1402@localhost:6379
```

> ⚠️ حتماً JWT_SECRET و پسوردها رو عوض کن!

### ۳.۲ راه‌اندازی PostgreSQL + Redis با Docker:
```bash
cd /home/app/dadeh-kesht-novin
docker compose up -d          # شروع PostgreSQL + Redis
docker compose ps              # بررسی سلامت
```

### ۳.۳ Migration دیتابیس:
```bash
# نصب وابستگی‌ها
pnpm install

# اجرای migration
cd services/api
pnpm prisma generate
pnpm prisma migrate deploy
cd ../..
```

---

## ۴. بیلد پروژه

```bash
# Frontend (Next.js)
pnpm --filter web build

# Backend API (NestJS)
pnpm --filter api build
```

---

## ۵. راه‌اندازی با PM2

```bash
# نصب PM2
pnpm add -g pm2
pnpm setup
# یا:
/sbin:/usr/local/bin/:/usr/sbin/pnpm setup
export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"

# راه‌اندازی
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### فایل `ecosystem.config.js`:
```js
module.exports = {
  apps: [
    {
      name: 'dkn-api',
      cwd: './services/api',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3001 },
    },
    {
      name: 'dkn-web',
      cwd: './apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 3000 },
    },
  ],
};
```

---

## ۶. تنظیم Apache (Reverse Proxy)

### ۶.۱ کانفیگ Virtual Host:
```bash
sudo cp apache/dkn.conf /etc/apache2/sites-available/
```

### ۶.۲ فعال‌سازی:
```bash
sudo a2enmod proxy proxy_http proxy_wstunnel headers rewrite deflate
sudo a2dissite 000-default.conf
sudo a2ensite dkn.conf
sudo systemctl restart apache2
```

### ۶.۳ محتوای `/etc/apache2/sites-available/dkn.conf`:
```apache
<VirtualHost *:80>
    ServerName _default_

    # Security headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"

    # Frontend — Next.js (port 3000)
    ProxyPreserveHost On
    ProxyRequests Off

    <Location />
        ProxyPass http://localhost:3000/
        ProxyPassReverse http://localhost:3000/
    </Location>

    # Backend API — NestJS (port 3001)
    <Location /api>
        ProxyPass http://localhost:3001/api
        ProxyPassReverse http://localhost:3001/api
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    </Location>

    # Gzip compression
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    ErrorLog ${APACHE_LOG_DIR}/dkn-error.log
    CustomLog ${APACHE_LOG_DIR}/dkn-access.log combined
</VirtualHost>
```

---

## ۷. فایروال (UFW)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## ۸. بررسی نهایی

```bash
# سرویس‌ها
pm2 status
docker compose ps
sudo systemctl status apache2

# تست سایت
curl -I http://localhost:80/

# تست API
curl -X POST http://localhost:80/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"09123456789","password":"123456","firstName":"تست"}'
```

---

## ۹. پورت‌های مورد نیاز

| پورت | سرویس | توضیح |
|------|-------|-------|
| 80 | Apache | وب‌سایت اصلی |
| 3000 | Next.js | داخلی — توسط Apache پروکسی میشه |
| 3001 | NestJS | داخلی — توسط Apache پروکسی میشه |
| 5432 | PostgreSQL | داخلی |
| 6379 | Redis | داخلی |

---

## ۱۰. ساختار پروژه

```
dadeh-kesht-novin/
├── apps/web/            # Frontend (Next.js + Tailwind)
│   ├── src/app/         # صفحات
│   └── .next/           # بیلد خروجی
├── services/api/        # Backend API (NestJS + Prisma)
│   ├── src/             # کد منبع
│   ├── prisma/          # Schema و migration
│   └── dist/            # بیلد خروجی
├── apache/              # کانفیگ Apache
├── docker-compose.yml   # PostgreSQL + Redis
├── ecosystem.config.js  # PM2 Config
├── .env                 # متغیرهای محیطی
└── DEPLOY.md            # همین فایل
```

---

## ❓ رفع اشکال

### خطای PostgreSQL:
```bash
docker compose down
docker compose up -d
pnpm --filter api prisma migrate deploy
```

### خطای Next.js (EADDRINUSE):
```bash
lsof -ti:3000 | xargs kill -9
pm2 restart dkn-web
```

### خطای Apache Connection refused:
```bash
pm2 status           # مطمئن شو API و Web Online هستن
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### اگر PostGIS نیاز داری:
```bash
# در docker-compose.yml:
# image: postgis/postgis:16-3.4  (به جای postgres:16-alpine)
docker compose down
docker compose up -d
```
