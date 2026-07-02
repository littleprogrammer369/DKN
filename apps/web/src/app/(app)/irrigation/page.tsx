'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IrrigationPage() {
  const router = useRouter();
  const [hasFarm, setHasFarm] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => setHasFarm(Array.isArray(d) && d.length > 0)).catch(() => setHasFarm(false));
  }, [router]);

  if (hasFarm === null) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted text-sm">⏳</p></div>;

  if (!hasFarm) return (
    <div className="text-center mt-12">
      <div className="text-4xl mb-3">💧</div>
      <p className="text-sm text-gray-500 dark:text-night-muted mb-4">ابتدا یک مزرعه ثبت کنید</p>
      <button onClick={() => router.push('/setup')} className="btn-primary">ساخت مزرعه</button>
    </div>
  );

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-night-muted">مدیریت هوشمند آب</p>
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">توصیه آبیاری</h1>
      </div>
      <div className="card dark:bg-night-card/80 dark:border-night-border/60 mb-4 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💧</span>
          <div>
            <div className="text-sm font-bold text-gray-800 dark:text-night-text">ثبت آبیاری</div>
            <div className="text-xs text-gray-500 dark:text-night-muted">مزرعه فعال شما</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-night-muted mb-3">
          برای دریافت توصیه هوشمند آبیاری، ابتدا اطلاعات مزرعه و وضعیت آب‌وهوا بررسی می‌شود.
        </p>
        <p className="text-xs text-amber-600 text-center bg-amber-50 py-2 rounded-lg">
          ⚠️ این بخش نیاز به اتصال API سرویس هواشناسی دارد
        </p>
      </div>
      <div className="section-title">📋 تاریخچه آبیاری</div>
      <div className="card">
        <p className="text-xs text-gray-400 text-center py-4">هنوز هیچ آبیاری ثبت نشده</p>
      </div>
    </>
  );
}
