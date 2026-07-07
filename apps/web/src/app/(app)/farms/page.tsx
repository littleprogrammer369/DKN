'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Farm { id: string; name: string; city?: string; province?: string; areaHa?: number; product?: string; isActive: boolean }

export default function FarmsPage() {
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => { setFarms(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted text-sm">load</p></div>;

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch('/api/v1/farms/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
      if (res.ok) setFarms(prev => prev.filter(f => f.id !== id));
    } catch {}
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-night-muted">Manage Farms</p>
          <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">My Farms</h1>
        </div>
        <button onClick={() => router.push('/setup')} className="btn-primary">+ New Farm</button>
      </div>

      {farms.length === 0 ? (
        <div className="text-center mt-12">
          <div className="text-4xl mb-3">farm</div>
          <p className="text-sm text-gray-500 mb-4">No farms yet</p>
          <button onClick={() => router.push('/setup')} className="btn-primary">Create First Farm</button>
        </div>
      ) : (
        farms.map(farm => (
          <div key={farm.id} className="card cursor-pointer hover:shadow-lg mb-3"
               onClick={() => router.push('/farms/' + farm.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">crop</span>
                <div>
                  <div className="text-sm font-bold">{farm.name}</div>
                  <div className="text-[10px] text-gray-400">{farm.product || 'wheat'} - {farm.areaHa || '--'} ha</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); }} className="opacity-50 hover:opacity-100 text-xs">edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(farm.id); }} className="opacity-50 hover:opacity-100 text-xs">del</button>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}
