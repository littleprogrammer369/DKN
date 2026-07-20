export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function onlyDigits(s: string) {
  return s.replace(/\\D/g, "");
}

export const JALALI_MONTHS = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند"
];

export function getJalaliToday() {
  const d = new Date();
  const year = d.getFullYear() - 621;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return { year, month, day, persian: year + "/" + String(month).padStart(2,"0") + "/" + String(day).padStart(2,"0") };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  const gy = jy + 621;
  return new Date(gy, jm - 1, jd);
}
