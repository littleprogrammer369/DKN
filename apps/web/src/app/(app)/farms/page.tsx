'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Farm { id: string; name: string; city?: string; province?: string; areaHa?: number; product?: string; isActive: boolean }

export default function FarmsPage() {
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => { setFarms(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex justify-center py-10"><p className="text-gray-400 text-sm">⏳</p></div>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">مدیریت زمین‌ها</p>
          <h1 className="text-lg font-extrabold text-gray-800">زمین‌های من</h1>
        </div>
        <button onClick={() => router.push('/setup')} className="btn-primary !w-auto !py-2 !px-4 !text-xs">
          + زمین جدید
        </button>
      </div>

      {farms.length === 0 ? (
        <div className="text-center mt-12">
          <div className="text-4xl mb-3">🏞️</div>
          <p className="text-sm text-gray-500 mb-4">هنوز هیچ زمینی ثبت نکردی</p>
          <button onClick={() => router.push('/setup')} className="btn-primary">+ ساخت اولین زمین</button>
        </div>
      ) : (
        farms.map(farm => {
          const location = [farm.city, farm.province].filter(Boolean).join('، ');
          const areaStr = farm.areaHa ? farm.areaHa + ' هکتار' : '';
          const subtitle = [location, areaStr].filter(Boolean).join(' · ');
          return (
            <div key={farm.id} onClick={() => router.push('/farms/' + farm.id)}
              className="card cursor-pointer hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌾</span>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{farm.name}</div>
                    {subtitle && <div className="text-[10px] text-gray-400">{subtitle}</div>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-success text-xs">{farm.product || 'گندم'}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
