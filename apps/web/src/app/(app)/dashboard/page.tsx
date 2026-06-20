'use client';

import { useState } from 'react';
import HealthGauge from '@/components/HealthGauge';
import WeatherCard from '@/components/WeatherCard';

export default function DashboardPage() {
  const [activeFarm] = useState('مزرعه گندم شماره ۱');

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">خوش آمدی 👋</p>
          <h1 className="text-lg font-extrabold text-gray-800">رضا کشاورز</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg cursor-pointer">
            🔔
          </button>
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg cursor-pointer">
            👤
          </button>
        </div>
      </div>

      {/* Active Farm */}
      <div className="glass-deep px-4 py-3 mb-4 flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌾</span>
          <div>
            <div className="text-sm font-bold text-gray-800">{activeFarm}</div>
            <div className="text-[10px] text-gray-400">ساوه، استان مرکزی</div>
          </div>
        </div>
        <span className="text-gray-400 text-sm">❮</span>
      </div>

      {/* Health Score */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-gray-700">🟢 امتیاز سلامت</div>
          <span className="text-[10px] text-gray-400">بروزرسانی: ۲ ساعت پیش</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg width="96" height="96" viewBox="0 0 96 96" className="absolute">
              <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
              <circle cx="48" cy="48" r="42" fill="none" stroke="#22C55E" strokeWidth="8"
                      strokeDasharray="198 264" strokeLinecap="round"
                      transform="rotate(-90, 48, 48)" />
            </svg>
            <span className="text-2xl font-extrabold text-green-600">۸۵</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">NDVI</span>
              <span className="text-xs font-bold text-green-600">۰.۸۲</span>
            </div>
            <div className="prog-bg">
              <div className="prog-fill bg-gradient-to-r from-green-400 to-green-500" style={{ width: '82%' }} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">رطوبت خاک</span>
              <span className="text-xs font-bold text-amber-600">۶۵%</span>
            </div>
            <div className="prog-bg">
              <div className="prog-fill bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Weather */}
      <WeatherCard temp={31} humidity={42} condition="آفتابی" icon="☀️" />

      {/* Quick Actions */}
      <div className="section-title">دسترسی سریع</div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card text-center cursor-pointer hover:shadow-lg transition-all">
          <div className="text-2xl mb-1">💧</div>
          <div className="text-xs font-bold text-gray-700">توصیه آبیاری</div>
          <div className="text-[10px] text-green-600">امشب ۲۱:۰۰</div>
        </div>
        <div className="card text-center cursor-pointer hover:shadow-lg transition-all">
          <div className="text-2xl mb-1">🛰️</div>
          <div className="text-xs font-bold text-gray-700">تصویر ماهواره</div>
          <div className="text-[10px] text-gray-500">۳ روز پیش</div>
        </div>
        <div className="card text-center cursor-pointer hover:shadow-lg transition-all">
          <div className="text-2xl mb-1">🧬</div>
          <div className="text-xs font-bold text-gray-700">پیش‌بینی آفات</div>
          <div className="text-[10px] text-amber-600">۲ تهدید فعال</div>
        </div>
        <div className="card text-center cursor-pointer hover:shadow-lg transition-all">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xs font-bold text-gray-700">برداشت</div>
          <div className="text-[10px] text-gray-500">۳۵ روز دیگر</div>
        </div>
      </div>

      {/* NDVI Chart placeholder */}
      <div className="section-title">📊 روند NDVI</div>
      <div className="card h-32 flex items-center justify-center">
        <p className="text-xs text-gray-400">نمودار روند NDVI — در حال توسعه</p>
      </div>
    </>
  );
}
