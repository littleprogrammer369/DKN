# 🤖 پرامپت Cline — ساخت صفحه Profile (پروفایل) — جدید!

> **این پرامپت را در Cline CLI اجرا کنید تا صفحه پروفایل از صفر ساخته شود.**

---

## 📋 پرامپت اصلی

```
وظیفه: ساخت صفحه Profile از صفر (apps/web/src/components/screens/profile-screen.tsx).

## Context
- پروژه: DKN (داده کشت نوین)
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: apps/web/src/components/screens/profile-screen.tsx (جدید)
- Layout: apps/web/src/app/profile/page.tsx (ایجاد)
- Backend: GET /api/v1/users/me, PATCH /api/v1/users/me, GET /api/v1/users/me/stats
- کتابخانه: lucide-react

## 🏗️ ساختار صفحه

### بخش ۱: هدر با آواتار
```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, Calendar, Edit2, Camera } from 'lucide-react';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => api.get('/users/me/stats'),
  });

  return (
    <div className="min-h-screen pb-20 p-4 max-w-2xl mx-auto">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">پروفایل</h1>
        <button
          onClick={() => setEditMode(true)}
          className="p-2 rounded-xl bg-bg-elevated border border-border hover:border-primary"
        >
          <Edit2 size={18} className="text-text-secondary" />
        </button>
      </div>

      {/* کارت آواتار */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 shadow-glow mb-4 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold shadow-glow-lg">
            {user?.firstName?.[0] ?? 'ک'}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-glow">
            <Camera size={14} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-text-primary">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          @{user?.username}
        </p>
        <p className="text-xs text-text-tertiary mt-2">
          عضو از {formatJalaliDate(user?.createdAt)}
        </p>
      </div>

      {/* اطلاعات تماس */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-4 shadow-glow mb-4">
        <h3 className="text-sm font-medium text-text-secondary mb-3">اطلاعات تماس</h3>
        <div className="space-y-3">
          <InfoRow icon={<User size={16} />} label="نام" value={`${user?.firstName} ${user?.lastName}`} />
          <InfoRow icon={<Mail size={16} />} label="ایمیل" value={user?.email ?? '—'} />
          <InfoRow icon={<Phone size={16} />} label="تلفن" value={user?.phone} />
          <InfoRow icon={<Calendar size={16} />} label="تاریخ عضویت" value={formatJalaliDate(user?.createdAt)} />
        </div>
      </div>

      {/* کارت پلن فعلی */}
      <PlanCard user={user} />

      {/* آمار */}
      {stats && <StatsCard stats={stats} />}

      {/* تنظیمات تم */}
      <ThemeToggle />

      {/* لیست پلن‌ها */}
      <PlansList currentPlan={user?.plan} />

      {/* پشتیبانی */}
      <SupportSection />

      {/* درباره */}
      <AboutSection />

      {/* خروج */}
      <LogoutButton onLogout={logout} />
    </div>
  );
}
```

### بخش ۲: PlanCard
```tsx
import { Crown, Sparkles, Check } from 'lucide-react';

const PLAN_CONFIG = {
  free: {
    name: 'رایگان',
    price: '۰ تومان',
    color: 'from-gray-400 to-gray-500',
    icon: Sparkles,
    benefits: ['۱ مزرعه', '۱۰ چت AI در ماه', 'گزارش پایه'],
  },
  basic: {
    name: 'پایه',
    price: '۹۹,۰۰۰ تومان / ماه',
    color: 'from-blue-500 to-blue-600',
    icon: Crown,
    benefits: ['۵ مزرعه', '۱۰۰ چت AI', 'تصاویر ماهواره'],
  },
  pro: {
    name: 'حرفه‌ای',
    price: '۲۹۹,۰۰۰ تومان / ماه',
    color: 'from-purple-500 to-purple-600',
    icon: Crown,
    benefits: ['مزارع نامحدود', 'چت نامحدود', 'پشتیبانی آنلاین'],
  },
};

function PlanCard({ user }) {
  const plan = PLAN_CONFIG[user?.plan ?? 'free'];
  const Icon = plan.icon;

  return (
    <div className={`
      bg-gradient-to-l ${plan.color}
      rounded-2xl p-5 mb-4
      shadow-glow-lg
      text-white
    `}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm opacity-80">پلن فعلی</p>
          <h3 className="text-2xl font-bold mt-1">{plan.name}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon size={24} />
        </div>
      </div>
      <p className="text-lg font-semibold mb-4">{plan.price}</p>
      <div className="space-y-1">
        {plan.benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <Check size={14} />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push('/profile/plans')}
        className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
      >
        ارتقا پلن
      </button>
    </div>
  );
}
```

### بخش ۳: PlansList
```tsx
import { Check, Crown, Sparkles } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'رایگان',
    price: '۰',
    description: 'برای شروع',
    features: [
      { text: '۱ مزرعه', included: true },
      { text: '۱۰ چت AI در ماه', included: true },
      { text: 'گزارش آفت پایه', included: true },
      { text: 'تصاویر ماهواره', included: false },
      { text: 'پشتیبانی آنلاین', included: false },
    ],
    icon: Sparkles,
    color: 'border-gray-300',
  },
  {
    id: 'basic',
    name: 'پایه',
    price: '۹۹,۰۰۰',
    description: 'برای کشاورزان',
    features: [
      { text: '۵ مزرعه', included: true },
      { text: '۱۰۰ چت AI در ماه', included: true },
      { text: 'تصاویر ماهواره روزانه', included: true },
      { text: 'گزارش‌های پیشرفته', included: false },
      { text: 'پشتیبانی آنلاین', included: false },
    ],
    icon: Sparkles,
    color: 'border-blue-300',
  },
  {
    id: 'pro',
    name: 'حرفه‌ای',
    price: '۲۹۹,۰۰۰',
    description: 'برای حرفه‌ای‌ها',
    badge: 'پیشنهادی',
    features: [
      { text: 'مزارع نامحدود', included: true },
      { text: 'چت نامحدود با AI', included: true },
      { text: 'NDVI تحلیل', included: true },
      { text: 'گزارش‌های پیشرفته', included: true },
      { text: 'پشتیبانی آنلاین', included: true },
      { text: 'API دسترسی', included: true },
    ],
    icon: Crown,
    color: 'border-purple-500',
  },
];

function PlansList({ currentPlan }) {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-4 shadow-glow mb-4">
      <h3 className="text-sm font-medium text-text-secondary mb-4">پلن‌ها</h3>
      <div className="space-y-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`
                border-2 ${plan.color} 
                rounded-2xl p-4
                relative
                ${isCurrent ? 'bg-primary/5' : 'bg-bg-base'}
              `}
            >
              {plan.badge && (
                <span className="absolute -top-2 right-4 px-2 py-1 bg-primary text-white text-xs rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon size={18} className="text-primary" />
                    <h4 className="font-semibold text-text-primary">{plan.name}</h4>
                  </div>
                  <p className="text-xs text-text-secondary">{plan.description}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-text-primary">
                    {plan.price}
                  </p>
                  <p className="text-xs text-text-secondary">تومان / ماه</p>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check size={14} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <X size={14} className="text-gray-400 flex-shrink-0" />
                    )}
                    <span className={f.included ? 'text-text-primary' : 'text-text-tertiary line-through'}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
              {isCurrent ? (
                <button
                  disabled
                  className="w-full py-2 bg-bg-elevated border border-border rounded-xl text-sm text-text-secondary"
                >
                  پلن فعلی شما
                </button>
              ) : (
                <button
                  onClick={() => upgradeToPlan(plan.id)}
                  className="w-full py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90"
                >
                  انتخاب پلن
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### بخش ۴: ThemeToggle
```tsx
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-4 shadow-glow mb-4">
      <h3 className="text-sm font-medium text-text-secondary mb-3">تم</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setTheme('light')}
          className={`
            p-3 rounded-xl border-2 transition-all
            flex items-center justify-center gap-2
            ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
          `}
        >
          <Sun size={18} className={theme === 'light' ? 'text-primary' : 'text-text-secondary'} />
          <span className="text-sm">روز</span>
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`
            p-3 rounded-xl border-2 transition-all
            flex items-center justify-center gap-2
            ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
          `}
        >
          <Moon size={18} className={theme === 'dark' ? 'text-primary' : 'text-text-secondary'} />
          <span className="text-sm">شب</span>
        </button>
      </div>
    </div>
  );
}
```

### بخش ۵: SupportSection
```tsx
import { MessageCircle, Phone, Mail, HelpCircle, ExternalLink } from 'lucide-react';

function SupportSection() {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-4 shadow-glow mb-4">
      <h3 className="text-sm font-medium text-text-secondary mb-3">پشتیبانی</h3>
      <div className="space-y-1">
        <SupportItem icon={<MessageCircle size={18} />} label="چت آنلاین" hint="پاسخ در کمتر از ۵ دقیقه" onClick={() => openLiveChat()} />
        <SupportItem icon={<Phone size={18} />} label="تماس با ما" hint="۰۲۱-۱۲۳۴۵۶۷۸" href="tel:+982112345678" />
        <SupportItem icon={<Mail size={18} />} label="ایمیل" hint="support@dkn.ir" href="mailto:support@dkn.ir" />
        <SupportItem icon={<HelpCircle size={18} />} label="سوالات متداول" href="/faq" />
      </div>
    </div>
  );
}

function SupportItem({ icon, label, hint, onClick, href }: any) {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      href={href}
      onClick={onClick}
      className="w-full p-3 rounded-xl hover:bg-bg-base transition-colors flex items-center gap-3 text-right"
    >
      <div className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center flex-shrink-0 text-text-secondary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary text-sm">{label}</p>
        {hint && <p className="text-xs text-text-secondary">{hint}</p>}
      </div>
      {href && <ExternalLink size={14} className="text-text-tertiary flex-shrink-0" />}
    </Component>
  );
}
```

### بخش ۶: LogoutButton
```tsx
import { LogOut } from 'lucide-react';

function LogoutButton({ onLogout }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <button
      onClick={() => setConfirming(true)}
      className="
        w-full
        bg-red-50 dark:bg-red-900/20
        border border-red-200 dark:border-red-800
        text-red-600 dark:text-red-400
        rounded-2xl p-4
        hover:bg-red-100 dark:hover:bg-red-900/30
        transition-colors
        flex items-center justify-center gap-2
        font-medium
      "
    >
      <LogOut size={18} />
      خروج از حساب
    </button>
  );
}
```

## 🔧 دستورالعمل کلی

1. **از صفر بساز** — فایل جدید
2. **همه ایموجی lucide**
3. **همه کارت‌ها border + glow**
4. **همه متن‌ها فارسی**
5. **طراحی RTL**
6. **Day/Night mode**

## ✅ معیار پذیرش

- [ ] آواتار نمایش داده می‌شود
- [ ] مشخصات کامل نمایش
- [ ] کارت پلن فعلی
- [ ] لیست ۴ پلن (رایگان، پایه، حرفه‌ای، سازمانی)
- [ ] دکمه انتخاب/ارتقا
- [ ] Theme toggle (روز/شب)
- [ ] پشتیبانی (چت، تلفن، ایمیل، FAQ)
- [ ] خروج
- [ ] همه ایموجی lucide
- [ ] Build بدون خطا

## 📝 خروجی

- Branch: `feat/ui-profile-page`
- Commit: `feat(ui): ساخت صفحه Profile از صفر`
- PR
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `profile-screen.tsx` (جدید) | کل صفحه |
| `app/profile/page.tsx` (جدید) | route |
| `hooks/useAuth.ts` | اگه نیاز به update |
| `stores/themeStore.ts` (جدید) | اگه نیاز |
| `package.json` | lucide-react |

---

**🚀 این پرامپت را مستقیم به Cline بده!**
