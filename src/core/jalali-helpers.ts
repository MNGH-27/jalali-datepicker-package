import type { JalaliDate, JalaliDayOfWeek, JalaliMonthIndex } from "./types";
import {
  jalaliToGregorian,
  gregorianToJalali,
  getDaysInJalaliMonth,
} from "./jalali-math";

export function jsDateToJalali(d: Date): JalaliDate {
  return gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function jalaliToJsDate(
  j: JalaliDate,
  hours = 0,
  minutes = 0,
  seconds = 0,
): Date {
  const g = jalaliToGregorian(j.year, j.month, j.day);
  g.setHours(hours, minutes, seconds, 0);
  return g;
}

/**
 * Calculates day of week in Jalali calendar (0 = شنبه, ..., 6 = جمعه).
 */
export function getJalaliDayOfWeek(
  year: number,
  month: number,
  day: number,
): JalaliDayOfWeek {
  const g = jalaliToGregorian(year, month as JalaliMonthIndex, day);
  const jsDay = g.getDay(); // 0 = Sunday, 6 = Saturday
  return ((jsDay + 1) % 7) as JalaliDayOfWeek;
}

/**
 * Adds or subtracts days to/from a Jalali date across month/year boundaries.
 */
export function addDaysToJalali(date: JalaliDate, days: number): JalaliDate {
  const g = jalaliToGregorian(date.year, date.month, date.day);
  g.setDate(g.getDate() + days);
  // تبدیل getMonth() از 0-indexed به 1-indexed برای gregorianToJalali
  return gregorianToJalali(g.getFullYear(), g.getMonth() + 1, g.getDate());
}

/**
 * Alias for addDaysToJalali
 */
export const addJalaliDays = addDaysToJalali;

/**
 * Compares two Jalali dates:
 * - Returns -1 if d1 < d2
 * - Returns 1 if d1 > d2
 * - Returns 0 if d1 == d2
 */
export function compareJalaliDates(d1: JalaliDate, d2: JalaliDate): number {
  if (d1.year !== d2.year) return d1.year < d2.year ? -1 : 1;
  if (d1.month !== d2.month) return d1.month < d2.month ? -1 : 1;
  if (d1.day !== d2.day) return d1.day < d2.day ? -1 : 1;
  return 0;
}

/**
 * Checks if a target date falls strictly or inclusively between two dates.
 */
export function isJalaliDateBetween(
  target: JalaliDate,
  start: JalaliDate,
  end: JalaliDate,
  inclusive = true,
): boolean {
  const minDate = compareJalaliDates(start, end) <= 0 ? start : end;
  const maxDate = compareJalaliDates(start, end) <= 0 ? end : start;

  const cmpMin = compareJalaliDates(target, minDate);
  const cmpMax = compareJalaliDates(target, maxDate);

  if (inclusive) {
    return cmpMin >= 0 && cmpMax <= 0;
  }
  return cmpMin > 0 && cmpMax < 0;
}

/**
 * Calculates the full Jalali week range starting Saturday and ending Friday.
 */
export function getJalaliWeekRange(date: JalaliDate): [JalaliDate, JalaliDate] {
  const dayOfWeek = getJalaliDayOfWeek(date.year, date.month, date.day);
  const startOfWeek = addDaysToJalali(date, -dayOfWeek); // شنبه
  const endOfWeek = addDaysToJalali(startOfWeek, 6); // جمعه
  return [startOfWeek, endOfWeek];
}

/**
 * Calculates full month range from day 1 to last day of that month.
 */
export function getJalaliMonthRange(
  date: JalaliDate,
): [JalaliDate, JalaliDate] {
  const daysInMonth = getDaysInJalaliMonth(date.year, date.month);
  const start: JalaliDate = { year: date.year, month: date.month, day: 1 };
  const end: JalaliDate = {
    year: date.year,
    month: date.month,
    day: daysInMonth,
  };
  return [start, end];
}
