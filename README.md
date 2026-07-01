# 🌿 داده کشت نوین (Dadeh Kesht Novin)

> **پلتفرم کشاورزی هوشمند با هوش مصنوعی**
> افزایش ۳۰٪ سود خالص کشاورز + کاهش ۴۰٪ مصرف آب

---

## ✨ معرفی

**داده کشت نوین** اولین پلتفرم بومی ایران برای کشاورزی هوشمند است.

### ویژگی‌های کلیدی

- 🛰️ **تصاویر ماهواره‌ای** — NDVI هر ۵ روز
- 🌡️ **سنسورهای IoT** — رطوبت، دما، pH، شوری
- 🤖 **دستیار AI شخصی** — با Context مزرعه شما
- 🌦️ **آب‌وهوا** — پیش‌بینی دقیق ۷ روزه
- 📊 **داشبورد هوشمند** — امتیاز سلامت مزرعه

### محصول اول
**گندم** — تمام فیچرها برای گندم بهینه شده‌اند.

---

## 🚀 شروع سریع

```bash
git clone https://github.com/littleprogrammer369/DKN.git
cd DKN
pnpm install
cp services/api/.env.example services/api/.env
# Edit .env with real keys
docker compose up -d
cd services/api && pnpm prisma migrate deploy && cd ../..
pnpm dev
```

✅ Frontend: http://localhost:3000
✅ Backend API: http://localhost:3001
✅ Swagger: http://localhost:3001/api/docs

---

## 🏗 معماری

```
Frontend (Next.js 14) → Apache → Backend (NestJS) → PostgreSQL + Redis + AI
```

جزئیات: [docs/TECHNICAL_BLUEPRINT.md](./docs/TECHNICAL_BLUEPRINT.md)

---

## 🤝 مشارکت

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [BRANCHING.md](./BRANCHING.md)
- [team/](./team/) — راهنمای تیم

### Workflow سریع
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
# ... کدنویسی ...
git push origin feature/my-feature
# Create PR
```

---

## 📚 مستندات

- [docs/TECHNICAL_BLUEPRINT.md](./docs/TECHNICAL_BLUEPRINT.md)
- [team/ONBOARDING.md](./team/ONBOARDING.md)
- API Docs: `/api/docs`

---

## 📞 تماس

- GitHub: [github.com/littleprogrammer369](https://github.com/littleprogrammer369)
- محل: ساوه، ایران

---

## 📜 مجوز

[MIT License](./LICENSE)

---

**© ۲۰۲۶ داده کشت نوین — ساخته شده با ❤️ در ساوه**
