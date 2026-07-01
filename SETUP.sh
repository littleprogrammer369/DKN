#!/bin/bash
# ============================================
#  🌿 استقرار سریع — داده کشت نوین
#  اجرا: bash SETUP.sh
# ============================================
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌿 داده کشت نوین — راه‌اندازی سرور"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# ── ۱. فیکس symlink ─────────────────────
echo ""
echo "📌 ۱. فیکس symlink .env ..."
cd services/api
rm -f .env
ln -sf ../../.env .env
cd "$ROOT_DIR"
echo "   ✅ انجام شد"

# ── ۲. راه‌اندازی Docker ────────────────
echo ""
echo "📌 ۲. راه‌اندازی PostgreSQL + Redis ..."
docker compose up -d
sleep 3
docker compose ps
echo "   ✅ انجام شد"

# ── ۳. Prisma Generate ──────────────────
echo ""
echo "📌 ۳. Prisma generate ..."
pnpm --filter api prisma generate
echo "   ✅ انجام شد"

# ── ۴. Prisma Migrate ───────────────────
echo ""
echo "📌 ۴. اعمال migration ..."
pnpm --filter api prisma migrate deploy
echo "   ✅ انجام شد"

# ── ۵. نصب وابستگی‌ها ──────────────────
echo ""
echo "📌 ۵. نصب node_modules (ممکنه چند دقیقه طول بکشه)..."
pnpm install
echo "   ✅ انجام شد"

# ── ۶. بیلد Backend ─────────────────────
echo ""
echo "📌 ۶. بیلد NestJS API ..."
pnpm --filter api build
echo "   ✅ انجام شد"

# ── ۷. بیلد Frontend ────────────────────
echo ""
echo "📌 ۷. بیلد Next.js ..."
pnpm --filter web build
echo "   ✅ انجام شد"

# ── ۸. نصب PM2 ──────────────────────────
echo ""
echo "📌 ۸. نصب PM2 ..."
source /root/.bashrc 2>/dev/null || true
export PNPM_HOME="/root/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
pnpm add -g pm2
pm2 kill 2>/dev/null || true
echo "   ✅ انجام شد"

# ── ۹. راه‌اندازی PM2 ───────────────────
echo ""
echo "📌 ۹. PM2 start ..."
pm2 start ecosystem.config.js
sleep 3
pm2 status
pm2 save
pm2 startup
echo "   ✅ انجام شد"

# ── ۱۰. تنظیم Apache ────────────────────
echo ""
echo "📌 ۱۰. Apache Virtual Host ..."
sudo cp apache/dkn.conf /etc/apache2/sites-available/dkn.conf
sudo a2enmod -q proxy proxy_http headers rewrite deflate 2>/dev/null || true
sudo a2dissite -q 000-default.conf 2>/dev/null || true
sudo a2ensite -q dkn.conf 2>/dev/null || true
sudo systemctl restart apache2
echo "   ✅ انجام شد"

# ── ۱۱. فایروال ─────────────────────────
echo ""
echo "📌 ۱۱. تنظیم فایروال ..."
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 22/tcp 2>/dev/null || true
echo "   ✅ انجام شد"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 راه‌اندازی کامل شد!"
echo ""
echo "🌐 سایت: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'IP-SERVER')"
echo "📡 API:  http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'IP-SERVER')/api/v1"
echo ""
echo "سرویس‌های در حال اجرا:"
export PNPM_HOME="/root/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
pm2 status 2>/dev/null
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
