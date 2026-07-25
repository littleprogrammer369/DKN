'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { onlyDigits } from '@/lib/utils';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { Key, Mail, Phone, UserPlus, Lock, ArrowLeft, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2, Sun, Moon } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onGoToDashboard?: () => void;
}

function ThemeToggleInline() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="absolute top-4 left-4 w-10 h-10 rounded-full glass dark:bg-night-card/80 dark:border-night-border/60 flex items-center justify-center text-lg z-20 transition-all hover:scale-110" aria-label="toggle theme">
      {theme === 'day' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

export default function AuthPage({ initialMode = 'login', onGoToDashboard }: AuthPageProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [hasToken, setHasToken] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { setHasToken(!!localStorage.getItem("token")); } catch { setHasToken(false); }
  }, []);

  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setAuthMethod("password");
    setError("");
    setFieldErrors({});
    setOtpSent(false);
    setOtpCode("");
  }, [initialMode]);

  const validatePhone = (v: string) => /^[0-9]{10}$/.test(v) ? "" : "شماره موبایل باید ۱۰ رقم باشد";
  const validatePassword = (v: string) => v.length >= 8 ? "" : "رمز عبور حداقل ۸ کاراکتر";
  const validateName = (v: string) => v.length >= 2 ? "" : "حداقل ۲ کاراکتر";
  const validateUsername = (v: string) => /^[a-zA-Z0-9_]{3,}$/.test(v) ? "" : "حداقل ۳ حرف/عدد";

  const computeStrength = (v: string) => {
    if (v.length < 4) return "ضعیف";
    if (v.length < 8) return "متوسط";
    if (/[A-Za-z]/.test(v) && /[0-9]/.test(v)) return "قوی";
    return "متوسط";
  };

  const handleSendOtp = async () => {
    const err = validatePhone(phone);
    if (err) { setError(err); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "0" + phone }),
      });
      if (!res.ok) throw new Error("خطا در ارسال کد");
      setOtpSent(true);
    } catch (err: any) { setError(err.message || "خطا");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "0" + phone, code: otpCode }),
      });
      if (!res.ok) throw new Error("کد نامعتبر");
      const data = await res.json();
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      router.push("/dashboard");
    } catch (err: any) { setError(err.message || "خطا");
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    const passwordErr = validatePassword(password);
    if (phoneErr || passwordErr) {
      setFieldErrors({ phone: phoneErr, password: passwordErr });
      return;
    }
    setLoading(true); setError("");
    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const body: any = { phone: "0" + phone, password };
      if (!isLogin) {
        body.firstName = firstName;
        body.lastName = lastName;
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا");
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      router.push("/dashboard");
    } catch (err: any) { setError(err.message || "خطا");
    } finally { setLoading(false); }
  };

  const focusOtpInput = (idx: number) => {
    setTimeout(() => document.getElementById("otp-" + idx)?.focus(), 10);
  };

  const goToDashboard = () => {
    if (onGoToDashboard) onGoToDashboard();
    else router.push("/dashboard");
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col justify-center items-center min-h-screen px-5 py-10">
        <ThemeToggleInline />
        {mounted && hasToken && (
          <button onClick={goToDashboard} className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-brand-green text-white text-xs font-bold shadow-lg hover:opacity-90 transition">
            ورود به داشبورد
          </button>
        )}
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-app-icon.svg" alt="داده کشت نوین" className="w-20 h-20 mx-auto mb-4 object-contain drop-shadow-[0_8px_24px_rgba(34,197,94,0.35)]" />
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-night-text">داده کشت نوین</h1>
          <p className="text-sm text-gray-500 dark:text-night-muted mt-1">هوش مصنوعی در خدمت کشاورزی</p>
        </div>

        <div className="w-full max-w-sm glass dark:bg-night-card/80 dark:border-night-border/60 p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-gray-800 dark:text-night-text mb-1">{isLogin ? "ورود" : "ثبت‌نام"}</h2>
          <p className="text-xs text-gray-500 dark:text-night-muted mb-5">{isLogin ? "برای ورود، شماره خود را وارد کنید" : "برای شروع، اطلاعات خود را وارد کنید"}</p>
          {isLogin && (
            <div className="relative flex mb-4 bg-gray-100 dark:bg-night-surface rounded-full p-1 border border-gray-200 dark:border-night-border">
              {(["password", "otp"] as const).map((tab) => (
                <button key={tab} type="button"
                  onClick={() => { setAuthMethod(tab); setError(""); setFieldErrors({}); setOtpSent(false); setOtpCode(""); }}
                  className={"relative z-10 flex-1 py-2 rounded-full text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 " + (authMethod === tab ? "text-white" : "text-gray-500 dark:text-night-muted")}>
                  {authMethod === tab && (
                    <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-brand-green rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    {tab === "password" ? <Key size={14} /> : <Mail size={14} />}
                    {tab === "password" ? "رمز عبور" : "کد تایید"}
                  </span>
                </button>
              ))}
            </div>
          )}
          <form onSubmit={authMethod === "otp" && isLogin ? (e) => { e.preventDefault(); otpSent ? handleVerifyOtp() : handleSendOtp(); } : handleSubmit}>
            {!isLogin && (
              <>
                <input type="text" placeholder="نام" value={firstName}
                  onChange={e => { setFirstName(e.target.value); setError(""); setFieldErrors(f => ({...f, firstName: ""})); }}
                  className="input-glass mb-2 text-right" />
                <input type="text" placeholder="نام خانوادگی" value={lastName}
                  onChange={e => { setLastName(e.target.value); setError(""); setFieldErrors(f => ({...f, lastName: ""})); }}
                  className="input-glass mb-3 text-right" />
              </>
            )}
            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600 dark:text-night-muted z-10">+98</span>
              <input type="tel" inputMode="numeric" maxLength={10} placeholder="9123456789" value={phone} dir="ltr"
                onChange={e => { setPhone(onlyDigits(e.target.value)); setError(""); setFieldErrors(f => ({...f, phone: ""})); }}
                className="input-glass dark:bg-night-card/60 dark:text-night-text text-center text-lg tracking-widest pl-10" />
            </div>
            {authMethod === "password" && (
              <>
                <input type="password" placeholder="رمز عبور" value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); setPasswordStrength(computeStrength(e.target.value)); setFieldErrors(f => ({...f, password: ""})); }}
                  className="input-glass mb-2" />
                {!isLogin && (
                  <input type="password" placeholder="تکرار رمز عبور" value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                    className="input-glass mb-3" />
                )}
                {isLogin && (
                  <Link href="/forgot-password" className="text-xs text-gray-500 dark:text-night-muted hover:text-primary text-right block mb-3 transition-colors">
                    رمز عبور خود را فراموش کردید؟
                  </Link>
                )}
              </>
            )}
            {authMethod === "otp" && isLogin && (
              <>
                {!otpSent ? (
                  <button type="submit" disabled={loading || !phone} className="btn-primary disabled:opacity-40 w-full flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                    {loading ? "در حال ارسال..." : "ارسال کد تایید"}
                  </button>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 dark:text-night-muted mb-3 text-center">کد ۵ رقمی ارسال شده را وارد کنید</p>
                    <div className="flex justify-center gap-2 mb-4" dir="ltr">
                      {[0,1,2,3,4].map(i => (
                        <input key={i} type="tel" inputMode="numeric" maxLength={1}
                          value={otpCode[i] || ""}
                          onChange={e => {
                            const val = onlyDigits(e.target.value).slice(-1);
                            const newCode = otpCode.substring(0,i) + val + otpCode.substring(i+1);
                            setOtpCode(newCode);
                            if (val && i < 4) focusOtpInput(i+1);
                          }}
                          onKeyDown={e => { if (e.key === "Backspace" && !otpCode[i] && i > 0) focusOtpInput(i-1); }}
                          id={"otp-" + i}
                          className="w-14 h-14 text-center text-xl font-bold rounded-2xl border-2 border-gray-200 dark:border-night-border bg-white dark:bg-night-card focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
                      ))}
                    </div>
                    <button type="submit" disabled={loading || otpCode.length !== 5} className="btn-primary disabled:opacity-40 w-full flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                      {loading ? "در حال ورود..." : "تأیید و ورود"}
                    </button>
                  </>
                )}
              </>
            )}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-3 flex items-start gap-2">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  <button onClick={() => setError("")} className="text-xs text-red-600 dark:text-red-400 underline mt-1">بستن</button>
                </div>
              </div>
            )}
            {authMethod === "password" && (
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-40 w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : isLogin ? <ArrowLeft size={18} /> : <UserPlus size={18} />}
                {loading ? "لطفاً صبر کنید..." : isLogin ? "ورود" : "ثبت‌نام"}
              </button>
            )}
          </form>
          <button onClick={() => { setIsLogin(!isLogin); setError(""); setFieldErrors({}); setOtpSent(false); setOtpCode(""); setAuthMethod("password"); }} className="btn-outline mt-3 w-full">
            {isLogin ? "حساب ندارید؟ ثبت‌نام کنید" : "حساب دارید؟ وارد شوید"}
          </button>
          <p className="text-[10px] text-gray-400 dark:text-night-muted/70 text-center mt-3">با ادامه، <a href="/terms" className="text-brand-green underline">قوانین</a> را می‌پذیرید</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-night-muted/70 text-center mt-8 max-w-xs leading-relaxed">
          با استفاده از فناوری <span className="font-semibold text-gray-700 dark:text-night-text">هوش مصنوعی</span> و{" "}
          <span className="font-semibold text-gray-700 dark:text-night-text">تصاویر ماهواره‌ای</span>، کشاورزی مطمئن داشته باشید.
        </p>
      </div>
    </ThemeProvider>
  );
}
