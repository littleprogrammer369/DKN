'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sprout, Sun, CloudRain, Wind, Droplets, Thermometer,
  Cloud, Bug, Sparkles, AlertTriangle, AlertCircle,
  ArrowLeft,
} from 'lucide-react';

/* ── Persian day names ── */
const DAY_NAMES_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

function getPersianDayName(dateStr: string): string {
  const d = new Date(dateStr);
  return DAY_NAMES_FA[d.getDay()] ?? '';
}

/* ── Forecast icon helper ── */
function ForecastIcon({ precip, tempMax }: { precip?: number | null; tempMax?: number }) {
  const cls = 'w-5 h-5 flex-shrink-0';
  if (precip != null && precip > 50) return <CloudRain className={cls + ' text-blue-400'} />;
  if (precip != null && precip > 20) return <Cloud className={cls + ' text-blue-300'} />;
  if (tempMax != null && tempMax > 32) return <Sun className={cls + ' text-amber-400'} />;
  return <Cloud className={cls + ' text-text-tertiary dark:text-white/60'} />;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    Promise.all([
      fetch('/api/v1/auth/profile', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
    ]).then(async ([u, f]) => {
      if (u.firstName) { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }
      const fl = Array.isArray(f) ? f : [];
      setFarms(fl);
      if (fl.length > 0) {
        try {
          const res = await fetch('/api/v1/weather/' + fl[0].id + '/dashboard?city=' + encodeURIComponent(fl[0].city || 'Saveh'), {
            headers: { Authorization: 'Bearer ' + token }
          });
          if (res.ok) setWeather(await res.json());
        } catch {}
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  /* ── P2-D11: Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-night-surface" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-200 dark:bg-night-surface rounded" />
            <div className="h-5 w-32 bg-gray-200 dark:bg-night-surface rounded" />
          </div>
        </div>
        <div className="card shadow-glow">
          <div className="h-4 w-20 bg-gray-200 dark:bg-night-surface rounded mb-3" />
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-green-50/50 dark:bg-night-surface rounded-xl py-3 flex flex-col items-center gap-2">
                <div className="h-6 w-10 bg-gray-200 dark:bg-night-border rounded" />
                <div className="h-2 w-8 bg-gray-200 dark:bg-night-border rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="card shadow-glow">
          <div className="h-4 w-28 bg-gray-200 dark:bg-night-surface rounded mb-3" />
          <div className="flex gap-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex-1 min-w-[55px] bg-green-50/30 dark:bg-night-surface/30 rounded-xl py-3 flex flex-col items-center gap-2">
                <div className="h-2 w-10 bg-gray-200 dark:bg-night-border rounded" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-night-border rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card shadow-glow flex flex-col items-center gap-2 py-5">
              <div className="h-8 w-8 bg-gray-200 dark:bg-night-surface rounded-lg" />
              <div className="h-3 w-14 bg-gray-200 dark:bg-night-surface rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── P2-D10: Empty state for no farms ── */
  if (farms.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Sprout className="text-green-600 dark:text-green-400" size={40} />
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          هنوز مزرعه‌ای نداری!
        </h1>
        <p className="text-sm text-gray-500 dark:text-white/70 mb-6">
          برای شروع، اولین مزرعه‌ات رو بساز
        </p>
        <Link
          href="/setup"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl font-medium hover:bg-brand-green/90 shadow-glow transition-all"
        >
          <Sprout size={20} />
          ساخت اولین مزرعه
        </Link>
      </div>
    );
  }

  const farm = farms[0];
  const loc = [farm.city, farm.province].filter(Boolean).join(' - ') || 'نامشخص';
  const w = weather?.current;
  const forecast = weather?.forecast || [];
  const daysSince = weather?.lastIrrigation ? Math.floor((Date.now() - new Date(weather.lastIrrigation.date).getTime()) / 86400000) : null;

  /* ── Alerts ── */
  const alerts = [];
  if (w?.temperature > 35) alerts.push({ type: 'warning', text: 'دما بالاست - عصر آبیاری کن' });
  if (w?.humidity > 60) alerts.push({ type: 'warning', text: 'رطوبت بالا - خطر قارچ' });
  if (daysSince !== null && daysSince > 5) alerts.push({ type: 'danger', text: daysSince + ' روز از آخرین آبیاری گذشته!' });

  const userName = user?.firstName || 'کشاورز عزیز';

  return (
    <div className="animate-fade-in">
      {/* ── P0-D3: Persian Welcome with user.firstName ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-white/70">خوش آمدی 👋</p>
          <h1 className="text-lg font-extrabold text-gray-800 dark:text-white">{userName}</h1>
        </div>
      </div>

      {/* ── Farm card ── */}
      <div onClick={() => router.push('/farms')} className="card cursor-pointer mb-4 shadow-glow hover:shadow-glow-lg transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <Sprout className="text-brand-green" size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-800 dark:text-white truncate">{farm.name}</div>
            <div className="text-[10px] text-gray-400 dark:text-white/65">{loc}{farm.areaHa ? ' - ' + farm.areaHa + ' هکتار' : ''}</div>
          </div>
        </div>
      </div>

      {/* ── P1-D5: Weather card — bigger with large icon ── */}
      {w && (
        <div className="card mb-4 shadow-glow hover:shadow-glow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sun className="text-amber-400" size={28} />
              <h3 className="text-sm font-medium text-gray-600 dark:text-white/80">آب و هوا</h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50/50 dark:bg-night-surface rounded-xl py-3">
              <Thermometer className="w-5 h-5 mx-auto mb-1 text-brand-green" />
              <div className="text-xl font-extrabold text-brand-green">{w.temperature ?? '--'}°</div>
              <div className="text-[10px] text-gray-500 dark:text-white/70 mt-0.5">دما</div>
            </div>
            <div className="bg-green-50/50 dark:bg-night-surface rounded-xl py-3">
              <Droplets className="w-5 h-5 mx-auto mb-1 text-brand-green" />
              <div className="text-xl font-extrabold text-brand-green">{w.humidity ?? '--'}%</div>
              <div className="text-[10px] text-gray-500 dark:text-white/70 mt-0.5">رطوبت</div>
            </div>
            <div className="bg-green-50/50 dark:bg-night-surface rounded-xl py-3">
              <Wind className="w-5 h-5 mx-auto mb-1 text-brand-green" />
              <div className="text-xl font-extrabold text-brand-green">{w.windSpeed ?? '--'}</div>
              <div className="text-[10px] text-gray-500 dark:text-white/70 mt-0.5">باد</div>
            </div>
          </div>
          {daysSince !== null && (
            <div className="text-[11px] text-gray-400 dark:text-white/60 mt-3 text-center">
              آخرین آبیاری: {daysSince} روز پیش
            </div>
          )}
        </div>
      )}

      {/* ── P1-D6: Forecast — horizontal scroll with icons ── */}
      {forecast.length > 0 && (
        <div className="card mb-4 shadow-glow hover:shadow-glow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="text-blue-400" size={20} />
            <h3 className="text-sm font-medium text-gray-600 dark:text-white/80">پیش‌بینی ۵ روز آینده</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {forecast.slice(0, 5).map((d: any, i: number) => (
              <div key={i} className="flex-1 text-center bg-green-50/30 dark:bg-night-surface/30 rounded-xl py-3 min-w-[60px] flex flex-col items-center gap-1">
                <ForecastIcon precip={d.dayPrecipitation} tempMax={d.tempMax} />
                <div className="text-[10px] text-gray-500 dark:text-white/65">
                  {getPersianDayName(d.date)}
                </div>
                <div className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">
                  {d.tempMax ? Math.round(d.tempMax) : '--'}°
                </div>
                {d.dayPrecipitation != null && (
                  <div className="text-[9px] text-blue-400 dark:text-blue-300">
                    بارش {d.dayPrecipitation}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Alerts & Recommendations ── */}
      {alerts.length > 0 && (
        <div className="card mb-4 shadow-glow hover:shadow-glow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-amber-500" size={18} />
            <h3 className="text-sm font-medium text-gray-600 dark:text-white/80">هشدارها و توصیه‌ها</h3>
          </div>
          {alerts.map((a, i) => (
            <div
              key={i}
              className={
                'text-xs rounded-lg px-3 py-2 mb-1 flex items-center gap-1.5 ' +
                (a.type === 'danger'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300')
              }
            >
              {a.type === 'danger' ? <AlertCircle size={14} /> : <AlertTriangle size={14} />}
              {a.text}
            </div>
          ))}
          <button
            onClick={() => router.push('/ai')}
            className="flex items-center gap-1 text-xs text-brand-green hover:text-brand-green/80 underline mt-2 transition-colors"
          >
            <Sparkles size={13} />
            از AI مشورت بگیر
          </button>
        </div>
      )}

      {/* ── P1-D7: Quick actions with lucide icons ── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          onClick={() => router.push('/irrigation')}
          className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all"
        >
          <Droplets className="w-8 h-8 mx-auto mb-1 text-brand-green" />
          <div className="text-xs font-bold text-gray-700 dark:text-white/80">آبیاری</div>
        </div>
        <div
          onClick={() => router.push('/pests')}
          className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all"
        >
          <Bug className="w-8 h-8 mx-auto mb-1 text-brand-green" />
          <div className="text-xs font-bold text-gray-700 dark:text-white/80">آفات</div>
        </div>
        <div
          onClick={() => router.push('/farms')}
          className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all"
        >
          <Sprout className="w-8 h-8 mx-auto mb-1 text-brand-green" />
          <div className="text-xs font-bold text-gray-700 dark:text-white/80">مزارع</div>
        </div>
        <div
          onClick={() => router.push('/ai')}
          className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-1 text-brand-green" />
          <div className="text-xs font-bold text-gray-700 dark:text-white/80">دستیار AI</div>
        </div>
      </div>
    </div>
  );
}
