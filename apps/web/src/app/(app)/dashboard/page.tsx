'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sprout, Sun, CloudRain, Wind, Droplets, Thermometer,
  Cloud, Bug, Sparkles, AlertTriangle, AlertCircle,
  User, RefreshCw, Satellite
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { getAuthToken, isSessionValid, clearSession } from '@/lib/session';
import { TempHumidityChart, PrecipBarChart } from '@/components/WeatherChart';
import SatelliteCard from '@/components/SatelliteCard';
import MonthWeatherWidget from '@/components/MonthWeather';

const DAY_NAMES_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

function getPersianDayName(dateStr: string): string {
  const d = new Date(dateStr);
  return DAY_NAMES_FA[d.getDay()] ?? '';
}

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
  const [weatherHistory, setWeatherHistory] = useState<any[]>([]);
  const [satellite, setSatellite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    if (!isSessionValid()) {
      clearSession();
      router.push('/');
      return;
    }
    const token = getAuthToken();

    Promise.all([
      fetch('/api/v1/auth/profile', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
    ]).then(async ([u, f]) => {
      if (u.firstName) { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }
      const fl = Array.isArray(f) ? f : [];
      setFarms(fl);

      if (fl.length > 0) {
        const farm = fl[0];
        const city = farm.city || 'ساوه';

        try {
          // Weather dashboard (current + 5-day forecast)
          const wRes = await fetch('/api/v1/weather/' + farm.id + '/dashboard?city=' + encodeURIComponent(city), {
            headers: { Authorization: 'Bearer ' + token }
          });
          if (wRes.ok) setWeather(await wRes.json());
        } catch {}

        try {
          // Weather history (for 30-day widget & charts)
          const hRes = await fetch('/api/v1/weather/' + farm.id + '/history?days=30', {
            headers: { Authorization: 'Bearer ' + token }
          });
          if (hRes.ok) setWeatherHistory(await hRes.json());
        } catch {}

        try {
          // Satellite data
          const sRes = await fetch('/api/v1/satellite/' + farm.id, {
            headers: { Authorization: 'Bearer ' + token }
          });
          if (sRes.ok) setSatellite(await sRes.json());
        } catch {}
      }

      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  // Toast welcome on first load
  useEffect(() => {
    if (!loading && user?.firstName) {
      toast.success('خوش آمدید ' + user.firstName);
    }
  }, [loading]);

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
        <div className="card shadow-glow"><div className="h-4 w-20 bg-gray-200 dark:bg-night-surface rounded mb-3" /></div>
        <div className="card shadow-glow h-40 bg-gray-200 dark:bg-night-surface rounded" />
        <div className="card shadow-glow h-40 bg-gray-200 dark:bg-night-surface rounded" />
      </div>
    );
  }

  const farm = farms[0];
  const w = weather?.current;
  const forecast = weather?.forecast || [];
  const alerts: { type: 'danger' | 'warning'; text: string }[] = [];

  if (w?.temperature != null) {
    if (w.temperature > 38) alerts.push({ type: 'danger', text: 'دمای هوا بسیار بالا! خطر تنش گرمایی برای محصولات.' });
    else if (w.temperature > 35) alerts.push({ type: 'warning', text: 'دمای بالا — در صورت امکان آبیاری را افزایش دهید.' });
    if (w.humidity != null && w.humidity > 70) alerts.push({ type: 'warning', text: 'رطوبت بالا — خطر بیماری‌های قارچی افزایش یافته.' });
    if (w.humidity != null && w.humidity < 20) alerts.push({ type: 'warning', text: 'رطوبت بسیار کم — احتمال تنش خشکی.' });
  }

  const chartData = (forecast.length > 0 ? forecast : weatherHistory.slice(0, 7)).map((d: any) => ({
    label: d.date ? getPersianDayName(d.date).slice(0, 2) : '--',
    temp: d.tempMax ? Math.round(d.tempMax) : undefined,
    humidity: d.humidity ?? (d.dayPrecipitation ? 100 - d.dayPrecipitation : undefined),
    precipitation: d.dayPrecipitation ?? null,
  }));

  return (
    <div>
      {/* Refresh button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {user && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold shadow-glow">
              {user.firstName?.[0] || 'ک'}
            </div>
          )}
          <div>
            <p className="text-[10px] text-gray-500 dark:text-night-muted">خوش آمدی</p>
            <p className="text-sm font-bold text-gray-800 dark:text-night-text">{user?.firstName || 'کاربر'} عزیز</p>
          </div>
        </div>
        <button onClick={loadData} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-night-surface flex items-center justify-center hover:bg-gray-200 dark:hover:bg-night-border transition-colors">
          <RefreshCw size={16} className="text-gray-500" />
        </button>
      </div>

      {farm && (
        <div className="text-[10px] text-gray-500 dark:text-night-muted mb-3 flex items-center gap-2">
          <Sprout size={12} className="text-brand-green" />
          مزرعه: {farm.name} — {farm.city || 'ساوه'}
          {farm.areaHa ? ` — ${farm.areaHa} هکتار` : ''}
        </div>
      )}

      {/* Current Weather */}
      {w && (
        <div className="card shadow-glow mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-night-muted mb-0.5">وضعیت فعلی</p>
              <p className="text-3xl font-extrabold text-gray-800 dark:text-night-text">{Math.round(w.temperature)}°</p>
              <p className="text-xs text-gray-500 dark:text-night-muted mt-0.5">{w.weatherText || 'آفتابی'}</p>
            </div>
            <div className="text-center">
              <Sun size={40} className="text-amber-400 mx-auto" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-night-border/50">
            <div className="text-center"><Droplets size={14} className="mx-auto mb-1 text-blue-500" /><div className="text-xs font-bold text-gray-700 dark:text-night-text">{w.humidity ?? '--'}%</div><div className="text-[8px] text-gray-400">رطوبت</div></div>
            <div className="text-center"><Wind size={14} className="mx-auto mb-1 text-teal-500" /><div className="text-xs font-bold text-gray-700 dark:text-night-text">{w.windSpeed ?? '--'}</div><div className="text-[8px] text-gray-400">باد (km/h)</div></div>
            <div className="text-center"><Thermometer size={14} className="mx-auto mb-1 text-amber-500" /><div className="text-xs font-bold text-gray-700 dark:text-night-text">{w.temperature ? Math.round(w.temperature) : '--'}°</div><div className="text-[8px] text-gray-400">احساسی</div></div>
          </div>
        </div>
      )}

      {/* Recharts Charts */}
      {chartData.length > 1 && (
        <>
          <TempHumidityChart data={chartData} />
          <div className="mb-4" />
          {chartData.some((d: any) => d.precipitation != null) && <PrecipBarChart data={chartData} />}
          <div className="mb-4" />
        </>
      )}

      {/* 30-Day Weather Widget */}
      {weatherHistory.length > 0 && (
        <>
          <MonthWeatherWidget history={weatherHistory.slice(0, 25)} forecast={forecast} />
          <div className="mb-4" />
        </>
      )}

      {/* Satellite Data */}
      <SatelliteCard data={satellite} />
      <div className="mb-4" />

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="card shadow-glow mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={16} className="text-amber-500" />
            <h3 className="text-xs font-bold text-gray-600 dark:text-night-muted">پیش‌بینی ۵ روزه</h3>
          </div>
          <div className="flex gap-1">
            {forecast.slice(0, 5).map((d: any, i: number) => (
              <div key={i} className="flex-1 text-center bg-gray-50/50 dark:bg-night-surface/50 rounded-xl py-2">
                <div className="text-[10px] text-gray-500 dark:text-white/65">{getPersianDayName(d.date)}</div>
                <div className="flex justify-center my-1"><ForecastIcon precip={d.dayPrecipitation} tempMax={d.tempMax} /></div>
                <div className="text-sm font-bold text-gray-800 dark:text-white">{d.tempMax ? Math.round(d.tempMax) : '--'}°</div>
                {d.dayPrecipitation != null && <div className="text-[9px] text-blue-400">بارش {d.dayPrecipitation}%</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card mb-4 shadow-glow">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-amber-500" size={18} />
            <h3 className="text-sm font-medium text-gray-600 dark:text-white/80">هشدارها و توصیه‌ها</h3>
          </div>
          {alerts.map((a, i) => (
            <div key={i} className={'text-xs rounded-lg px-3 py-2 mb-1 flex items-center gap-1.5 ' + (a.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300')}>
              {a.type === 'danger' ? <AlertCircle size={14} /> : <AlertTriangle size={14} />}{a.text}
            </div>
          ))}
          <button onClick={() => router.push('/ai')} className="flex items-center gap-1 text-xs text-brand-green hover:text-brand-green/80 underline mt-2 transition-colors"><Sparkles size={13} /> از AI مشورت بگیر</button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div onClick={() => router.push('/irrigation')} className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all">
          <Droplets className="w-8 h-8 mx-auto mb-1 text-brand-green" /><div className="text-xs font-bold text-gray-700 dark:text-white/80">آبیاری</div>
        </div>
        <div onClick={() => router.push('/pests')} className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all">
          <Bug className="w-8 h-8 mx-auto mb-1 text-brand-green" /><div className="text-xs font-bold text-gray-700 dark:text-white/80">آفات</div>
        </div>
        <div onClick={() => router.push('/farms')} className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all">
          <Sprout className="w-8 h-8 mx-auto mb-1 text-brand-green" /><div className="text-xs font-bold text-gray-700 dark:text-white/80">مزارع</div>
        </div>
        <div onClick={() => router.push('/ai')} className="card text-center cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all">
          <Sparkles className="w-8 h-8 mx-auto mb-1 text-brand-green" /><div className="text-xs font-bold text-gray-700 dark:text-white/80">دستیار AI</div>
        </div>
      </div>
    </div>
  );
}
