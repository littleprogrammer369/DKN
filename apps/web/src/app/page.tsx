'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { onlyDigits } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;
    if (!isLogin && !firstName) return;
    setLoading(true); setError('');
    try {
      const fullPhone = '0' + phone;
      const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body: any = { phone: fullPhone, password };
      if (!isLogin) { body.firstName = firstName; if (email) body.email = email; }
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا');
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(isLogin ? '/dashboard' : '/setup');
    } catch (err: any) { setError(err.message || 'خطا');
    } finally { setLoading(false); }
  };

  return (
    <div className="screen-login active flex flex-col justify-center items-center min-h-screen px-5 py-10">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)', boxShadow: '0 8px 32px rgba(43,182,115,0.25)' }}>
          <span className="text-white text-4xl">🌿</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">داده کشت نوین</h1>
        <p className="text-sm text-gray-500 mt-1">هوش مصنوعی در خدمت کشاورزی</p>
      </div>

      <div className="w-full max-w-sm glass p-6 rounded-3xl">
        <h2 className="text-lg font-bold text-gray-800 mb-1">{isLogin ? 'ورود' : 'ثبت‌نام'}</h2>
        <p className="text-xs text-gray-500 mb-5">{isLogin ? 'برای ورود، شماره و رمز عبور خود را وارد کنید' : 'برای شروع، اطلاعات خود را وارد کنید'}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && <input type="text" placeholder="نام و نام خانوادگی" value={firstName} onChange={e => { setFirstName(e.target.value); setError(''); }} className="input-glass mb-3 text-right" />}

          <div className="relative mb-3">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600 z-10">+98</span>
            <input type="tel" inputMode="numeric" maxLength={10} placeholder="9123456789" value={phone}
              onChange={e => { setPhone(onlyDigits(e.target.value)); setError(''); }}
              className="input-glass text-center text-lg tracking-widest pr-10" />
          </div>

          {!isLogin && <input type="email" inputMode="email" placeholder="ایمیل (اختیاری)" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} className="input-glass mb-3" />}

          <input type="password" placeholder="رمز عبور" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} className="input-glass mb-5" />

          {error && <div className="text-xs text-red-500 text-center mb-3 bg-red-50 py-2 rounded-lg">{error}</div>}

          <button type="submit" disabled={loading || !phone || !password || (!isLogin && !firstName)} className="btn-primary disabled:opacity-40">
            {loading ? '⏳ لطفاً صبر کنید...' : (isLogin ? 'ورود' : 'ثبت‌نام')}
          </button>
        </form>

        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="btn-outline mt-3">
          {isLogin ? 'حساب ندارید؟ ثبت‌نام کنید' : 'حساب دارید؟ وارد شوید'}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-3">با ادامه، <a href="#" className="text-brand-green underline">قوانین</a> را می‌پذیرید</p>
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-8 max-w-xs leading-relaxed">
        با ثبت‌نام، از <a href="#" className="text-brand-green">شرایط استفاده</a> و{' '}
        <a href="#" className="text-brand-green">حریم خصوصی</a> مطلع شده‌اید.
      </p>
    </div>
  );
}
