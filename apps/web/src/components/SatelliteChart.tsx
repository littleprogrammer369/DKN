'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export interface SatellitePoint {
  capturedAt?: string;
  ndvi?: number | null;
  evi?: number | null;
  ndwi?: number | null;
}

function fmt(iso?: string) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }); }
  catch { return ''; }
}

export default function SatelliteChart({ data }: { data: SatellitePoint[] }) {
  if (!data || data.length < 2) {
    return (
      <div className="card p-4 text-center text-sm text-gray-500 dark:text-night-muted">
        برای نمایش روند سلامت، حداقل دو نمونه ماهواره‌ای لازم است.
      </div>
    );
  }
  const chart = data.map(d => ({
    label: fmt(d.capturedAt),
    ndvi: d.ndvi ?? null,
    evi: d.evi ?? null,
  }));
  return (
    <div className="card p-4">
      <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-right">
        روند سلامت پوشش گیاهی (NDVI / EVI)
      </h3>
      <div style={{ width: '100%', height: 240 }} dir="ltr">
        <ResponsiveContainer>
          <LineChart data={chart} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} minTickGap={16} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
              labelStyle={{ color: '#d1d5fb' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="ndvi" name="NDVI" stroke="#16a34a" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} connectNulls />
            <Line type="monotone" dataKey="evi"  name="EVI"  stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
