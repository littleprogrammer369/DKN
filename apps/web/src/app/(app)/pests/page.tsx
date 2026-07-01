'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PestsPage() {
  const router = useRouter();
  const [hasFarm, setHasFarm] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => setHasFarm(Array.isArray(d) && d.length > 0)).catch(() => setHasFarm(false));
  }, [router]);

  if (hasFarm === null) return <div className="flex justify-center py-10"><p className="text-gray-400 text-sm">⏳</p></div>;

  if (!hasFarm) return (
    <div className="text-center mt-12">
      <div className="text-4xl mb-3">🧬</div>
      <p className="text-sm text-gray-500 mb-4">ابتدا یک مزرعه ثبت کنید</p>
      <button onClick={() => router.push('/setup')} className="btn-primary">ساخت مزرعه</button>
    </div>
  );

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-500">مرکز پایش ریسک</p>
        <h1 className="text-lg font-extrabold text-gray-800">آفات و بیماری‌ها</h1>
      </div>
      <div className="card mb-4">
        <div className="text-sm font-bold text-gray-700 mb-3">🔍 وضعیت فعلی</div>
        <p className="text-xs text-gray-500">
          پایش آفات و بیماری‌ها بر اساس داده‌های محیطی و گزارش‌های ثبت‌شده انجام می‌شود.
        </p>
      </div>
      <div className="section-title">📝 گزارش‌های من</div>
      <div className="card">
        <p className="text-xs text-gray-400 text-center py-4">هنوز هیچ گزارشی ثبت نشده</p>
      </div>
      <button onClick={() => router.push('/ai')} className="btn-outline mt-3 !text-xs">
        🤖 از AI درباره آفات بپرس
      </button>
    </>
  );
}
