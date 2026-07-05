'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [weather, setWeather] = useState(null);
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
  return <><div>{farm.name}</div>{w && <div>Temp: {w.temperature}C Humidity: {w.humidity}%</div>}</>;
}
