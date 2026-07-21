'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Key, Lock, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { onlyDigits } from '@/lib/utils';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="absolute top-4 left-4 w-10 h-10 rounded-full glass dark:bg-night-card/80 dark:border-night-border/60 flex items-center justify-center text-lg z-20 transition-all hover:scale-110" aria-label="toggle theme">
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'done'>('phone');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpId, setOtpId] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusOtpInput = (i: number) => {
    if (i >= 0 && i < 5) otpRefs.current[i]?.focus();
  };

  const handleSendOtp = async () => {
    const phoneDigits = onlyDigits(phone);
    if (phoneDigits.length !== 10) {
      setError('لطفاً شماره موبایل ۱۰ رقمی را وارد کنید');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0' + phoneDigits }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در ارسال کد');
      setOtpId(data.otpId || '');
      setStep('otp');
      setTimeout(() => focusOtpInput(0), 100);
    } catch (err: any) {
      setError(err.message || 'خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 5) {
      setError('لطفاً کد ۵ رقمی را کامل وارد کنید');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0' + onlyDigits(phone), code: otpCode, otpId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'کد نامعتبر');
      }
      setStep('password');
    } catch (err: any) {
      setError(err.message || 'خطا در تأیید کد');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیست');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '0' + onlyDigits(phone), code: otpCode, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'خطا در تغییر رمز عبور');
      }
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen px-4 py-6 transition-colors duration-300 dark:bg-night-bg">
        <ThemeToggleInline />

        <div className="max-w-[420px] mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-night-muted mb-6 hover:text-brand-green transition-colors">
            <ArrowRight size={16} /> بازگشت به ورود
          </Link>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Key className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-night-text">بازیابی رمز عبور</h1>
              <p className="text-xs text-gray-500 dark:text-night-muted">
                {step === 'phone' && 'شماره موبایل خود را وارد کنید'}
                {step === 'otp' && 'کد تأیید را وارد کنید'}
                {step === 'password' && 'رمز عبور جدید را وارد کنید'}
                {step === 'done' && 'رمز عبور با موفقیت تغییر کرد'}
              </p>
            </div>
          </div>

          {/* Step 1: Phone Input */}
          {step === 'phone' && (
            <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card shadow-glow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Phone className="text-blue-500" size={28} />
                </div>
                <p className="text-sm text-gray-600 dark:text-night-muted">
                  شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.
                </p>
              </div>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600 dark:text-night-muted z-10">+98</span>
                <input type="tel" inputMode="numeric" maxLength={10} placeholder="9123456789" dir="ltr"
                  value={phone} onChange={e => { setPhone(onlyDigits(e.target.value)); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  className="input-glass dark:bg-night-card/60 dark:text-night-text text-center text-lg tracking-widest pl-10" />
              </div>
              {error && (
                <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</div>
              )}
              <button onClick={handleSendOtp} disabled={loading || onlyDigits(phone).length !== 10}
                className="btn-primary disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Key size={18} />}
                {loading ? 'در حال ارسال...' : 'ارسال کد تأیید'}
              </button>
            </motion.div>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card shadow-glow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="text-green-500" size={28} />
                </div>
                <p className="text-sm text-gray-600 dark:text-night-muted mb-1">
                  کد تأیید به شماره <span className="font-bold text-gray-800 dark:text-night-text" dir="ltr">+98 {phone}</span> ارسال شد.
                </p>
                <p className="text-xs text-gray-400 dark:text-night-muted/70">کد ۵ رقمی را وارد کنید</p>
              </div>
              <div className="flex justify-center gap-2 mb-4" dir="ltr">
                {[0,1,2,3,4].map(i => (
                  <input key={i} type="tel" inputMode="numeric" maxLength={1}
                    ref={el => { otpRefs.current[i] = el; }}
                    value={otpCode[i] || ''}
                    onChange={e => {
                      const val = onlyDigits(e.target.value).slice(-1);
                      const newCode = otpCode.substring(0,i) + val + otpCode.substring(i+1);
                      setOtpCode(newCode);
                      if (val && i < 4) focusOtpInput(i+1);
                    }}
                    onKeyDown={e => { if (e.key === 'Backspace' && !otpCode[i] && i > 0) focusOtpInput(i-1); }}
                    className="w-14 h-14 text-center text-xl font-bold rounded-2xl border-2 border-gray-200 dark:border-night-border bg-white dark:bg-night-card focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
                ))}
              </div>
              {error && (
                <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</div>
              )}
              <button onClick={handleVerifyOtp} disabled={loading || otpCode.length !== 5}
                className="btn-primary disabled:opacity-40 flex items-center justify-center gap-2 mb-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowLeft size={18} />}
                {loading ? 'در حال تأیید...' : 'تأیید کد'}
              </button>
              <button onClick={() => { setStep('phone'); setOtpCode(''); setError(''); }}
                className="w-full text-xs text-gray-500 dark:text-night-muted hover:text-brand-green transition-colors mt-2">
                تغییر شماره موبایل
              </button>
            </motion.div>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card shadow-glow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Lock className="text-amber-500" size={28} />
                </div>
                <p className="text-sm text-gray-600 dark:text-night-muted">رمز عبور جدید خود را وارد کنید</p>
              </div>
              <input type="password" placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)" value={password}
                onChange={e => setPassword(e.target.value)} className="input-glass mb-3" />
              <input type="password" placeholder="تکرار رمز عبور جدید" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} className="input-glass mb-3" />
              {error && (
                <div className="text-xs text-red-500 dark:text-red-400 text-center mb-3 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</div>
              )}
              <button onClick={handleResetPassword} disabled={loading || !password || !confirmPassword}
                className="btn-primary disabled:opacity-40 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowLeft size={18} />}
                {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
              </button>
            </motion.div>
          )}

          {/* Step 4: Done */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card shadow-glow text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="text-green-500" size={32} />
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-night-text mb-2">رمز عبور با موفقیت تغییر کرد</h2>
              <p className="text-xs text-gray-500 dark:text-night-muted mb-6">
                اکنون می‌توانید با رمز عبور جدید وارد شوید.
              </p>
              <button onClick={() => router.push('/')} className="btn-primary">
                ورود به حساب
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </ThemeProvider>
  );
}
