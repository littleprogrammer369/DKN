'use client';

import { useState } from 'react';

export default function IrrigationPage() {
  const [applied, setApplied] = useState(false);

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-500">مدیریت هوشمند آب</p>
        <h1 className="text-lg font-extrabold text-gray-800">توصیه آبیاری</h1>
      </div>

      {/* Main Recommendation */}
      <div className="card mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500" />
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💧</span>
          <div>
            <div className="text-sm font-bold text-gray-800">آبیاری قطره‌ای</div>
            <div className="text-xs text-gray-500">توصیه شده برای امشب</div>
          </div>
          <span className="mr-auto badge badge-success">۹۲٪ اطمینان</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-extrabold text-blue-600">۲۱:۰۰</div>
            <div className="text-[10px] text-gray-500">زمان</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-extrabold text-blue-600">۴۵</div>
            <div className="text-[10px] text-gray-500">مدت (دقیقه)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-extrabold text-blue-600">۴.۵</div>
            <div className="text-[10px] text-gray-500">میزان (L/m²)</div>
          </div>
        </div>
        {!applied ? (
          <button
            onClick={() => setApplied(true)}
            className="btn-primary"
          >
            ✅ انجام شد
          </button>
        ) : (
          <div className="text-center py-3 text-sm text-green-600 font-bold bg-green-50 rounded-xl">
            ✓ آبیاری ثبت شد
          </div>
        )}
      </div>

      {/* Water Saving */}
      <div className="glass-deep px-4 py-3 mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">صرفه‌جویی water</div>
          <div className="text-lg font-extrabold text-blue-600">۱,۲۴۰ L</div>
        </div>
        <span className="text-sm text-green-600 font-bold">+۱۲٪</span>
      </div>

      {/* Schedule */}
      <div className="section-title">📅 برنامه آبیاری هفتگی</div>
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-700">شنبه</span>
          <span className="text-xs text-green-600">✓ انجام شد</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-700">دوشنبه</span>
          <span className="text-xs text-green-600">✓ انجام شد</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">چهارشنبه</span>
          <span className="text-xs text-blue-600 font-bold">امشب ۲۱:۰۰</span>
        </div>
      </div>
    </>
  );
}
