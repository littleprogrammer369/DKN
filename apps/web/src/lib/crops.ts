import { Wheat, Sprout, Flower2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CropDef { value: string; label: string; icon: LucideIcon; }

// Beta: only these three are selectable in the setup picker.
export const CROPS: CropDef[] = [
  { value: 'wheat',  label: 'گندم', icon: Wheat },
  { value: 'barley', label: 'جو',   icon: Sprout },
  { value: 'rice',   label: 'برنج', icon: Flower2 },
];

// Display-only labels for legacy data created before the beta trim (NOT selectable).
const LEGACY_LABELS: Record<string, string> = {
  soybean: 'سویا', corn: 'ذرت', canola: 'کلزا', saffron: 'زعفران',
  sugarbeet: 'چغندرقند', potato: 'سیب‌زمینی', tomato: 'گوجه‌فرنگی',
  pistachio: 'پسته', cotton: 'پنبه',
};

const BY_VALUE: Record<string, CropDef> = Object.fromEntries(
  CROPS.map(c => [c.value.toLowerCase(), c]),
);

export function cropLabel(value?: string | null): string {
  if (!value) return 'نامشخص';
  const v = value.toLowerCase();
  return BY_VALUE[v]?.label ?? LEGACY_LABELS[v] ?? value;
}
export function cropIcon(value?: string | null): LucideIcon {
  if (!value) return Sprout;
  return BY_VALUE[value.toLowerCase()]?.icon ?? Sprout;
}
