'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PestsPage() {
  const router = useRouter();
  const [hasFarm, setHasFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState({ product: '', pestType: '', severity: 'medium', notes: '', image: null });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(async (d) => {
        const has = Array.isArray(d) && d.length > 0;
        setHasFarm(has);
        if (has) {
          try {
            const res = await fetch('/api/v1/weather/' + d[0].id + '/dashboard?city=' + encodeURIComponent(d[0].city || 'Saveh'), {
              headers: { Authorization: 'Bearer ' + token }
            });
            if (res.ok) setWeather(await res.json());
          } catch {}
        }
      }).catch(() => setHasFarm(false));
  }, [router]);

  if (hasFarm === null) return <div className="flex justify-center py-10"><p className="text-gray-400 dark:text-night-muted text-sm">load</p></div>;
  if (!hasFarm) return (
    <div className="text-center mt-12">
      <div className="text-4xl mb-3">plant</div>
      <p className="text-sm text-gray-500 mb-4">Register a farm first</p>
      <button onClick={() => router.push('/setup')} className="btn-primary">Create Farm</button>
    </div>
  );

  const w = weather?.current;
  const tempRisk = w?.temperature > 35 ? 'high' : w?.temperature > 30 ? 'medium' : 'low';
  const humidityRisk = w?.humidity > 60 ? 'high' : w?.humidity > 40 ? 'medium' : 'low';

  return (
    <>
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-night-muted">Pest Monitoring</p>
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-night-text">Pests & Diseases</h1>
      </div>

      {/* Risk Card */}
      <div className="card dark:bg-night-card/80 mb-4">
        <div className="text-sm font-bold mb-3">Risk Status</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">Heat stress risk</span>
            <span className={"text-xs font-bold px-2 py-0.5 rounded " + (tempRisk === 'high' ? 'bg-red-100 text-red-600' : tempRisk === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600')}>{tempRisk === 'high' ? 'HIGH' : tempRisk === 'medium' ? 'MEDIUM' : 'LOW'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Fungal risk (humidity)</span>
            <span className={"text-xs font-bold px-2 py-0.5 rounded " + (humidityRisk === 'high' ? 'bg-red-100 text-red-600' : humidityRisk === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600')}>{humidityRisk === 'high' ? 'HIGH' : humidityRisk === 'medium' ? 'MEDIUM' : 'LOW'}</span>
          </div>
        </div>
      </div>

      {/* Report Form */}
      {showReport && (
        <div className="card mb-4">
          <div className="text-sm font-bold mb-3">New Report</div>
          <select className="input-glass mb-2" value={reportData.product} onChange={e => setReportData({...reportData, product: e.target.value})}>
            <option value="">Select product</option>
            <option>Wheat</option><option>Barley</option><option>Corn</option><option>Pistachio</option>
          </select>
          <select className="input-glass mb-2" value={reportData.pestType} onChange={e => setReportData({...reportData, pestType: e.target.value})}>
            <option value="">Select pest type</option>
            <option>Rust</option><option>Aphid</option><option>Powdery mildew</option><option>Other</option>
          </select>
          <textarea className="input-glass mb-2" placeholder="Notes..." value={reportData.notes} onChange={e => setReportData({...reportData, notes: e.target.value})} />
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={() => { setReports([{...reportData, date: new Date()} as never, ...reports]); setShowReport(false); }}>Submit</button>
            <button className="btn-outline" onClick={() => setShowReport(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* My Reports */}
      <div className="section-title">My Reports</div>
      <div className="card">
        {reports.length > 0 ? reports.map((r, i) => (
          <div key={i} className="text-xs py-2 border-b last:border-0">{r.product} - {r.pestType}</div>
        )) : (
          <p className="text-xs text-gray-400 text-center py-4">No reports yet</p>
        )}
      </div>

      <button onClick={() => setShowReport(true)} className="btn-primary mt-3">
        + New Report
      </button>
    </>
  );
}
