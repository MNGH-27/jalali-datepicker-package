import type { JalaliDate } from "../core/types";
import { PERSIAN_MONTH_NAMES, PERSIAN_WEEK_DAYS_LONG } from "../core/constants";
import { jalaliToGregorian } from "../core/jalali-math";

/**
 * Creates an accessible full Persian string for screen readers.
 * Example: "شنبه، ۱ فروردین ۱۴۰۵"
 */
export function getAriaDayLabel(date: JalaliDate): string {
  const gregorian = jalaliToGregorian(date.year, date.month, date.day);
  const jsDay = gregorian.getDay();
  const jalaliDayOfWeek = (jsDay + 1) % 7; // 0 = Sat, 1 = Sun, ...

  const weekDayName = PERSIAN_WEEK_DAYS_LONG[jalaliDayOfWeek];
  const monthName = PERSIAN_MONTH_NAMES[date.month];

  return `${weekDayName}، ${date.day} ${monthName} ${date.year}`;
}
