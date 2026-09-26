import type { JalaliDate, JalaliMonthIndex } from "./types";
import { compareJalaliDates } from "./jalali-helpers";
import { getDaysInJalaliMonth } from "./jalali-math";

export interface JalaliDateConstraints {
  minDate?: JalaliDate;
  maxDate?: JalaliDate;
  isDateDisabled?: (date: JalaliDate) => boolean;
}

export function isJalaliDateSelectable(
  date: JalaliDate,
  constraints: JalaliDateConstraints = {},
): boolean {
  const { minDate, maxDate, isDateDisabled } = constraints;
  if (minDate && compareJalaliDates(date, minDate) < 0) return false;
  if (maxDate && compareJalaliDates(date, maxDate) > 0) return false;
  return !isDateDisabled?.(date);
}

export function isJalaliMonthSelectable(
  year: number,
  month: JalaliMonthIndex,
  constraints: JalaliDateConstraints = {},
): boolean {
  const firstDay: JalaliDate = { year, month, day: 1 };
  const lastDay: JalaliDate = {
    year,
    month,
    day: getDaysInJalaliMonth(year, month),
  };

  if (
    (constraints.minDate &&
      compareJalaliDates(lastDay, constraints.minDate) < 0) ||
    (constraints.maxDate &&
      compareJalaliDates(firstDay, constraints.maxDate) > 0)
  ) {
    return false;
  }

  if (!constraints.isDateDisabled) return true;
  for (let day = 1; day <= lastDay.day; day += 1) {
    if (isJalaliDateSelectable({ year, month, day }, constraints)) return true;
  }
  return false;
}

export function isJalaliYearSelectable(
  year: number,
  constraints: JalaliDateConstraints = {},
): boolean {
  for (let month = 0; month < 12; month += 1) {
    if (
      isJalaliMonthSelectable(
        year,
        month as JalaliMonthIndex,
        constraints,
      )
    ) {
      return true;
    }
  }
  return false;
}
