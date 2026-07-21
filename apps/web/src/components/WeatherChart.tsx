'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface DataPoint {
  label: string;
  temp?: number;
  humidity?: number;
  precipitation?: number;
}

export function TempHumidityChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="card shadow-glow">
      <h3 className="text-xs font-bold text-gray-600 dark:text-night-muted mb-3">دمای هوا و رطوبت</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: 'Vazirmatn' }} stroke="#9CA3AF" />
          <YAxis yAxisId="temp" tick={{ fontSize: 10 }} stroke="#F59E0B" domain={['auto', 'auto']} />
          <YAxis yAxisId="hum" orientation="right" tick={{ fontSize: 10 }} stroke="#3B82F6" domain={[0, 100]} />
          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'Vazirmatn', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="دما (°C)" />
          <Line yAxisId="hum" type="monotone" dataKey="humidity" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="رطوبت (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PrecipBarChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="card shadow-glow">
      <h3 className="text-xs font-bold text-gray-600 dark:text-night-muted mb-3">بارش پیش‌بینی شده</h3>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: 'Vazirmatn' }} stroke="#9CA3AF" />
          <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" domain={[0, 100]} />
          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'Vazirmatn', border: 'none' }} />
          <Bar dataKey="precipitation" fill="#60A5FA" radius={[4, 4, 0, 0]} name="بارش (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
