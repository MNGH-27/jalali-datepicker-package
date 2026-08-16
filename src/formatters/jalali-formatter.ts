import type { JalaliDate } from "../core/types";
import { PERSIAN_MONTH_NAMES, PERSIAN_WEEK_DAYS_LONG } from "../core/constants";
import { jalaliToGregorian } from "../core/jalali-math";
import { toPersianDigits } from "./persian-digits";

export interface FormatJalaliOptions {
  /** Output digits format. Defaults to 'persian'. */
  digitType?: "persian" | "latin";
}

/**
 * Formats a JalaliDate using standard format pattern tokens:
 * - YYYY: 4-digit year (1405)
 * - YY: 2-digit year (05)
 * - MMMM: Full month name (فروردین)
 * - MM: 2-digit month (01-12)
 * - M: 1-digit month (1-12)
 * - dddd: Full weekday name (شنبه)
 * - DD: 2-digit day (01-31)
 * - D: 1-digit day (1-31)
 */
export function formatJalaliDate(
  date: JalaliDate | null | undefined,
  pattern = "YYYY/MM/DD",
  options: FormatJalaliOptions = {},
): string {
  if (!date) return "";

  const { digitType = "persian" } = options;

  const gregorian = jalaliToGregorian(date.year, date.month, date.day);
  const jsDay = gregorian.getDay();
  const jalaliDayOfWeek = (jsDay + 1) % 7;

  const yearStr = String(date.year);
  const shortYearStr = yearStr.slice(-2);
  const monthNum = date.month + 1;
  const monthStr = monthNum < 10 ? `0${monthNum}` : String(monthNum);
  const monthName = PERSIAN_MONTH_NAMES[date.month];
  const dayStr = date.day < 10 ? `0${date.day}` : String(date.day);
  const weekdayName = PERSIAN_WEEK_DAYS_LONG[jalaliDayOfWeek];

  let formatted = pattern
    .replace(/\bYYYY\b/g, yearStr)
    .replace(/\bYY\b/g, shortYearStr)
    .replace(/\bMMMM\b/g, monthName)
    .replace(/\bMM\b/g, monthStr)
    .replace(/\bM\b/g, String(monthNum))
    .replace(/\bdddd\b/g, weekdayName)
    .replace(/\bDD\b/g, dayStr)
    .replace(/\bD\b/g, String(date.day));

  if (digitType === "persian") {
    // Convert numeric matches while preserving month/weekday strings
    formatted = formatted.replace(/\d+/g, (num) => toPersianDigits(num));
  }

  return formatted;
}
