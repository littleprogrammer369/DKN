'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  if (loading) return <div className="flex items-center justify-center h-40"><p className="text-gray-400 dark:text-night-muted text-sm">load</p></div>;
  if (farms.length === 0) return <div className="text-center mt-12"><div className="text-7xl mb-4">crop</div><h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text mb-2">{user?.firstName ? user.firstName + ' jan, ' : 'Hi!'} welcome</h1><p className="text-sm text-gray-500 dark:text-night-muted mb-6">No farms registered yet</p><button onClick={() => router.push('/setup')} className="btn-primary">crop Create First Farm</button></div>;

  const farm = farms[0];
  const loc = [farm.city, farm.province].filter(Boolean).join(' - ') || 'N/A';
  const w = weather?.current;
  const forecast = weather?.forecast || [];
  const daysSince = weather?.lastIrrigation ? Math.floor((Date.now() - new Date(weather.lastIrrigation.date).getTime()) / 86400000) : null;

  const alerts = [];
  if (w?.temperature > 35) alerts.push({ type: 'warning', text: 'temp too high - irrigate in evening' });
  if (w?.humidity > 60) alerts.push({ type: 'warning', text: 'high humidity - fungal risk' });
  if (daysSince !== null && daysSince > 5) alerts.push({ type: 'danger', text: daysSince + ' days since last irrigation!' });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-night-muted">Welcome {user?.firstName || 'Farmer'}</p>
          <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">Dashboard</h1>
        </div>
      </div>

      <div onClick={() => router.push('/farms')} className="card cursor-pointer mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">farm</span>
          <div>
            <div className="text-sm font-bold text-gray-800 dark:text-night-text">{farm.name}</div>
            <div className="text-[10px] text-gray-400 dark:text-night-muted">{loc}{farm.areaHa ? ' - ' + farm.areaHa + ' ha' : ''}</div>
          </div>
        </div>
      </div>

      {w && (
        <div className="card mb-4">
          <div className="text-xs font-bold mb-3">Weather</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50/50 dark:bg-night-surface rounded-xl py-2">
              <div className="text-xl font-extrabold text-brand-green">{w.temperature ?? '--'}</div>
              <div className="text-[10px] text-gray-500 dark:text-night-muted">Temp</div>
            </div>
            <div className="bg-green-50/50 dark:bg-night-surface rounded-xl py-2">
              <div className="text-xl font-extrabold text-brand-green">{w.humidity ?? '--'}%</div>
              <div className="text-[10px] text-gray-500 dark:text-night-muted">Humidity</div>
            </div>
            <div className="bg-green-50/50 dark:bg-night-surface rounded-xl py-2">
              <div className="text-xl font-extrabold text-brand-green">{w.windSpeed ?? '--'}</div>
              <div className="text-[10px] text-gray-500 dark:text-night-muted">Wind</div>
            </div>
          </div>
          {daysSince !== null && <div className="text-xs text-gray-500 mt-2">Last irrigation: {daysSince} days ago</div>}
        </div>
      )}

      {forecast.length > 0 && (
        <div className="card mb-4">
          <div className="text-xs font-bold mb-3">5-Day Forecast</div>
          <div className="flex gap-2 overflow-x-auto">
            {forecast.slice(0,5).map((d: any, i: number) => (
              <div key={i} className="flex-1 text-center bg-green-50/30 dark:bg-night-surface/30 rounded-xl py-2 min-w-[55px]">
                <div className="text-[10px] text-gray-500">{new Date(d.date).toLocaleDateString('fa-IR', {weekday:'short'})}</div>
                <div className="text-sm font-bold text-gray-800 dark:text-night-text mt-1">{d.tempMax ? Math.round(d.tempMax) : '--'}</div>
                {d.dayPrecipitation != null && <div className="text-[9px] text-blue-500">rain {d.dayPrecipitation}%</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="card mb-4">
          <div className="text-xs font-bold mb-2">Alerts & Recommendations</div>
          {alerts.map((a,i) => (
            <div key={i} className={'text-xs rounded-lg px-3 py-2 mb-1 flex items-center gap-1 ' + (a.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300')}>
              {a.type === 'danger' ? 'alert' : 'warn'}{a.text}
            </div>
          ))}
          <button onClick={() => router.push('/ai')} className="text-xs text-brand-green underline mt-1">Ask AI for advice</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div onClick={() => router.push('/irrigation')} className="card text-center cursor-pointer">
          <div className="text-3xl mb-1">water</div>
          <div className="text-xs font-bold">Irrigation</div>
        </div>
        <div onClick={() => router.push('/pests')} className="card text-center cursor-pointer">
          <div className="text-3xl mb-1">pest</div>
          <div className="text-xs font-bold">Pests</div>
        </div>
        <div onClick={() => router.push('/farms')} className="card text-center cursor-pointer">
          <div className="text-3xl mb-1">farm</div>
          <div className="text-xs font-bold">Farms</div>
        </div>
        <div onClick={() => router.push('/ai')} className="card text-center cursor-pointer">
          <div className="text-3xl mb-1">ai</div>
          <div className="text-xs font-bold">AI Assistant</div>
        </div>
      </div>
    </>
  );
}
