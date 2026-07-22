'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wheat, Sprout, TreePine, Pencil, Trash2, MoreVertical, Plus,
  Check, AlertTriangle, Flower2, Eye, Sparkles, Droplet, Bug, Share2
} from 'lucide-react';

/* ── Types ── */
interface Farm {
  id: string;
  name: string;
  city?: string;
  province?: string;
  areaHa?: number;
  product?: string;
  isActive: boolean;
  healthScore?: number;
  status?: string;
}

/* ── Helpers ── */
const CROP_ICONS: Record<string, React.ElementType> = {
  wheat: Wheat,
  gandom: Wheat,
  jo: Sprout,
  barley: Sprout,
  rice: Flower2,

  corn: Sprout,
  pistachio: TreePine,
  saffron: Sprout,

};

function getCropIcon(product?: string) {
  const key = (product || '').toLowerCase();
  return CROP_ICONS[key] ?? Sprout;
}

function toPersianNum(n: number | undefined | null): string {
  if (n == null) return '--';
  return n.toLocaleString('fa-IR');
}

function formatArea(ha: number | undefined | null): string {
  if (ha == null) return '--';
  return toPersianNum(ha) + ' هکتار';
}

function computeHealth(farm: Farm): number {
  if (farm.healthScore != null) return farm.healthScore;
  return farm.isActive ? 100 : 25;
}

/* ── Stat Card ── */
function StatCard({
  icon,
  label,
  value,
  color = 'text-green-600 dark:text-green-400',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-green-50/60 dark:bg-green-900/20 rounded-xl py-3 flex flex-col items-center gap-1 border border-green-100/50 dark:border-green-800/30">
      <span className="text-lg">{icon}</span>
      <span className={'text-base font-extrabold ' + color}>{value}</span>
      <span className="text-[10px] text-gray-500 dark:text-white/55">{label}</span>
    </div>
  );
}

/* ── Stats Summary ── */
function FarmsStats({ farms }: { farms: Farm[] }) {
  const total = farms.length;
  const healthy = farms.filter(f => computeHealth(f) >= 80).length;
  const attention = farms.filter(f => computeHealth(f) < 50).length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <StatCard icon={<Sprout size={16} />} label="کل" value={toPersianNum(total)} />
      <StatCard icon={<Check size={16} />} label="سالم" value={toPersianNum(healthy)} color="text-green-600 dark:text-green-400" />
      <StatCard icon={<AlertTriangle size={16} />} label="نیاز به توجه" value={toPersianNum(attention)} color="text-amber-600 dark:text-amber-400" />
    </div>
  );
}

/* ── Empty State ── */
function FarmsEmptyState() {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <Sprout className="text-green-600 dark:text-green-400" size={40} />
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        هنوز مزرعه‌ای نداری!
      </h2>
      <p className="text-sm text-gray-500 dark:text-white/65 mb-6 max-w-sm mx-auto">
        برای شروع، اولین مزرعه‌ات رو بساز. می‌تونی محصول، مساحت و موقعیت جغرافیایی رو مشخص کنی.
      </p>
      <Link
        href="/setup"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl font-medium hover:bg-brand-green/90 shadow-glow transition-all"
      >
        <Plus size={20} />
        ساخت اولین مزرعه
      </Link>
    </div>
  );
}

/* ── Loading Skeleton ── */
function FarmsLoading() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-green-50/60 dark:bg-green-900/20 rounded-xl py-3 flex flex-col items-center gap-2 border border-green-100/50 dark:border-green-800/30">
            <div className="h-5 w-5 bg-gray-200 dark:bg-white/10 rounded" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-white/10 rounded" />
            <div className="h-2 w-10 bg-gray-200 dark:bg-white/10 rounded" />
          </div>
        ))}
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="card shadow-glow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10" />
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-white/10 rounded" />
              </div>
            </div>
            <div className="flex gap-1">
              <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-white/10" />
              <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
          <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/* ── Farm Card ── */
function FarmCard({
  farm,
  onEdit,
  onDelete,
}: {
  farm: Farm;
  onEdit: (f: Farm) => void;
  onDelete: (f: Farm) => void;
}) {
  const router = useRouter();
  const CropIcon = getCropIcon(farm.product);
  const health = computeHealth(farm);
  const healthColor =
    health >= 80
      ? 'bg-green-500 dark:bg-green-400'
      : health >= 50
        ? 'bg-amber-500 dark:bg-amber-400'
        : 'bg-red-500 dark:bg-red-400';

  return (
    <div
      className="card cursor-pointer shadow-glow hover:shadow-glow-lg hover:scale-[1.01] transition-all mb-3"
      onClick={() => router.push('/farms/' + farm.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <CropIcon size={20} className="text-green-700 dark:text-green-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800 dark:text-white">{farm.name}</div>
            <div className="text-[11px] text-gray-500 dark:text-white/60 mt-0.5">
              {farm.product || 'گندم'} — {formatArea(farm.areaHa)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(farm); }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/50 hover:text-brand-green dark:hover:text-brand-green transition-colors"
            aria-label="ویرایش"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(farm); }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/50 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            aria-label="حذف"
          >
            <Trash2 size={16} />
          </button>

          {/** Dropdown menu */}
          <Menu farm={farm} router={router} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={'h-full rounded-full transition-all duration-500 ' + healthColor}
            style={{ width: health + '%' }}
          />
        </div>
        <span className="text-[10px] font-semibold text-gray-500 dark:text-white/50">
          {toPersianNum(health)}٪
        </span>
      </div>
      {(farm.city || farm.province) && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/55">
            {[farm.city, farm.province].filter(Boolean).join('، ')}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Farm Card Menu ── */
function Menu({ farm, router }: { farm: Farm; router: any }) {
  const [open, setOpen] = useState(false);

  const shareFarm = async () => {
    setOpen(false);
    const url = typeof window !== 'undefined' ? `${window.location.origin}/farms/${farm.id}` : '';
    try {
      if (navigator.share) await navigator.share({ title: farm.name, url });
      else await navigator.clipboard.writeText(url);
    } catch { /* cancelled / unsupported */ }
  };

  const items = [
    { label: 'مشاهده جزئیات', icon: Eye, go: () => router.push('/farms/' + farm.id) },
    { label: 'مشاوره AI', icon: Sparkles, go: () => router.push('/ai?farm=' + farm.id) },
    { label: 'برنامه آبیاری', icon: Droplet, go: () => router.push('/irrigation?farm=' + farm.id) },
    { label: 'گزارش آفت', icon: Bug, go: () => router.push('/pests?farm=' + farm.id) },
    { label: 'اشتراک‌گذاری', icon: Share2, go: shareFarm },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/50 transition-colors"
        aria-label="بیشتر"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute left-0 top-full z-40 mt-1 w-52 max-w-[80vw] rounded-xl bg-white dark:bg-night-card shadow-xl border border-gray-200 dark:border-night-border overflow-hidden text-right">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.label}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); it.go(); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-night-text hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Icon size={16} className="text-gray-400 dark:text-white/50 shrink-0" />
                  {it.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function FarmsPage() {
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    fetch('/api/v1/farms', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => { setFarms(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const handleEdit = (farm: Farm) => {
    router.push('/setup?edit=' + farm.id);
  };

  const handleDelete = async (farm: Farm) => {
    const token = localStorage.getItem('token');
    if (!confirm('آیا از حذف این مزرعه مطمئنی؟')) return;
    try {
      const res = await fetch('/api/v1/farms/' + farm.id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token! },
      });
      if (res.ok) setFarms(prev => prev.filter(f => f.id !== farm.id));
    } catch { /* ignore */ }
  };

  if (loading) return <FarmsLoading />;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-white/55">مدیریت مزارع</p>
          <h1 className="text-lg font-extrabold text-gray-800 dark:text-white">زمین‌های من</h1>
        </div>
        <Link
          href="/setup"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-green text-white text-sm font-bold rounded-xl hover:bg-brand-green/90 shadow-glow transition-all"
        >
          <Plus size={18} />
          ساخت مزرعه جدید
        </Link>
      </div>

      {/* Stats */}
      {farms.length > 0 && <FarmsStats farms={farms} />}

      {/* Empty */}
      {farms.length === 0 && <FarmsEmptyState />}

      {/* Farm cards */}
      {farms.map(farm => (
        <FarmCard
          key={farm.id}
          farm={farm}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </>
  );
}
