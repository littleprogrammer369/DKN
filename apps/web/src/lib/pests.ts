export type Sev = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export const SEV: Record<Sev, { l: string; cls: string; dot: string }> = {
  LOW: { l: 'کم', cls: 'bg-green-500/15 text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  MEDIUM: { l: 'متوسط', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  HIGH: { l: 'شدید', cls: 'bg-orange-500/15 text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
  CRITICAL: { l: 'بحرانی', cls: 'bg-red-500/15 text-red-600 dark:text-red-400', dot: 'bg-red-500' },
};
export const RISK = { low: { l: 'پایین', cls: 'bg-green-500/15 text-green-600 dark:text-green-400' }, medium: { l: 'متوسط', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' }, high: { l: 'بالا', cls: 'bg-red-500/15 text-red-600 dark:text-red-400' }, unknown: { l: 'نامشخص', cls: 'bg-gray-500/15 text-gray-500' } } as const;
export const CATEGORIES = ['حشرات', 'قارچ و بیماری', 'کنه', 'ویروس', 'علف هرز', 'کمبود تغذیه', 'سایر'] as const;
export interface Pest { name: string; category: typeof CATEGORIES[number]; crops: string[]; treatment: string; chemical?: string; sev?: Sev; }
export const PEST_CATALOG: Pest[] = [
  { name: 'شته', category: 'حشرات', crops: ['wheat','barley'], treatment: 'سم‌پاشی با پیریمیکارب/استامی‌پراید در زمان طغیان؛ حفظ کفشدوزک‌ها.', chemical: 'پیریمیکارب', sev: 'MEDIUM' },
  { name: 'سن گندم', category: 'حشرات', crops: ['wheat','barley'], treatment: 'پایش سن مادر و پوره؛ سم‌پاشی در صورت عبور از آستانه.', chemical: 'دلتامترین', sev: 'HIGH' },
  { name: 'مگس هسه', category: 'حشرات', crops: ['wheat','barley'], treatment: 'کاشت بذر مقاوم و تاریخ کاشت مناسب؛ سم‌پاشی پاییزه در صورت لزوم.', sev: 'MEDIUM' },
  { name: 'کرم ساقه‌خوار برنج', category: 'حشرات', crops: ['rice'], treatment: 'نورگیر کردن بقایا؛ کاربرد تری‌فلومورون/کلرآنترانیلیپرول.', chemical: 'کلرآنترانیلیپرول', sev: 'HIGH' },
  { name: 'زنجره/پشه برنج', category: 'حشرات', crops: ['rice'], treatment: 'مدیریت آب و سم‌پاشی هدفمند.', sev: 'MEDIUM' },
  { name: 'زنگ زرد', category: 'قارچ و بیماری', crops: ['wheat','barley'], treatment: 'ارقام مقاوم؛ سم‌پاشی پیشگیرانه تیبوکونازول/پروپیکونازول.', chemical: 'تیبوکونازول', sev: 'HIGH' },
  { name: 'سفیدک پودری', category: 'قارچ و بیماری', crops: ['wheat','barley'], treatment: 'تناوب زراعی + قارچ‌کش در صورت شدت.', chemical: 'گوگرد / تریادیمنول', sev: 'MEDIUM' },
  { name: 'سپتوریا', category: 'قارچ و بیماری', crops: ['wheat','barley'], treatment: 'بذر سالم + قارچ‌کش برگی.', sev: 'MEDIUM' },
  { name: 'بلست برنج', category: 'قارچ و بیماری', crops: ['rice'], treatment: 'کاهش کود نیتروژن؛ تری‌سیکلازول/آزوکسی‌استروبین.', chemical: 'تری‌سیکلازول', sev: 'CRITICAL' },
  { name: 'لکه قهوه‌ای برنج', category: 'قارچ و بیماری', crops: ['rice'], treatment: 'بذر ضدعفونی + مدیریت رطوبت.', sev: 'MEDIUM' },
  { name: 'سوختگی غلاف برنج', category: 'قارچ و بیماری', crops: ['rice'], treatment: 'کاهش تراکم + ولیداسین/هگزاکونازول.', sev: 'MEDIUM' },
  { name: 'کنه زرد/قرمز', category: 'کنه', crops: ['wheat','barley'], treatment: 'کنه‌کش در زمان طغیان؛ حفظ دشمنان طبیعی.', sev: 'MEDIUM' },
  { name: 'ویروس زردی کوتولگی (BYDV)', category: 'ویروس', crops: ['wheat','barley'], treatment: 'کنترل شته ناقل؛ کاشت به‌موقع.', sev: 'HIGH' },
  { name: 'یولاف وحشی', category: 'علف هرز', crops: ['wheat','barley'], treatment: 'علف‌کش پوما/کلودینافوپ در مرحله مناسب.', chemical: 'کلودینافوپ', sev: 'MEDIUM' },
  { name: 'سوروف/پهن‌برگ‌ها', category: 'علف هرز', crops: ['rice'], treatment: 'وجین/علف‌کش انتخابی + مدیریت آب.', sev: 'MEDIUM' },
  { name: 'کمبود نیتروژن', category: 'کمبود تغذیه', crops: ['wheat','barley','rice'], treatment: 'سرک اوره بر اساس آزمون خاک/برگ.', sev: 'MEDIUM' },
  { name: 'کمبود روی', category: 'کمبود تغذیه', crops: ['wheat','barley'], treatment: 'محلول‌پاشی سولفات روی یا کاربرد خاکی.', sev: 'MEDIUM' },
  { name: 'کمبود آهن', category: 'کمبود تغذیه', crops: ['rice'], treatment: 'اصلاح pH + کلات آهن.', sev: 'MEDIUM' },
];
export function pestsForCrop(crop?: string | null): Record<string, Pest[]> {
  const c = (crop || '').toLowerCase();
  const out: Record<string, Pest[]> = {};
  for (const p of PEST_CATALOG) { if (!c || p.crops.includes(c)) (out[p.category] ||= []).push(p); }
  return out;
}
