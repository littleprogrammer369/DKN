'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleSendOtp = () => {
    if (phone.length === 11) setStep('otp');
  };

  const handleVerify = () => {
    router.push('/dashboard');
  };

  return (
    <div className="screen-login active flex flex-col justify-center items-center min-h-screen px-5 py-10">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
             style={{ background: 'linear-gradient(135deg, #2BB673, #22C55E)',
                      boxShadow: '0 8px 32px rgba(43,182,115,0.25)' }}>
          <span className="text-white">🌿</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">داده کشت نوین</h1>
        <p className="text-sm text-gray-500 mt-1">هوش مصنوعی در خدمت کشاورزی</p>
      </div>

      {step === 'phone' ? (
        <div className="w-full max-w-sm glass p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-gray-800 mb-1">ورود | ثبت‌نام</h2>
          <p className="text-xs text-gray-500 mb-5">برای شروع، شماره موبایل خود را وارد کنید</p>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-bold text-gray-600">+98</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="۹۱۲۳۴۵۶۷۸۹"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-glass flex-1 text-center text-lg tracking-widest"
            />
          </div>
          <button
            onClick={handleSendOtp}
            disabled={phone.length !== 10}
            className="btn-primary disabled:opacity-40"
          >
            ارسال کد تأیید
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-3">
            با ادامه، <a href="#" className="text-brand-green underline">قوانین</a> را می‌پذیرید
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm glass p-6 rounded-3xl">
          <h2 className="text-lg font-bold text-gray-800 mb-1">کد تأیید</h2>
          <p className="text-xs text-gray-500 mb-5">کد ۴ رقمی ارسال شده به {phone} را وارد کنید</p>
          <div className="flex justify-between gap-3 mb-5" dir="ltr">
            {otp.map((d, i) => (
              <input
                key={i}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => {
                  const newOtp = [...otp];
                  newOtp[i] = e.target.value.slice(-1);
                  setOtp(newOtp);
                  if (e.target.value && i < 3)
                    document.getElementById(`otp-${i + 1}`)?.focus();
                }}
                id={`otp-${i}`}
                className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200
                           focus:border-brand-green outline-none transition-all"
              />
            ))}
          </div>
          <button onClick={handleVerify} className="btn-primary">
            تأیید
          </button>
          <button
            onClick={() => setStep('phone')}
            className="btn-outline mt-3"
          >
            ویرایش شماره
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="text-[10px] text-gray-400 text-center mt-8 max-w-xs leading-relaxed">
        با ثبت‌نام، از <a href="#" className="text-brand-green">شرایط استفاده</a> و{' '}
        <a href="#" className="text-brand-green">حریم خصوصی</a> مطلع شده‌اید.
      </p>
    </div>
  );
}
