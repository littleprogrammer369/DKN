'use client';
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wheat, Sprout, TreePine, Pencil, Trash2, MoreVertical, Plus,
  Check, AlertTriangle, Flower2, Eye, Sparkles, Droplet, Bug, Share2,
  Search, X, ChevronLeft, ChevronRight
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

const CROP_LABELS: Record<string, string> = {
  wheat: 'گندم', gandom: 'گندم', barley: 'جو', jo: 'جو', rice: 'برنج',
  corn: 'ذرت', pistachio: 'پسته', saffron: 'زعفران',
};
const cropLabel = (v: string) => CROP_LABELS[v.toLowerCase()] || v;

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

  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const closeMenu = () => { setMenuOpen(false); setPos(null); };
  const openMenu = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) { setPos({ top: r.bottom + 4, left: r.left }); setMenuOpen(true); }
  };

  // flip above the button / clamp horizontally so it never leaves the viewport
  useLayoutEffect(() => {
    if (!menuOpen || !menuRef.current || !pos) return;
    const mh = menuRef.current.offsetHeight;
    const mw = menuRef.current.offsetWidth;
    let { top, left } = pos;
    if (top + mh > window.innerHeight - 8) {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) top = Math.max(8, r.top - mh - 4);
    }
    if (left + mw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - mw - 8);
    if (left !== pos.left || top !== pos.top) setPos({ top, left });
  }, [menuOpen, pos]);

  // close on Escape / any scroll (capture) / resize
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    const onClose = () => closeMenu();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onClose, true);
    window.addEventListener('resize', onClose);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onClose, true);
      window.removeEventListener('resize', onClose);
    };
  }, [menuOpen]);

  const shareFarm = async () => {
    closeMenu();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/farms/${farm.id}` : '';
    try {
      if (navigator.share) await navigator.share({ title: farm.name, url });
      else await navigator.clipboard.writeText(url);
    } catch { /* cancelled */ }
  };

  const menuItems = [
    { label: 'مشاهده جزئیات', icon: Eye, go: () => router.push('/farms/' + farm.id) },
    { label: 'مشاوره AI', icon: Sparkles, go: () => router.push('/ai?farm=' + farm.id) },
    { label: 'برنامه آبیاری', icon: Droplet, go: () => router.push('/irrigation?farm=' + farm.id) },
    { label: 'گزارش آفت', icon: Bug, go: () => router.push('/pests?farm=' + farm.id) },
    { label: 'اشتراک‌گذاری', icon: Share2, go: shareFarm },
  ];

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

          <button
            ref={btnRef}
            type="button"
            onClick={(e) => { e.stopPropagation(); menuOpen ? closeMenu() : openMenu(); }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white/50 transition-colors"
            aria-label="بیشتر"
          >
            <MoreVertical size={18} />
          </button>
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

      {menuOpen && pos && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); closeMenu(); }} />
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: 208 }}
            className="z-50 rounded-xl bg-white dark:bg-night-card shadow-xl border border-gray-200 dark:border-night-border overflow-hidden text-right"
          >
            {menuItems.map((it) => {
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
        </>,
        document.body,
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

  // ── Search + filters + pagination ──
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'attention'>('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return farms.filter(f => {
      if (q) {
        const hay = [f.name, f.product, f.city, f.province].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const h = computeHealth(f);
      if (statusFilter === 'healthy' && h < 80) return false;
      if (statusFilter === 'attention' && h >= 50) return false;
      if (cropFilter !== 'all' && (f.product || '').toLowerCase() !== cropFilter) return false;
      return true;
    });
  }, [farms, query, statusFilter, cropFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const cropOptions = useMemo(
    () => Array.from(new Set(farms.map(f => (f.product || '').toLowerCase()).filter(Boolean))),
    [farms],
  );

  // reset to first page whenever the query/filters change
  useEffect(() => { setPage(1); }, [query, statusFilter, cropFilter]);

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

      {/* Search */}
      <div className="relative mb-3">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی مزرعه، محصول یا شهر…"
          style={{ paddingRight: '2.75rem', paddingLeft: '2.25rem' }}
          className="input-glass w-full text-right"
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="پاک کردن"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/70">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        {([['all', 'همه'], ['healthy', 'سالم'], ['attention', 'نیاز به توجه']] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setStatusFilter(k)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              statusFilter === k
                ? 'bg-brand-green text-white border-brand-green'
                : 'border-gray-200 dark:border-night-border text-gray-600 dark:text-night-muted hover:border-brand-green/50'
            }`}
          >
            {label}
          </button>
        ))}
        {cropOptions.length > 1 && (
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="input-glass !py-1.5 !text-xs shrink-0 text-right"
          >
            <option value="all">همه محصولات</option>
            {cropOptions.map(c => <option key={c} value={c}>{cropLabel(c)}</option>)}
          </select>
        )}
      </div>

      {/* Empty */}
      {farms.length === 0 && <FarmsEmptyState />}

      {/* Results count */}
      {farms.length > 0 && filtered.length !== farms.length && (
        <p className="text-xs text-gray-500 dark:text-night-muted text-right mb-2">
          {toPersianNum(filtered.length)} نتیجه از {toPersianNum(farms.length)}
        </p>
      )}

      {/* Farm cards */}
      {pageItems.map(farm => (
        <FarmCard
          key={farm.id}
          farm={farm}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* No results */}
      {farms.length > 0 && filtered.length === 0 && (
        <div className="p-8 text-center">
          <Search size={28} className="mx-auto text-gray-400 dark:text-white/40 mb-2" />
          <p className="text-gray-600 dark:text-night-muted mb-3">مزرعه‌ای با این مشخصات پیدا نشد.</p>
          <button
            onClick={() => { setQuery(''); setStatusFilter('all'); setCropFilter('all'); }}
            className="btn-outline !text-xs !py-1.5 !px-3"
          >
            پاک کردن فیلترها
          </button>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            disabled={safePage <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="btn-outline !py-1.5 !px-3 !text-xs disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronRight size={14} /> قبلی
          </button>
          <span className="text-sm text-gray-600 dark:text-night-muted tabular-nums">
            {toPersianNum(safePage)} / {toPersianNum(pageCount)}
          </span>
          <button
            disabled={safePage >= pageCount}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            className="btn-outline !py-1.5 !px-3 !text-xs disabled:opacity-40 flex items-center gap-1"
          >
            بعدی <ChevronLeft size={14} />
          </button>
        </div>
      )}
    </>
  );
}
