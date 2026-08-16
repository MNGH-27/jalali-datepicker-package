/**
 * Jalali month index: 0 (Farvardin) to 11 (Esfand).
 */
export type JalaliMonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Standard Day of Week where:
 * 0 = Saturday (شنبه), 1 = Sunday (یکشنبه), ..., 6 = Friday (جمعه)
 */
export type JalaliDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Clean data model for a Jalali date.
 */
export interface JalaliDate {
  year: number;
  month: JalaliMonthIndex; // 0-indexed (0 = Farvardin, 11 = Esfand)
  day: number; // 1-indexed (1 to 31)
}

/**
 * Representation of a single calendar cell in the Jalali grid.
 */
export interface JalaliCalendarCell {
  /** The calculated Jalali date values. */
  jalali: JalaliDate;
  /** The corresponding native JS Gregorian Date instance (useful for forms/APIs). */
  gregorianDate: Date;
  /** Numerical day of the Jalali month (1-31). */
  dayNumber: number;
  /** Whether the cell belongs to the currently viewed Jalali month. */
  isCurrentMonth: boolean;
  /** Whether this cell represents today in Jalali calendar. */
  isToday: boolean;
  /** Whether this cell matches the active selection. */
  isSelected: boolean;
  /** Whether this date is disabled according to min/max/custom rules. */
  isDisabled: boolean;
  /** Range selection indicators. */
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
}

/**
 * Configuration options for generating the Jalali month grid.
 */
export interface JalaliGridOptions {
  /** Jalali year (e.g. 1405). */
  year: number;
  /** Jalali month index (0 = Farvardin, 11 = Esfand). */
  month: JalaliMonthIndex;
  /** First day of week. Default is 0 (Saturday / شنبه). */
  firstDayOfWeek?: JalaliDayOfWeek;
  /** Selected Jalali date or Date object. */
  selectedDate?: Date | JalaliDate | null;
  /** Selected date range. */
  selectedRange?: [Date | JalaliDate | null, Date | JalaliDate | null];
  /** Minimum selectable date (Gregorian Date or JalaliDate). */
  minDate?: Date | JalaliDate;
  /** Maximum selectable date (Gregorian Date or JalaliDate). */
  maxDate?: Date | JalaliDate;
  /** Custom disable rule predicate. */
  isDateDisabled?: (jalali: JalaliDate, gregorian: Date) => boolean;
}
