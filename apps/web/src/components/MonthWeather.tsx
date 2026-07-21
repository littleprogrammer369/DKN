'use client';

import { useState } from 'react';
import { Calendar, Sun, CloudRain, Thermometer, ChevronRight, ChevronLeft } from 'lucide-react';

interface DayData {
  date: string;
  tempMin?: number | null;
  tempMax?: number | null;
  precipitation?: number | null;
}

export default function MonthWeatherWidget({ history = [], forecast = [] }: { history: DayData[]; forecast: DayData[] }) {
  const [weekOffset, setWeekOffset] = useState(0);

  // Combine history (pas, past) and forecast (future) into monthly view
  const allDays: DayData[] = [...history, ...forecast];
  const totalWeeks = Math.ceil(allDays.length / 7);
  const startIdx = weekOffset * 7;
  const weekDays = allDays.slice(startIdx, startIdx + 7);

  if (allDays.length === 0) return null;

  const avgTemp = allDays.reduce((s, d) => s + ((d.tempMax ?? 0) + (d.tempMin ?? 0)) / 2, 0) / allDays.length;
  const maxTemp = Math.max(...allDays.map(d => d.tempMax ?? 0));
  const minTemp = Math.min(...allDays.map(d => d.tempMin ?? Infinity));
  const rainyDays = allDays.filter(d => (d.precipitation ?? 0) > 30).length;

  return (
    <div className="card shadow-glow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-brand-green" />
          <h3 className="text-xs font-bold text-gray-600 dark:text-night-muted">خلاصه ۳۰ روزه</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0}
            className="w-6 h-6 rounded-full bg-gray-100 dark:bg-night-surface flex items-center justify-center disabled:opacity-30">
            <ChevronRight size={12} className="text-gray-500" />
          </button>
          <span className="text-[10px] text-gray-400">هفته {weekOffset + 1} از {totalWeeks || 1}</span>
          <button onClick={() => setWeekOffset(Math.min(totalWeeks - 1, weekOffset + 1))} disabled={weekOffset >= totalWeeks - 1}
            className="w-6 h-6 rounded-full bg-gray-100 dark:bg-night-surface flex items-center justify-center disabled:opacity-30">
            <ChevronLeft size={12} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-green-50/60 dark:bg-green-900/20 rounded-lg py-2 text-center">
          <Thermometer size={14} className="mx-auto mb-0.5 text-amber-500" />
          <div className="text-sm font-extrabold text-gray-800 dark:text-night-text">{avgTemp.toFixed(1)}°</div>
          <div className="text-[8px] text-gray-400">میانگین</div>
        </div>
        <div className="bg-orange-50/60 dark:bg-orange-900/20 rounded-lg py-2 text-center">
          <Sun size={14} className="mx-auto mb-0.5 text-orange-500" />
          <div className="text-sm font-extrabold text-gray-800 dark:text-night-text">{maxTemp.toFixed(1)}°</div>
          <div className="text-[8px] text-gray-400">حداکثر</div>
        </div>
        <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-lg py-2 text-center">
          <Thermometer size={14} className="mx-auto mb-0.5 text-blue-500" />
          <div className="text-sm font-extrabold text-gray-800 dark:text-night-text">{minTemp === Infinity ? '--' : minTemp.toFixed(1)}°</div>
          <div className="text-[8px] text-gray-400">حداقل</div>
        </div>
        <div className="bg-indigo-50/60 dark:bg-indigo-900/20 rounded-lg py-2 text-center">
          <CloudRain size={14} className="mx-auto mb-0.5 text-indigo-500" />
          <div className="text-sm font-extrabold text-gray-800 dark:text-night-text">{rainyDays}</div>
          <div className="text-[8px] text-gray-400">روز بارانی</div>
        </div>
      </div>

      {/* Weekly mini chart */}
      <div className="flex gap-1">
        {weekDays.map((d, i) => {
          const dayName = new Date(d.date).toLocaleDateString('fa-IR', { weekday: 'short' });
          const isRainy = (d.precipitation ?? 0) > 30;
          return (
            <div key={i} className="flex-1 text-center bg-gray-50/50 dark:bg-night-surface/50 rounded-lg py-1.5">
              <div className="text-[8px] text-gray-400 mb-1">{dayName}</div>
              <div className="text-[9px] font-bold text-gray-700 dark:text-night-text">
                {d.tempMax ? Math.round(d.tempMax) : '--'}°
              </div>
              <div className="text-[8px] text-gray-400">{d.tempMin ? Math.round(d.tempMin) : '--'}°</div>
              {isRainy && <CloudRain size={8} className="mx-auto mt-0.5 text-blue-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
