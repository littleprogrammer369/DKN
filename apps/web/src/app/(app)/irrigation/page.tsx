'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IrrigationPage() {
  const router = useRouter();
  const [farms, setFarms] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(async (allFarms) => {
        const farmList = Array.isArray(allFarms) ? allFarms : [];
        setFarms(farmList);
        if (farmList.length > 0) {
          const mainFarm = farmList[0];
          try {
            const res = await fetch(`/api/v1/weather/${mainFarm.id}/dashboard?city=${encodeURIComponent(mainFarm.city || 'ساوه')}`, {
              headers: { Authorization: 'Bearer ' + token }
            });
            if (res.ok) { const data = await res.json(); setDashboardData(data); }
          } catch {}
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted text-sm">⏳</p></div>;

  if (farms.length === 0) return (
    <div className="text-center mt-12">
      <div className="text-4xl mb-3">💧</div>
      <p className="text-sm text-gray-500 dark:text-night-muted mb-4">ابتدا یک مزرعه ثبت کنید</p>
      <button onClick={() => router.push('/setup')} className="btn-primary">ساخت مزرعه</button>
    </div>
  );

  const farm = farms[0];
  const weather = dashboardData?.current;
  const forecast = dashboardData?.forecast || [];
  const lastIrrigation = dashboardData?.lastIrrigation;

  const irrigationCycleDays = 7;
  const daysSinceLastIrr = lastIrrigation
    ? Math.floor((Date.now() - new Date(lastIrrigation.date).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const daysUntilNextIrr = daysSinceLastIrr !== null ? Math.max(0, irrigationCycleDays - daysSinceLastIrr) : null;
  const progressPct = daysSinceLastIrr !== null ? Math.min(100, Math.round((daysSinceLastIrr / irrigationCycleDays) * 100)) : 0;

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-night-muted">مدیریت هوشمند آب</p>
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">توصیه آبیاری</h1>
      </div>

      <div className="card dark:bg-night-card/80 dark:border-night-border/60 mb-4 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">💧</span>
          <div>
            <div className="text-sm font-bold text-gray-800 dark:text-night-text">{farm.name}</div>
            <div className="text-xs text-gray-500 dark:text-night-muted">
              {[farm.city, farm.province].filter(Boolean).join('، ') || 'موقعیت ثبت نشده'}
            </div>
          </div>
        </div>

        {daysSinceLastIrr !== null && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-night-muted mb-1">
              <span>آخرین آبیاری: {daysSinceLastIrr} روز پیش</span>
              {daysUntilNextIrr !== null && <span>{daysUntilNextIrr} روز مانده</span>}
            </div>
            <div className="prog-bg dark:bg-white/10">
              <div className="prog-fill" style={{
                width: `${progressPct}%`,
                background: progressPct > 80 ? 'linear-gradient(90deg, #22C55E, #eab308)' :
                            progressPct > 50 ? 'linear-gradient(90deg, #22C55E, #2BB673)' : '#22C55E'
              }} />
            </div>
          </div>
        )}

        {weather && (
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-green-50 dark:bg-night-surface rounded-xl p-2">
              <div className="text-lg font-extrabold text-brand-green">{weather.temperature ?? '--'}</div>
              <div className="text-[10px] text-gray-500 dark:text-night-muted">🌡️ دما</div>
            </div>
            <div className="bg-green-50 dark:bg-night-surface rounded-xl p-2">
              <div className="text-lg font-extrabold text-brand-green">{weather.humidity ?? '--'}</div>
              <div className="text-[10px] text-gray-500 dark:text-night-muted">💧 رطوبت</div>
            </div>
            <div className="bg-green-50 dark:bg-night-surface rounded-xl p-2">
              <div className="text-lg font-extrabold text-brand-green">{weather.windSpeed ?? '--'}</div>
              <div className="text-[10px] text-gray-500 dark:text-night-muted">🌬️ باد</div>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-bold text-gray-600 dark:text-night-muted mb-2">📅 پیش‌بینی ۵ روزه</div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {forecast.slice(0, 5).map((d: any, i: number) => (
                <div key={i} className="flex-1 text-center bg-white/40 dark:bg-night-surface/40 rounded-lg p-1.5 min-w-[55px]">
                  <div className="text-[10px] text-gray-500 dark:text-night-muted">
                    {new Date(d.date).toLocaleDateString('fa-IR', { weekday: 'short' })}
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-night-text mt-0.5">
                    {d.tempMax ? Math.round(d.tempMax) : '--'}°
                  </div>
                  <div className="text-[9px] text-gray-400 dark:text-night-muted">{d.tempMin ? Math.round(d.tempMin) : '--'}°</div>
                  {d.dayPrecipitation != null && <div className="text-[9px] text-blue-500 dark:text-blue-400 mt-0.5">🌧️ {d.dayPrecipitation}%</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!weather && (
          <p className="text-xs text-amber-600 dark:text-amber-400 text-center bg-amber-50 dark:bg-amber-900/20 py-2 rounded-lg mt-2">
            ⚠️ داده هواشناسی فعال نیست. 
            <button onClick={() => {/* show API key modal */}} className="underline mr-1 font-bold">تنظیم API Key</button>
          </p>
        )}
      </div>

      {/* Add Irrigation Button */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => {/* open add irrigation modal */}} className="btn-primary flex-1 !text-xs">
          ➕ ثبت آبیاری جدید
        </button>
        <button onClick={() => router.push('/ai?q=irrigation')} className="btn-outline flex-1 !text-xs">
          🤖 از AI بپرس
        </button>
      </div>

      <div className="section-title dark:text-night-text/80">📋 تاریخچه آبیاری</div>
      <div className="card dark:bg-night-card/80 dark:border-night-border/60 transition-colors duration-300">
        {lastIrrigation ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-800 dark:text-night-text">
                {new Date(lastIrrigation.date).toLocaleDateString('fa-IR')}
              </div>
              <div className="text-xs text-gray-500 dark:text-night-muted">
                {lastIrrigation.amount} لیتر • {lastIrrigation.duration} دقیقه
              </div>
            </div>
            <span className="badge badge-success">ثبت شده</span>
          </div>
        ) : (
          <p className="text-xs text-gray-400 dark:text-night-muted text-center py-4">هنوز هیچ آبیاری ثبت نشده</p>
        )}
      </div>

      <button onClick={() => router.push('/ai')} className="btn-outline mt-3 !text-xs">
        🤖 از AI درباره زمان آبیاری بپرس
      </button>
    </>
  );
}
