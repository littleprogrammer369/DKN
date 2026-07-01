// Convert Persian/Arabic digits to English
export function toEnglishDigits(str: string): string {
  const persianMap: Record<string, string> = {
    '۰': '0','۱': '1','۲': '2','۳': '3','۴': '4',
    '۵': '5','۶': '6','۷': '7','۸': '8','۹': '9',
    '٠': '0','١': '1','٢': '2','٣': '3','٤': '4',
    '٥': '5','٦': '6','٧': '7','٨': '8','٩': '9',
  };
  return str.replace(/[۰-۹٠-٩]/g, m => persianMap[m] || m);
}

// Allow only English digits (filter out any non-digit after conversion)
export function onlyDigits(str: string): string {
  return toEnglishDigits(str).replace(/\D/g, '');
}

// Generate Jalali date parts
export function getJalaliToday(): { year: number; month: number; day: number } {
  const now = new Date();
  const gYear = now.getFullYear();
  const gMonth = now.getMonth() + 1;
  const gDay = now.getDate();
  // Simple approximate conversion (accurate enough for date picker defaults)
  let jYear = gYear - 621;
  let jMonth = gMonth;
  let jDay = gDay;
  if (gMonth < 3 || (gMonth === 3 && gDay < 21)) { jYear--; jMonth += 9; }
  else { jMonth -= 3; }
  // Approximate day adjustment
  if (jMonth > 6 && jMonth < 12) jDay = Math.min(jDay, 30);
  return { year: jYear, month: jMonth, day: jDay };
}

// Convert Jalali to Gregorian (simplified)
export function jalaliToGregorian(jYear: number, jMonth: number, jDay: number): string {
  let gYear = jYear + 621;
  let gMonth = jMonth + 3;
  if (gMonth > 12) { gMonth -= 12; gYear++; }
  return `${gYear}-${String(gMonth).padStart(2, '0')}-${String(jDay).padStart(2, '0')}`;
}

// Jalali month names
export const JALALI_MONTHS = [
  'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
  'مهر','آبان','آذر','دی','بهمن','اسفند'
];
