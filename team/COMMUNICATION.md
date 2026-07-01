# 💬 Communication — روش‌های ارتباطی تیم

> ارتباط مؤثر = پروژه موفق

---

## 📞 کانال‌های ارتباطی

| کانال | استفاده | زمان پاسخ |
|--------|---------|-----------|
| **GitHub Issues** | سوالات فنی، bugs، feature requests | ۲۴ ساعت |
| **GitHub PR Comments** | review کد | ۲۴ ساعت |
| **Telegram Group** | چت روزانه، سوالات سریع | ۲-۴ ساعت |
| **جلسه صوتی (Zoom)** | تصمیمات مهم، طراحی | scheduled |
| **تلفن** | فوری (سرور down) | فوری |

---

## 🎯 قوانین ارتباطی

### ۱. سوال فنی → GitHub Issue
- ایجاد Issue با template مناسب
- Label: `question` یا `bug`
- توضیح کامل + screenshot
- منتظر پاسخ بمانید

### ۲. تغییر کد → PR + Review
- قبل از merge، حداقل ۱ review
- review در ۲۴ ساعت
- اگه urgent، mention در Telegram

### ۳. بلاکر → فوری
- پیام در Telegram: "🚨 بلاکر: ..."
- اگه خیلی فوری، تماس تلفنی

### ۴. تصمیم معماری → جلسه
- قبل از تصمیم بزرگ
- ۳۰ دقیقه جلسه
- نتیجه در Issue یا ADR (Architecture Decision Record)

---

## 📅 جلسات منظم

### Daily Standup (هر روز)
- **زمان:** ۱۰:۰۰ صبح
- **مدت:** ۱۰ دقیقه
- **محل:** Telegram voice call
- **هر نفر:** ۳ سؤال (دیروز/امروز/blocker)

### Weekly Sync (جمعه)
- **زمان:** ۱۶:۰۰
- **مدت:** ۳۰ دقیقه
- **موضوع:**
  - Review هفته
  - برنامه هفته بعد
  - Release (اگه آماده)
  - بازنگری sprint

### Sprint Planning (هر ۲ هفته)
- **زمان:** اولین روز sprint
- **مدت:** ۱ ساعت
- **موضوع:**
  - انتخاب features برای sprint
  - تخمین زمان
  - Assign

### Retrospective (هر ۲ هفته)
- **زمان:** آخرین روز sprint
- **مدت:** ۳۰ دقیقه
- **موضوع:**
  - چه خوب کار کردیم؟
  - چه بد کار کردیم؟
  - چه بهبود بدهیم؟

---

## 🕐 زمان پاسخ‌گویی (SLA)

| اولویت | زمان پاسخ | کانال |
|--------|-----------|--------|
| 🔴 بحرانی (سرور down) | ۱۵ دقیقه | تلفن + Telegram |
| 🟡 مهم (PR review) | ۲۴ ساعت | GitHub |
| 🟢 عادی (سوال) | ۴۸ ساعت | GitHub Issue |
| ⚪ پایین (پیشنهاد) | ۱ هفته | GitHub |

---

## 💬 Tone و Style

### ✅ خوب
- مستقیم و صریح
- با احترام
- متمرکز بر مسئله (نه شخص)
- با دلیل و منطق

### ❌ بد
- توهین‌آمیز
- کنایه‌آمیز
- منفعل‌گرایانه ("not my problem")
- بدون دلیل

---

## 📝 Documentation Conventions

### Issue Template
- **عنوان:** `[TYPE] description` (مثلاً `[BUG] login fails on mobile`)
- **توضیح:** Context + Steps + Expected + Actual
- **Labels:** `bug`/`feature`/`docs` + priority
- **Assignee:** کسی که کار می‌کنه

### PR Template
- **عنوان:** `feat: description` یا `fix: description`
- **توضیح:** چه تغییر کرد + چرا + چطور تست
- **Checklist:** DoD
- **Reviewers:** حداقل ۱
- **Labels:** + type + priority

### Commit Message
```
<type>: <description فارسی>

[body اختیحی]
[footer اختیاری]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 🎯 Decision Making

### تصمیم کوچک (زیر ۱ ساعت کار)
- در Telegram تصمیم بگیرید
- مستند کنید در PR description

### تصمیم متوسط (۱-۸ ساعت)
- Issue در GitHub
- نظرسنجی ۲۴ ساعت
- تصمیم + مستندسازی

### تصمیم بزرگ (بیش از ۱ هفته)
- جلسه حضوری
- ADR (Architecture Decision Record)
- در `/docs/adr/` ذخیره شود

---

## 🌟 مثال‌های خوب ارتباطی

### خوب: Issue
```markdown
## مشکل
صفحه login در iOS Safari باز نمی‌شود

## Steps
1. باز کردن app در Safari
2. کلیک روی Login
3. صفحه خالی نمایش داده می‌شود

## Expected
صفحه login باید نمایش داده شود

## Actual
هیچ چیز نمایش داده نمی‌شود

## Environment
- iOS 16
- Safari
- App version: 1.0.0

## Screenshots
[image.png]
```

### خوب: PR
```markdown
## چه تغییر کرد
اضافه کردن validation به فرم ثبت‌نام

## چرا
فرم ثبت‌نام بدون validation بود و کاربران می‌توانستند با داده‌های نامعتبر ثبت‌نام کنند

## چطور تست
- [ ] تست شده با داده‌های معتبر
- [ ] تست شده با داده‌های نامعتبر
- [ ] تست شده روی موبایل

## Screenshots
[screenshot.png]

Closes #123
```

---

**🌿 ارتباط خوب = تیم خوب = پروژه موفق**
