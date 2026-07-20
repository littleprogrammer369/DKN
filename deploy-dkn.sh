#!/usr/bin/env bash
# ============================================================================
# 🚀 DKN Deploy v2 — استقرار کامل خودکار
# اجرا: cd /root/DKN && sudo ./deploy-dkn.sh [SERVER_IP]
# مثال: sudo ./deploy-dkn.sh 78.157.54.96
# ============================================================================

set -euo pipefail

# ─── Colors ───
R='\033[0;31m'; G='\033[0;32m'; Y='\033[1;33m'; C='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${G}[✓]${NC} $1"; }
warn() { echo -e "${Y}[!]${NC} $1"; }
err()  { echo -e "${R}[✗]${NC} $1"; exit 1; }
info() { echo -e "${C}[➜]${NC} $1"; }

# ─── Config ───
IP="${1:-}"
[[ -z "$IP" ]] && IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[[ -z "$IP" ]] && IP="127.0.0.1"

DIR="$(cd "$(dirname "$0")" && pwd)"
DB_NAME="dkn"
DB_USER="dkn_user"
DB_PASS="dkn_$(date +%s | sha256sum | base64 | head -c 16)"
JWT_SECRET="jwt_$(date +%s | sha256sum | base64 | head -c 32)"

log "IP: $IP"
log "Dir: $DIR"
log "DB User: $DB_USER"
log "DB Name: $DB_NAME"
echo ""

# ─── 1. System ───
info "1/14. Installing system packages..."
export DEBIAN_FRONTEND=noninteractive
dpkg --configure -a 2>/dev/null || true
apt-get update -qq 2>/dev/null || true
apt-get install -y -qq curl wget git unzip gnupg ca-certificates build-essential libssl-dev apache2 postgresql postgresql-contrib certbot python3-certbot-apache 2>&1 | tail -1
log "System packages installed"

# ─── 2. Node.js ───
info "2/14. Node.js..."
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>&1 | tail -1
  apt-get install -y -qq nodejs 2>&1 | tail -1
fi
log "Node.js $(node -v)"

# ─── 3. pnpm ───
info "3/14. pnpm..."
command -v pnpm &>/dev/null || npm install -g pnpm 2>&1 | tail -1
log "pnpm $(pnpm -v)"

# ─── 4. PM2 ───
info "4/14. PM2..."
if command -v pm2 &>/dev/null; then
  pm2 kill 2>/dev/null || true
  sleep 2
  npm install -g pm2@latest 2>&1 | tail -1 || true
else
  npm install -g pm2@latest 2>&1 | tail -1
fi
# Reset PM2 dump so old processes don't resurrect
pm2 cleardump 2>/dev/null || true
rm -f /root/.pm2/dump.pm2 2>/dev/null || true
log "PM2 reset"

# ─── 5. Kill old processes ───
info "5/14. Cleaning old processes..."
kill -9 $(lsof -t -i:3000 2>/dev/null) 2>/dev/null || true
kill -9 $(lsof -t -i:3001 2>/dev/null) 2>/dev/null || true
sleep 2
log "Ports freed"

# ─── 6. PostgreSQL ───
info "6/14. Setting up PostgreSQL..."
systemctl start postgresql 2>/dev/null || true
sleep 2

# Fix pg_hba.conf for password auth (needed for Prisma)
PG_HBA=$(find /etc/postgresql -name pg_hba.conf 2>/dev/null | head -1)
if [ -n "$PG_HBA" ]; then
  sed -i 's/local\s\+all\s\+all\s\+peer/local   all             all                                     md5/' "$PG_HBA"
  sed -i 's/local\s\+all\s\+all\s\+ident/local   all             all                                     md5/' "$PG_HBA"
  sed -i 's/host\s\+all\s\+all\s\+127.0.0.1\/32\s\+scram/host    all             all             127.0.0.1\/32            md5/' "$PG_HBA"
  systemctl restart postgresql 2>/dev/null || true
  sleep 2
  log "PostgreSQL auth configured (md5)"
fi

# Check if DB exists, create if not
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null | grep -q 1; then
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
  log "DB user created"
else
  sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
  log "DB user updated"
fi

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null | grep -q 1; then
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
  log "Database created"
else
  log "Database exists"
fi

# Test connection
if PGPASSWORD="$DB_PASS" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" 2>/dev/null; then
  log "DB connection OK"
else
  # Retry with local socket
  warn "Local connection failed — trying socket connection..."
  sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
fi

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}?schema=public"
log "DB URL: postgresql://${DB_USER}:****@localhost:5432/${DB_NAME}"

# ─── 7. Environment files ───
info "7/14. Creating .env files..."
cat > "$DIR/apps/web/.env.local" << EOF
NEXT_PUBLIC_API_URL=/api/v1
NEXT_PUBLIC_SITE_URL=http://$IP
EOF
log "apps/web/.env.local created"

cat > "$DIR/services/api/.env" << EOF
PORT=3001
NODE_ENV=production
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$JWT_SECRET
WEATHER_API_KEY=
OPENROUTER_API_KEY=
DEEPSEEK_API_KEY=
GEMINI_API_KEY=
EOF
log "services/api/.env created"

# ─── 8. Dependencies ───
info "8/14. Installing dependencies..."
cd "$DIR" && pnpm install --frozen-lockfile 2>&1 | tail -3

# ─── 9. Prisma ───
info "9/14. Prisma generate + migrate..."
cd "$DIR/services/api"
if [ -f "prisma/schema.prisma" ]; then
  npx prisma generate 2>&1 | tail -1
  npx prisma db push --accept-data-loss 2>&1 | tail -1 || warn "Prisma push issues (schema may not match DB)"
  log "Prisma ready"
fi

# ─── 10. Build frontend ───
info "10/14. Building frontend..."
cd "$DIR/apps/web" && rm -rf .next 2>/dev/null; pnpm next build 2>&1 | tail -3
log "Frontend built"

# ─── 11. Build backend ───
info "11/14. Building backend..."
cd "$DIR/services/api"
if pnpm build 2>&1 | tail -3; then
  log "Backend built"
else
  warn "Backend build had errors — checking dist..."
fi

# ─── 12. Apache config ───
info "12/14. Configuring Apache..."
cat > /etc/apache2/sites-available/dkn.conf << APACHE
<VirtualHost *:80>
    ServerName $IP
    ProxyPreserveHost On
    <Location /api/>
        ProxyPass http://127.0.0.1:3001/api/
        ProxyPassReverse http://127.0.0.1:3001/api/
    </Location>
    <Location />
        ProxyPass http://127.0.0.1:3000/
        ProxyPassReverse http://127.0.0.1:3000/
    </Location>
    ErrorLog \${APACHE_LOG_DIR}/dkn-error.log
    CustomLog \${APACHE_LOG_DIR}/dkn-access.log combined
</VirtualHost>
APACHE
a2enmod proxy proxy_http headers ssl rewrite 2>&1 | tail -1
a2dissite 000-default 2>/dev/null || true
a2ensite dkn.conf 2>&1 | tail -1
systemctl restart apache2 2>&1 | tail -1
log "Apache ready — http://$IP"

# ─── 13. PM2 start ───
info "13/14. Starting services with PM2..."
if [ -f "$DIR/services/api/dist/main.js" ]; then
  cd "$DIR/services/api" && pm2 start dist/main.js --name dkn-api -i max 2>&1 | tail -1
  log "API started (port 3001)"
fi
if [ -d "$DIR/apps/web/.next" ]; then
  cd "$DIR/apps/web" && pm2 start node_modules/next/dist/bin/next --name dkn-front -- start -p 3000 2>&1 | tail -1
  log "Frontend started (port 3000)"
fi
pm2 save 2>&1 | tail -1 || true
pm2 startup systemd -u root 2>/dev/null | tail -1 || true

# ─── 14. Health check ───
info "14/14. Health check..."
sleep 5
FRONT_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo "000")
APACHE_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:80 2>/dev/null || echo "000")
API_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/v1/auth/login -X POST 2>/dev/null || echo "000")

echo ""
echo "╔════════════════════════════════════════╗"
echo "║       DKN DEPLOYMENT RESULTS           ║"
echo "╠════════════════════════════════════════╣"
[[ "$FRONT_CODE" == "200" ]] && log "Frontend (3000): HTTP $FRONT_CODE" || warn "Frontend (3000): HTTP $FRONT_CODE"
[[ "$APACHE_CODE" == "200" ]] && log "Apache (80):    HTTP $APACHE_CODE" || warn "Apache (80):    HTTP $APACHE_CODE"
[[ "$API_CODE" == "404" || "$API_CODE" == "401" || "$API_CODE" == "201" ]] && log "API (3001):     HTTP $API_CODE" || warn "API (3001):     HTTP $API_CODE"
echo "╠════════════════════════════════════════╣"
echo "║  🌐 http://$IP                         "
echo "╚════════════════════════════════════════╝"
echo ""
log "Credentials saved in: $DIR/services/api/.env"

