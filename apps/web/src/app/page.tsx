'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { onlyDigits } from '@/lib/utils';
import { ThemeProvider, useTheme } from '@/lib/theme';

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="absolute top-4 left-4 w-10 h-10 rounded-full glass dark:bg-night-card/80 dark:border-night-border/60 flex items-center justify-center text-lg z-20 transition-all hover:scale-110" aria-label="toggle theme">
      <span>{theme === 'day' ? '🌙' : '☀️'}</span>
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const validatePhone = (v: string) => /^[0-9]{10}$/.test(v) ? '' : 'شماره موبایل باید ۱۰ رقم باشد';
  const validatePassword = (v: string) => v.length >= 8 ? '' : 'رمز عبور حداقل ۸ کاراکتر';
  const validateName = (v: string) => v.length >= 2 ? '' : 'حداقل ۲ کاراکتر';
  const validateUsername = (v: string) => /^[a-zA-Z0-9_]{3,}$/.test(v) ? '' : 'حداقل ۳ حرف/عدد';

  const computeStrength = (v: string) => {
    if (v.length < 4) return 'ضعیف';
    if (v.length < 8) return 'متوسط';
    if (/[A-Za-z]/.test(v) && /[0-9]/.test(v)) return 'قوی';
    return 'متوسط';
  };

  const handleSendOtp = async () => {
    const err = validatePhone(phone);
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0' + phone }),
      });
      if (!res.ok) throw new Error('خطا در ارسال کد');
      setOtpSent(true);
    } catch (err: any) { setError(err.message || 'خطا');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 5) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0' + phone, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'کد اشتباه');
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) { setError(err.message || 'خطا');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;
    if (!isLogin && !firstName) return;
    if (!isLogin && password !== confirmPassword) { setError('رمزها مطابقت ندارند'); return; }
    setLoading(true); setError('');
    try {
      const fullPhone = '0' + phone;
      const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body: any = { phone: fullPhone, password };
      if (!isLogin) { body.firstName = firstName; body.lastName = lastName; if (email) body.email = email; }
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا');
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(isLogin ? '/dashboard' : '/setup');
    } catch (err: any) { setError(err.message || 'خطا');
    } finally { setLoading(false); }
  };

  const focusOtpInput = (idx: number) => {
    setTimeout(() => document.getElementById('otp-' + idx)?.focus(), 10);
  };

  return (
    <ThemeProvider>
      <div className="screen-login active flex flex-col justify-center items-center min-h-screen px-5 py-10 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />
        <div className="mb-8 text-center">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)', boxShadow: '0 8px 32px rgba(43,182,115,0.25)' }}>
            <span className="text-white text-4xl">🌿</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-night-text">داده کشت نوین</h1>
          <p className="text-sm text-gray-500 dark:text-night-muted mt-1">هوش مصنوعی در خدمت کشاورزی</p>
        </div>

        <div className="w-full max-w-sm glass dark:bg-night-card/80 dark:border-night-border/60 p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-gray-800 dark:text-night-text mb-1">{isLogin ? 'ورود' : 'ثبت‌نام'}</h2>
          <p className="text-xs text-gray-500 dark:text-night-muted mb-5">{isLogin ? 'برای ورود، شماره خود را وارد کنید' : 'برای شروع، اطلاعات خود را وارد کنید'}</p>
          {isLogin && (
            <div className="flex mb-4 bg-gray-100 dark:bg-night-surface rounded-xl p-1">
              <button type="button"
                onClick={() => { setAuthMethod('password'); setError(''); setFieldErrors({}); setOtpSent(false); setOtpCode(''); }}
                className={'flex-1 text-xs font-bold py-2 rounded-lg transition-all ' + (authMethod === 'password' ? 'bg-white dark:bg-night-card shadow-sm text-brand-green' : 'text-gray-500 dark:text-night-muted')}>
                🔑 رمز عبور
              </button>
              <button type="button"
                onClick={() => { setAuthMethod('otp'); setError(''); setFieldErrors({}); }}
                className={'flex-1 text-xs font-bold py-2 rounded-lg transition-all ' + (authMethod === 'otp' ? 'bg-white dark:bg-night-card shadow-sm text-brand-green' : 'text-gray-500 dark:text-night-muted')}>
                📱 کد تایید (OTP)
              </button>
            </div>
          )}
          <form onSubmit={authMethod === 'otp' && isLogin ? (e) => { e.preventDefault(); otpSent ? handleVerifyOtp() : handleSendOtp(); } : handleSubmit}>
            {!isLogin && (
              <>
                <input type="text" placeholder="نام" value={firstName}
                  onChange={e => { setFirstName(e.target.value); setError(''); setFieldErrors(f => ({...f, firstName: ''})); }}
                  onBlur={e => { const err = validateName(e.target.value); setFieldErrors(f => ({...f, firstName: err})); }}
                  className="input-glass mb-2 text-right" />
                {fieldErrors.firstName && <p className="text-[10px] text-red-500 mb-2 mr-1">{fieldErrors.firstName}</p>}
                <input type="text" placeholder="نام خانوادگی" value={lastName}
                  onChange={e => { setLastName(e.target.value); setError(''); setFieldErrors(f => ({...f, lastName: ''})); }}
                  onBlur={e => { const err = validateName(e.target.value); setFieldErrors(f => ({...f, lastName: err})); }}
                  className="input-glass mb-3 text-right" />
                {fieldErrors.lastName && <p className="text-[10px] text-red-500 mb-2 mr-1">{fieldErrors.lastName}</p>}
              </>
            )}
            <div className="relative mb-3">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600 dark:text-night-muted z-10">+98</span>
              <input type="tel" inputMode="numeric" maxLength={10} placeholder="9123456789" value={phone}
                onChange={e => { setPhone(onlyDigits(e.target.value)); setError(''); setFieldErrors(f => ({...f, phone: ''})); }}
                onBlur={e => { const err = validatePhone(e.target.value); setFieldErrors(f => ({...f, phone: err})); }}
                className="input-glass dark:bg-night-card/60 dark:text-night-text text-center text-lg tracking-widest pr-10" />
            </div>
            {fieldErrors.phone && <p className="text-[10px] text-red-500 mb-2 mr-1 -mt-2">{fieldErrors.phone}</p>}
            {!isLogin && (
              <>
                <input type="text" placeholder="نام کاربری (حداقل ۳ حرف/عدد)" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); setFieldErrors(f => ({...f, username: ''})); }}
                  onBlur={e => { const err = validateUsername(e.target.value); setFieldErrors(f => ({...f, username: err})); }}
                  className="input-glass mb-3 text-right" />
                {fieldErrors.username && <p className="text-[10px] text-red-500 mb-2 mr-1">{fieldErrors.username}</p>}
              </>
            )}
            {authMethod === 'password' && (
              <>
                <input type="password" placeholder="رمز عبور" value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); setPasswordStrength(computeStrength(e.target.value)); setFieldErrors(f => ({...f, password: ''})); }}
                  onBlur={e => { const err = validatePassword(e.target.value); setFieldErrors(f => ({...f, password: err})); }}
                  className="input-glass mb-1" />
                {password && (
                  <div className="flex items-center gap-2 mb-3 mr-1">
                    <div className="flex gap-1 flex-1">
                      <div className={'h-1 flex-1 rounded-full ' + (passwordStrength === 'ضعیف' ? 'bg-red-400' : passwordStrength === 'متوسط' ? 'bg-amber-400' : 'bg-green-400')} />
                      <div className={'h-1 flex-1 rounded-full ' + (passwordStrength === 'قوی' ? 'bg-green-400' : passwordStrength === 'متوسط' ? 'bg-amber-400' : 'bg-gray-200 dark:bg-gray-700')} />
                      <div className={'h-1 flex-1 rounded-full ' + (passwordStrength === 'قوی' ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700')} />
                    </div>
                    <span className={'text-[10px] ' + (passwordStrength === 'ضعیف' ? 'text-red-500' : passwordStrength === 'متوسط' ? 'text-amber-500' : 'text-green-500')}>{passwordStrength}</span>
                  </div>
                )}
                {fieldErrors.password && <p className="text-[10px] text-red-500 mb-2 mr-1">{fieldErrors.password}</p>}
                {!isLogin && (
                  <>
                    <input type="password" placeholder="تکرار رمز عبور" value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setError(''); setFieldErrors(f => ({...f, confirmPassword: ''})); }}
                      onBlur={e => { if (e.target.value !== password) setFieldErrors(f => ({...f, confirmPassword: 'رمزها مطابقت ندارند'})); }}
                      className="input-glass mb-3" />
                    {fieldErrors.confirmPassword && <p className="text-[10px] text-red-500 mb-2 mr-1">{fieldErrors.confirmPassword}</p>}
                  </>
                )}
              </>
            )}
            {authMethod === 'otp' && isLogin && (
              <div className="mb-4">
                {!otpSent ? (
                  <button type="submit" disabled={loading || !phone} className="btn-primary disabled:opacity-40 w-full">
                    {loading ? '⏳ در حال ارسال...' : '📨 ارسال کد تایید'}
                  </button>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 dark:text-night-muted mb-3 text-center">کد ۵ رقمی ارسال شده را وارد کنید</p>
                    <div className="flex justify-center gap-2 mb-4" dir="ltr">
                      {[0,1,2,3,4].map(i => (
                        <input key={i} type="tel" inputMode="numeric" maxLength={1}
                          value={otpCode[i] || ''}
                          onChange={e => {
                            const val = onlyDigits(e.target.value).slice(-1);
                            const newCode = otpCode.substring(0,i) + val + otpCode.substring(i+1);
                            setOtpCode(newCode);
                            if (val && i < 4) focusOtpInput(i+1);
                          }}
                          onKeyDown={e => { if (e.key === 'Backspace' && !otpCode[i] && i > 0) focusOtpInput(i-1); }}
                          id={'otp-' + i}
                          className="w-12 h-12 text-center text-lg font-bold rounded-xl border-2 border-gray-200 dark:border-night-border bg-white dark:bg-night-card focus:border-brand-green outline-none" />
                      ))}
                    </div>
                    <button type="submit" disabled={loading || otpCode.length !== 5} className="btn-primary disabled:opacity-40 w-full">
                      {loading ? '⏳ در حال ورود...' : '✅ تأیید و ورود'}
                    </button>
                    <button type="button" onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); }} className="btn-outline mt-2 w-full !text-xs">
                      🔄 تغییر شماره
                    </button>
                  </>
                )}
              </div>
            )}
            {error && <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</div>}
            {authMethod === 'password' && (
              <button type="submit" disabled={loading || !phone || !password || (!isLogin && (!firstName || password !== confirmPassword))} className="btn-primary disabled:opacity-40">
                {loading ? '⏳ لطفاً صبر کنید...' : (isLogin ? '🔑 ورود' : '📝 ثبت‌نام')}
              </button>
            )}
          </form>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); setFieldErrors({}); setOtpSent(false); setOtpCode(''); setAuthMethod('password'); }} className="btn-outline mt-3">
            {isLogin ? '👤 حساب ندارید؟ ثبت‌نام کنید' : '🔑 حساب دارید؟ وارد شوید'}
          </button>
          <p className="text-[10px] text-gray-400 dark:text-night-muted/70 text-center mt-3">با ادامه، <a href="#" className="text-brand-green underline">قوانین</a> را می‌پذیرید</p>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-night-muted/60 text-center mt-8 max-w-xs leading-relaxed">
          با ثبت‌نام، از <a href="#" className="text-brand-green">شرایط استفاده</a> و{' '}
          <a href="#" className="text-brand-green">حریم خصوصی</a> مطلع شده‌اید.
        </p>
      </div>
    </ThemeProvider>
  );
}
