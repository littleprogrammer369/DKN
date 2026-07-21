'use client';

import { Satellite, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SatelliteData {
  ndvi?: number | null;
  evi?: number | null;
  ndwi?: number | null;
  msi?: number | null;
  capturedAt?: string;
  source?: string;
}

function getHealthStatus(value: number): { label: string; color: string; icon: any } {
  if (value >= 0.6) return { label: 'سلامت عالی', color: 'text-green-600 dark:text-green-400', icon: TrendingUp };
  if (value >= 0.4) return { label: 'سلامت خوب', color: 'text-blue-600 dark:text-blue-400', icon: TrendingUp };
  if (value >= 0.2) return { label: 'متوسط', color: 'text-amber-600 dark:text-amber-400', icon: Minus };
  return { label: 'نیاز به توجه', color: 'text-red-600 dark:text-red-400', icon: TrendingDown };
}

export default function SatelliteCard({ data }: { data: SatelliteData | null }) {
  if (!data) {
    return (
      <div className="card shadow-glow">
        <div className="flex items-center gap-2 mb-3">
          <Satellite size={18} className="text-gray-400" />
          <h3 className="text-xs font-bold text-gray-600 dark:text-night-muted">داده‌های ماهواره‌ای</h3>
        </div>
        <p className="text-xs text-gray-400 dark:text-night-muted/60 text-center py-4">
          داده‌ای موجود نیست. منتظر دریافت اولین تصویر ماهواره‌ای باشید.
        </p>
      </div>
    );
  }

  const ndvi = data.ndvi ?? 0;
  const status = getHealthStatus(ndvi);
  const StatusIcon = status.icon;

  return (
    <div className="card shadow-glow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Satellite size={18} className="text-brand-green" />
          <h3 className="text-xs font-bold text-gray-600 dark:text-night-muted">پایش ماهواره‌ای</h3>
        </div>
        {data.capturedAt && (
          <span className="text-[8px] text-gray-400">
            {new Date(data.capturedAt).toLocaleDateString('fa-IR')}
          </span>
        )}
      </div>

      {/* NDVI Gauge */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500">NDVI (شاخص سلامت)</span>
            <span className={`text-xs font-bold flex items-center gap-1 ${status.color}`}>
              <StatusIcon size={12} /> {ndvi.toFixed(2)}
            </span>
          </div>
          <div className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full overflow-hidden">
            <div className="h-full bg-transparent" style={{ width: `${Math.min(100, (ndvi / 0.8) * 100)}%` }} />
          </div>
          <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
            <span>۰</span><span>۰٫۲</span><span>۰٫۴</span><span>۰٫۶</span><span>۰٫۸+</span>
          </div>
        </div>
        <div className="text-center">
          <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Other indices */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 dark:bg-night-surface rounded-lg py-2">
          <div className="text-xs font-bold text-gray-800 dark:text-night-text">{data.evi?.toFixed(2) || '--'}</div>
          <div className="text-[8px] text-gray-400">EVI</div>
        </div>
        <div className="bg-gray-50 dark:bg-night-surface rounded-lg py-2">
          <div className="text-xs font-bold text-gray-800 dark:text-night-text">{data.ndwi?.toFixed(2) || '--'}</div>
          <div className="text-[8px] text-gray-400">NDWI</div>
        </div>
        <div className="bg-gray-50 dark:bg-night-surface rounded-lg py-2">
          <div className="text-xs font-bold text-gray-800 dark:text-night-text">{data.msi?.toFixed(2) || '--'}</div>
          <div className="text-[8px] text-gray-400">MSI</div>
        </div>
      </div>
    </div>
  );
}
