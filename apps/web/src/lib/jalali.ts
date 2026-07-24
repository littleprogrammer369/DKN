export const FA_DIGITS = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x06f0 + i));
export const toFaDigits = (s: string) => s.replace(/\d/g, d => FA_DIGITS[+d]);

export function fa(n: number | string | null | undefined): string {
  if (n == null || n === '') return '—';
  const num = typeof n === 'number' ? n : parseFloat(String(n));
  if (isNaN(num)) return '—';
  return toFaDigits(num.toLocaleString('en-US', { maximumFractionDigits: 2 }))
    .replace(/,/g, '٬').replace(/\./g, '٫');
}

function div(a: number, b: number) { return Math.trunc(a / b); }
export function g2j(gy: number, gm: number, gd: number) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979; gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + div(gy2 + 3, 4) - div(gy2 + 99, 100) + div(gy2 + 399, 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * div(days, 12053); days %= 12053;
  jy += 4 * div(days, 1461); days %= 1461;
  if (days > 365) { jy += div(days - 1, 365); days = (days - 1) % 365; }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
}
const pad2 = (n: number) => String(n).padStart(2, '0');

export function formatJalali(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const { jy, jm, jd } = g2j(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return toFaDigits(`${jy}/${pad2(jm)}/${pad2(jd)}`);
}

/** Correct Gregorian→Jalali parts, for prefilling the date dropdowns. */
export function gregorianToJalaliParts(input: Date | string): { year: number; month: number; day: number } {
  const d = typeof input === 'string' ? new Date(input) : input;
  const { jy, jm, jd } = g2j(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return { year: jy, month: jm, day: jd };
}
