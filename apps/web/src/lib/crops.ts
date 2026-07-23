import { Wheat, Sprout, Flower2, TreePine, Leaf } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CropDef { value: string; label: string; icon: LucideIcon; }

export const CROPS: CropDef[] = [
  { value: 'wheat',     label: 'گندم',        icon: Wheat },
  { value: 'barley',    label: 'جو',          icon: Sprout },
  { value: 'rice',      label: 'برنج',        icon: Flower2 },
  { value: 'soybean',   label: 'سویا',        icon: Leaf },
  { value: 'corn',      label: 'ذرت',         icon: Sprout },
  { value: 'canola',    label: 'کلزا',        icon: Flower2 },
  { value: 'saffron',   label: 'زعفران',      icon: Flower2 },
  { value: 'sugarbeet', label: 'چغندرقند',    icon: Leaf },
  { value: 'potato',    label: 'سیب‌زمینی',   icon: Leaf },
  { value: 'tomato',    label: 'گوجه‌فرنگی',  icon: Leaf },
  { value: 'pistachio', label: 'پسته',        icon: TreePine },
  { value: 'cotton',    label: 'پنبه',        icon: Flower2 },
];

const BY_VALUE: Record<string, CropDef> = Object.fromEntries(
  CROPS.map(c => [c.value.toLowerCase(), c]),
);

export function cropLabel(value?: string | null): string {
  if (!value) return 'نامشخص';
  return BY_VALUE[value.toLowerCase()]?.label ?? value;
}
export function cropIcon(value?: string | null): LucideIcon {
  if (!value) return Sprout;
  return BY_VALUE[value.toLowerCase()]?.icon ?? Sprout;
}
