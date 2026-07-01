# 🌟 خوش‌آمدید به تیم داده کشت نوین!

> این پوشه **نقطه شروع نفر جدید** است.
> اگر تازه به تیم پیوستید، **از اینجا شروع کنید**.

---

## 📋 ترتیب خواندن (۳۰ دقیقه)

| # | فایل | چه چیزی یاد می‌گیرید | زمان |
|---|------|---------------------|------|
| ۱ | [ONBOARDING.md](./ONBOARDING.md) | محیط کار + راه‌اندازی | ۱۵ دقیقه |
| ۲ | [WORKFLOW.md](./WORKFLOW.md) | تقسیم کار تیم | ۱۰ دقیقه |
| ۳ | [FEATURES.md](./FEATURES.md) | features مال شما | ۵ دقیقه |
| ۴ | [COMMUNICATION.md](./COMMUNICATION.md) | روش‌های ارتباطی | ۲ دقیقه |
| ۵ | [prompts/](./prompts/) | پرامپت‌های Cline آماده | مرجع |

---

## 🎯 اولین task شما

بعد از خواندن فایل‌های بالا:

```bash
# ۱. مطمئن شوید محیط شما راه‌اندازی شده (طبق ONBOARDING.md)
cd ~/DKN
pnpm dev  # باید بدون خطا اجرا شود

# ۲. یک شاخه جدید برای اولین task بسازید
git checkout develop
git pull origin develop
git checkout -b feature/<نام-شما>-hello-world

# ۳. یک تغییر کوچک ایجاد کنید (مثلاً یک کامنت)
# در فایل README.md یک خط اضافه کنید

# ۴. Commit و PR
git add .
git commit -m "docs: اولین commit توسط [نام شما]"
git push origin feature/<نام-شما>-hello-world
# در GitHub: Create PR
```

**اگه موفق شدید، به سراغ features اصلی در `FEATURES.md` بروید.**

---

## 📞 اگه سوال دارید

1. اول در [GitHub Issues](https://github.com/littleprogrammer369/DKN/issues) جستجو کنید
2. اگه نبود، Issue جدید بسازید
3. در Telegram group پیام دهید

---

**🌿 خوش‌آمدید! منتظر همکاری شما هستیم.**
