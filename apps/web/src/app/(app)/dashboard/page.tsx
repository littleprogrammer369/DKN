'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [weather, setWeather] = useState(null);
  const [metrics, setMetrics] = useState(null);
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

  if (loading) return <div className='flex items-center justify-center h-40'><p className='text-gray-400 dark:text-night-muted text-sm'>loading</p></div>;
  if (farms.length === 0) return <div className='text-center mt-12'><h1>No farms yet</h1><button onClick={() => router.push('/setup')}>Create farm</button></div>;

  const farm = farms[0];
  const loc = [farm.city, farm.province].filter(Boolean).join(' - ') || 'N/A';
  const w = weather?.current;
  const forecast = weather?.forecast || [];
  const daysSince = weather?.lastIrrigation ? Math.floor((Date.now() - new Date(weather.lastIrrigation.date).getTime()) / 86400000) : null;

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <p className='text-xs text-gray-500 dark:text-night-muted'>Dashboard</p>
          <h1 className='text-lg font-extrabold text-gray-800 dark:text-night-text'>{user?.firstName || 'Farmer'}</h1>
        </div>
      </div>
      <div className='card dark:bg-night-card/80 dark:border-night-border/60 mb-4'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>farm</span>
          <div><div className='text-sm font-bold'>{farm.name}</div><div className='text-xs text-gray-500'>{loc}</div></div>
        </div>
        {w && (
          <div className='mt-3 grid grid-cols-3 gap-2 text-center'>
            <div className='bg-green-50/50 dark:bg-night-surface rounded-xl py-2'>
              <div className='text-xl font-bold text-brand-green'>{w.temperature ?? '--'}</div>
              <div className='text-[10px] text-gray-500'>Temp</div>
            </div>
            <div className='bg-green-50/50 dark:bg-night-surface rounded-xl py-2'>
              <div className='text-xl font-bold text-brand-green'>{w.humidity ?? '--'}%</div>
              <div className='text-[10px] text-gray-500'>Humidity</div>
            </div>
            <div className='bg-green-50/50 dark:bg-night-surface rounded-xl py-2'>
              <div className='text-xl font-bold text-brand-green'>{w.windSpeed ?? '--'}</div>
              <div className='text-[10px] text-gray-500'>Wind</div>
            </div>
          </div>
        )}
        {daysSince !== null && <div className='text-xs mt-2 text-gray-500'>Last irrigation: {daysSince} days ago</div>}
      </div>
    </>
  );
}
