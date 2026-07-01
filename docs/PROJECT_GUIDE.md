# داده کشت نوین (Dadeh Kesht Novin) - راهنمای جامع پروژه

## معرفی پروژه
پلتفرم کشاورزی هوشمند با هوش مصنوعی - اولین پلتفرم بومی ایران

## تکنولوژی ها

### Frontend
Next.js 14 | React 18 | TypeScript | TailwindCSS | Zustand
Leaflet | Chart.js | date-fns-jalali | axios | Framer Motion

### Backend
NestJS 10 | Prisma 5 | PostgreSQL 16 | Redis 7 | JWT | bcryptjs

## ساختار پروژه
apps/web/ -> Next.js Frontend
services/api/ -> NestJS Backend
docker-compose.yml -> PostgreSQL + Redis
apache/ -> Apache configs

## API Endpoints
/api/v1/auth/* - register, login, profile
/api/v1/farms/* - CRUD farms
/api/v1/ai/* - chat, history
/api/v1/weather/* - weather data
/api/v1/satellite/* - satellite imagery
/api/v1/irrigation/* - irrigation recommendations
/api/v1/pests/* - pests & diseases
/api/v1/notifications/* - notifications
/api/v1/reports/* - reports
/api/v1/users/* - profile update

## Frontend Conventions
RTL, Vazirmatn font, brand-green #2BB673, max-w-[420px]
Classes: .glass, .card, .btn-primary, .input-glass, .badge
Token in localStorage, Auth header: Bearer {token}
Always loading + error states, redirect to / if not logged in
