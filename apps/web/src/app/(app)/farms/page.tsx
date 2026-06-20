'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const farmsData = [
  { id: '1', name: 'مزرعه گندم شماره ۱', product: 'گندم', area: '۳.۲ هکتار', location: 'ساوه', health: 85, status: 'سالم' },
  { id: '2', name: 'مزرعه گندم شماره ۲', product: 'گندم', area: '۱.۸ هکتار', location: 'ساوه', health: 72, status: 'نیاز توجه' },
];

export default function FarmsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">مدیریت زمین‌ها</p>
          <h1 className="text-lg font-extrabold text-gray-800">زمین‌های من</h1>
        </div>
        <button className="btn-primary !w-auto !py-2 !px-4 !text-xs">
          + زمین جدید
        </button>
      </div>

      {/* Tabs */}
      <div className="glass-deep p-1 flex mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'all' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-500'
          }`}
        >
          همه ({farmsData.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'active' ? 'bg-white shadow-sm text-brand-green' : 'text-gray-500'
          }`}
        >
          فعال ({farmsData.filter(f => f.health > 70).length})
        </button>
      </div>

      {/* Farm List */}
      {farmsData.map((farm) => (
        <div
          key={farm.id}
          className="card cursor-pointer hover:shadow-lg transition-all"
          onClick={() => router.push(`/farms/${farm.id}`)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌾</span>
              <div>
                <div className="text-sm font-bold text-gray-800">{farm.name}</div>
                <div className="text-[10px] text-gray-400">{farm.location} · {farm.area}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-bold ${
                farm.health > 80 ? 'text-green-600' : 'text-amber-600'
              }`}>
                {farm.health}%
              </div>
              <span className={`badge ${
                farm.health > 80 ? 'badge-success' : 'badge-warn'
              }`}>
                {farm.status}
              </span>
            </div>
          </div>
          <div className="prog-bg">
            <div className={`prog-fill ${
              farm.health > 80
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : 'bg-gradient-to-r from-amber-400 to-amber-500'
            }`} style={{ width: `${farm.health}%` }} />
          </div>
        </div>
      ))}
    </>
  );
}
