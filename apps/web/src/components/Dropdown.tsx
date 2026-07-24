'use client';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption { value: string | number; label: string; }

export default function Dropdown({
  value, onChange, options, placeholder = 'انتخاب کنید',
}: {
  value: string | number | '' | null | undefined;
  onChange: (v: string | number) => void;
  options: DropdownOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const close = () => { setOpen(false); setPos(null); };
  const toggle = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) { setPos({ top: r.bottom + 4, left: r.left, width: r.width }); setOpen(o => !o); }
  };
  useLayoutEffect(() => {
    if (!open || !menuRef.current || !pos) return;
    const mh = menuRef.current.offsetHeight;
    let { top } = pos;
    if (top + mh > window.innerHeight - 8) {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) top = Math.max(8, r.top - mh - 4);
    }
    if (top !== pos.top) setPos(p => (p ? { ...p, top } : p));
  }, [open, pos]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onScroll = (e: Event) => {
      if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) return;
      close();
    };
    const onResize = () => close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const selected = options.find(o => String(o.value) === String(value));
  const label = selected ? selected.label : placeholder;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        className="input-glass flex items-center justify-between gap-2 text-right"
        dir="rtl"
      >
        <span className={selected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-night-muted'}>{label}</span>
        <ChevronDown size={16} className={`text-gray-400 dark:text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[110]" onClick={(e) => { e.stopPropagation(); close(); }} />
          <div ref={menuRef}
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }}
            className="z-[120] max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-night-card shadow-xl border border-gray-200 dark:border-night-border text-right"
            dir="rtl">
            {options.map(o => {
              const isSel = String(o.value) === String(value);
              return (
                <button key={String(o.value)} type="button"
                  onClick={(e) => { e.stopPropagation(); onChange(o.value); close(); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm transition-colors ${isSel ? 'text-brand-green bg-brand-green/10 font-bold' : 'text-gray-700 dark:text-night-text hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <span>{o.label}</span>
                  {isSel && <Check size={15} />}
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
