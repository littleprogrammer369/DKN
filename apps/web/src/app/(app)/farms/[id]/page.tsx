'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HealthGauge from '@/components/HealthGauge';

export default function FarmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map load
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-600 mb-3">
        <span>❮</span> بازگشت
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🌾</span>
        <div>
          <h1 className="text-lg font-extrabold text-gray-800">مزرعه گندم شماره ۱</h1>
          <p className="text-xs text-gray-400">ساوه، استان مرکزی · ۳.۲ هکتار</p>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="card h-44 mb-4 relative overflow-hidden">
        {mapLoaded ? (
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl block mb-1">🗺️</span>
              <p className="text-xs text-gray-500">نقشه مزرعه — در حال توسعه</p>
              <p className="text-[10px] text-gray-400 mt-1">مساحت: ۳.۲ هکتار</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="dot" />
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card text-center !mb-0">
          <div className="text-xs text-gray-500">محصول</div>
          <div className="text-sm font-bold text-gray-800 mt-1">گندم</div>
        </div>
        <div className="card text-center !mb-0">
          <div className="text-xs text-gray-500">تاریخ کشت</div>
          <div className="text-sm font-bold text-gray-800 mt-1">۱۵ آبان</div>
        </div>
        <div className="card text-center !mb-0">
          <div className="text-xs text-gray-500">نوع آبیاری</div>
          <div className="text-sm font-bold text-gray-800 mt-1">قطره‌ای</div>
        </div>
        <div className="card text-center !mb-0">
          <div className="text-xs text-gray-500">منبع آب</div>
          <div className="text-sm font-bold text-gray-800 mt-1">چاه</div>
        </div>
      </div>

      {/* Health Gauges */}
      <div className="section-title">📊 سلامت مزرعه</div>
      <div className="card">
        <div className="flex justify-around">
          <HealthGauge value={82} label="NDVI" status="عالی" color="#22C55E" />
          <HealthGauge value={65} label="رطوبت خاک" status="نیاز آب" color="#F59E0B" />
          <HealthGauge value={91} label="دما" status="مناسب" color="#22C55E" />
        </div>
      </div>
    </>
  );
}
