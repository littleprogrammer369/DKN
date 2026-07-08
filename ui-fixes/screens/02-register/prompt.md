# 🤖 پرامپت Cline — اصلاح UI صفحه Register (ثبت‌نام)

> **این پرامپت را در Cline CLI اجرا کنید.**

---

## 📋 پرامپت اصلی

```
وظیفه: اصلاح ۱۰ مشکل UI در صفحه Register (apps/web/src/components/screens/register-screen.tsx).

## Context
- پروژه: DKN (داده کشت نوین)
- Frontend: Next.js 14 + Tailwind + TypeScript
- فایل هدف: apps/web/src/components/screens/register-screen.tsx
- فیلدهای فعلی: نام، نام‌خانوادگی، شماره تلفن، نام‌کاربری، رمز عبور، تکرار رمز عبور
- کتابخانه آیکون: lucide-react

## ❌ مشکلات P0 (بحرانی)

### P0-R۱: جابجایی پرچم +۹۸ از راست به چپ
(همان login P0-L۱)
- در فیلد تلفن، پرچم "+۹۸" از راست به چپ منتقل شود

### P0-R۲: تفکیک بصری فیلدها در روز
(همان login P0-L۲)
- هر فیلد با border و background جدا از بقیه

## 🟡 مشکلات P1 (مهم)

### P1-R۳: جایگزینی ایموجی با آیکون
```tsx
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

// در دکمه ثبت‌نام:
// قبل: 📝 ثبت‌نام
// بعد: <UserPlus size={18} /> ثبت‌نام

// در لینک ورود:
// قبل: 🔑 حساب دارید؟ وارد شوید
// بعد: <LogIn size={16} /> حساب دارید؟ وارد شوید
```

### P1-R۴: Password Strength Indicator
```tsx
const [password, setPassword] = useState('');

const getPasswordStrength = (pwd: string): { level: 'weak' | 'medium' | 'strong'; label: string; color: string } => {
  if (pwd.length < 8) return { level: 'weak', label: 'ضعیف', color: 'bg-red-500' };
  if (pwd.length < 12 || !/[!@#$%^&*]/.test(pwd)) {
    return { level: 'medium', label: 'متوسط', color: 'bg-amber-500' };
  }
  return { level: 'strong', label: 'قوی', color: 'bg-green-500' };
};

const strength = getPasswordStrength(password);

// زیر فیلد رمز:
{password && (
  <div className="mt-2 flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
      <div
        className={`h-full ${strength.color} transition-all`}
        style={{ width: strength.level === 'weak' ? '33%' : strength.level === 'medium' ? '66%' : '100%' }}
      />
    </div>
    <span className={`text-xs font-medium ${
      strength.level === 'weak' ? 'text-red-600' :
      strength.level === 'medium' ? 'text-amber-600' :
      'text-green-600'
    }`}>
      {strength.label}
    </span>
  </div>
)}
```

### P1-R۵: Match Validation رمزها
```tsx
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const passwordsMatch = password && confirmPassword && password === confirmPassword;
const passwordsMismatch = confirmPassword && password !== confirmPassword;

// در فیلد "تکرار رمز":
<div className="relative">
  <input
    type={showConfirmPassword ? 'text' : 'password'}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className={`
      w-full bg-transparent outline-none
      ${passwordsMismatch ? 'text-red-600' : ''}
    `}
  />
  {/* Match indicator */}
  {passwordsMatch && (
    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={18} />
  )}
  {passwordsMismatch && (
    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" size={18} />
  )}
</div>

{passwordsMismatch && (
  <p className="text-xs text-red-600 mt-1">رمزها یکسان نیستند</p>
)}
{passwordsMatch && (
  <p className="text-xs text-green-600 mt-1">✓ رمزها یکسان هستند</p>
)}
```

## 🟢 مشکلات P2 (اختیاری)

### P2-R۶: نمایش/مخفی کردن رمز
```tsx
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// در فیلد رمز:
<div className="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-transparent outline-none pl-10"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
```

### P2-R۷: Privacy/Terms Checkbox
```tsx
const [acceptTerms, setAcceptTerms] = useState(false);

<div className="flex items-start gap-2 mt-4">
  <input
    type="checkbox"
    id="terms"
    checked={acceptTerms}
    onChange={(e) => setAcceptTerms(e.target.checked)}
    className="mt-1 w-4 h-4 accent-primary"
  />
  <label htmlFor="terms" className="text-sm text-text-secondary leading-relaxed">
    <Link href="/terms" className="text-primary hover:underline">قوانین</Link>
    {' '}و{' '}
    <Link href="/privacy" className="text-primary hover:underline">حریم خصوصی</Link>
    {' '}را خوانده‌ام و می‌پذیرم.
  </label>
</div>

<button
  disabled={!acceptTerms || loading}
  className="w-full bg-primary text-white py-3 rounded-xl ..."
>
  ثبت‌نام
</button>
```

### P2-R۸: Helper Text زیر فیلدها
```tsx
// فیلد نام کاربری:
<div>
  <div className="bg-bg-base border border-border rounded-xl px-4 py-3 ...">
    <input
      placeholder="نام کاربری"
      value={username}
      onChange={...}
    />
  </div>
  <p className="text-xs text-text-secondary mt-1.5 px-1">
    حداقل ۳ کاراکتر، فقط حروف انگلیسی و اعداد
  </p>
</div>

// فیلد تلفن:
<p className="text-xs text-text-secondary mt-1.5 px-1">
  شماره موبایل معتبر ایران (مثلاً ۹۱۲۳۴۵۶۷۸۹)
</p>
```

### P2-R۹: Real-time Username Check
```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

const debouncedUsername = useDebounce(username, 500);

const { data: usernameCheck } = useQuery({
  queryKey: ['check-username', debouncedUsername],
  queryFn: () => api.get(`/users/check-username?username=${debouncedUsername}`),
  enabled: debouncedUsername.length >= 3,
});

{usernameCheck && (
  <p className={`text-xs mt-1.5 ${usernameCheck.available ? 'text-green-600' : 'text-red-600'}`}>
    {usernameCheck.available ? '✓ این نام کاربری در دسترس است' : '✗ این نام کاربری قبلاً انتخاب شده'}
  </p>
)}
```

### P2-R۱۰: Success Animation
```tsx
import { motion, AnimatePresence } from 'framer-motion';

const [success, setSuccess] = useState(false);

<AnimatePresence>
  {success && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="text-green-600" size={40} />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        حساب شما ساخته شد!
      </h2>
      <p className="text-text-secondary">
        در حال انتقال به داشبورد...
      </p>
    </motion.div>
  )}
</AnimatePresence>

// در onSuccess:
setSuccess(true);
setTimeout(() => router.push('/dashboard'), 2000);
```

## 🔧 دستورالعمل کلی

1. **اول lucide-react رو نصب کن** (اگه در login نصب شده، اینجا skip)
2. **از framer-motion استفاده کن** برای animation
3. **از react-hook-form + zod برای validation استفاده کن:**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(2, 'نام حداقل ۲ کاراکتر'),
  lastName: z.string().min(2, 'نام خانوادگی حداقل ۲ کاراکتر'),
  username: z.string().min(3, 'نام کاربری حداقل ۳ کاراکتر').regex(/^[a-zA-Z0-9_]+$/, 'فقط حروف انگلیسی و اعداد'),
  phone: z.string().regex(/^9[0-9]{9}$/, 'شماره موبایل نامعتبر'),
  password: z.string().min(8, 'رمز عبور حداقل ۸ کاراکتر'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, { message: 'باید قوانین را بپذیرید' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمزها یکسان نیستند',
  path: ['confirmPassword'],
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(registerSchema),
});
```

4. **هر commit atomic باشد**

## ✅ معیار پذیرش

- [ ] +۹۸ در سمت چپ input است
- [ ] فیلدها در روز هم border دارند
- [ ] همه ایموجی‌ها با آیکون lucide جایگزین شدن
- [ ] Password strength نشان داده می‌شود
- [ ] Match validation کار می‌کند
- [ ] نمایش/مخفی رمز کار می‌کند
- [ ] Privacy checkbox کار می‌کند
- [ ] Helper text زیر فیلدها نمایش داده می‌شود
- [ ] Username check real-time است
- [ ] Success animation نمایش داده می‌شود
- [ ] Build بدون خطا

## 📝 خروجی مورد انتظار

- Branch: `fix/ui-register-page`
- Commit: `fix(ui): اصلاح ۱۰ مشکل صفحه Register`
- PR: لینک GitHub
```

---

## 📂 فایل‌های تحت تغییر

| فایل | تغییرات |
|------|---------|
| `register-screen.tsx` | همه ۱۰ مشکل |
| `hooks/useDebounce.ts` (جدید) | برای username check |
| `package.json` | اگه نیاز به react-hook-form, zod |

---

**🚀 این پرامپت را مستقیم به Cline بده!**
