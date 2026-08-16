import type { JalaliDate, JalaliMonthIndex } from "./types";

/**
 * Determines if a Jalali year is a leap year (کبیسه).
 * Uses the Birashk 2820-year cycle algorithm.
 */
export function isJalaliLeapYear(year: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];

  let jp = breaks[0];
  let jump = 0;

  if (year < jp || year >= breaks[breaks.length - 1]) {
    throw new Error(`Jalali year ${year} is outside supported range.`);
  }

  for (let i = 1; i < breaks.length; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (year < jm) break;
    jp = jm;
  }

  let n = year - jp;
  if (jump - n < 6) n = n - jump + ((jump + 4) / 33) * 33;
  let leap = ((n + 1) % 33) - 1;
  if (leap === -1) leap = 4;

  return leap % 4 === 0;
}

/**
 * Returns the number of days in a specific Jalali month.
 */
export function getDaysInJalaliMonth(
  year: number,
  month: JalaliMonthIndex,
): number {
  if (month < 0 || month > 11) {
    throw new RangeError(
      "Month index must be between 0 (Farvardin) and 11 (Esfand).",
    );
  }
  // Months 0 to 5 (Farvardin - Shahrivar) have 31 days
  if (month <= 5) return 31;
  // Months 6 to 10 (Mehr - Bahman) have 30 days
  if (month <= 10) return 30;
  // Month 11 (Esfand) has 30 in leap years, 29 in regular years
  return isJalaliLeapYear(year) ? 30 : 29;
}

/**
 * Converts a Gregorian date (Year, Month, Day) to Jalali date.
 */
export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number,
): JalaliDate {
  const g_d_m = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let jy: number;
  let jm: number;
  let jd: number;

  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd;

  for (let i = 0; i < gm; ++i) days += g_d_m[i];

  jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  if (days < 186) {
    jm = Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 6 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return { year: jy, month: jm as JalaliMonthIndex, day: jd };
}

/**
 * Converts a Jalali date to a Gregorian Date.
 */
export function jalaliToGregorian(
  jy: number,
  jm: JalaliMonthIndex,
  jd: number,
): Date {
  let gy: number;
  let gm: number;
  let gd: number;

  let jy2 = jy + 1595;
  let days =
    -355668 +
    365 * jy2 +
    Math.floor(jy2 / 33) * 8 +
    Math.floor(((jy2 % 33) + 3) / 4) +
    jd +
    (jm < 6 ? jm * 31 : (jm - 6) * 30 + 186);

  gy = 400 * Math.floor(days / 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  gd = days + 1;
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) {
    gd -= sal_a[gm];
  }

  const result = new Date(gy, gm - 1, gd);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Returns today's date in Jalali format.
 */
export function getTodayJalali(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
}

/**
 * Checks if two Jalali dates are identical.
 */
export function isSameJalaliDay(
  a?: JalaliDate | null,
  b?: JalaliDate | null,
): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}
