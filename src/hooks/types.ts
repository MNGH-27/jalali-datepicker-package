import type {
  JalaliDate,
  JalaliMonthIndex,
  JalaliDayOfWeek,
  JalaliCalendarCell,
} from "../core/types";

/** Supported selection modes */
export type SelectionMode = "single" | "range" | "multiple";

/** Date range tuple representation */
export type JalaliDateRange = [JalaliDate | null, JalaliDate | null];

/** Selection value types discriminated by mode */
export type DatePickerValue<M extends SelectionMode> = M extends "single"
  ? JalaliDate | null
  : M extends "range"
    ? JalaliDateRange
    : M extends "multiple"
      ? JalaliDate[]
      : never;

/**
 * Configuration options for `useJalaliDatePicker`
 */
export interface UseJalaliDatePickerOptions<
  M extends SelectionMode = "single",
> {
  /** Mode of selection: 'single' (default), 'range', or 'multiple' */
  mode?: M;
  /** Controlled value */
  value?: DatePickerValue<M>;
  /** Default uncontrolled value */
  defaultValue?: DatePickerValue<M>;
  /** Callback fired when selection changes */
  onChange?: (value: DatePickerValue<M>) => void;
  /** Initial view month and year (defaults to selected date or current date) */
  initialViewDate?: { year: number; month: JalaliMonthIndex };
  /** First day of week (0 = Saturday/شنبه, 1 = Sunday/یکشنبه, etc.) */
  firstDayOfWeek?: JalaliDayOfWeek;
  /** Minimum selectable date (inclusive) */
  minDate?: Date | JalaliDate;
  /** Maximum selectable date (inclusive) */
  maxDate?: Date | JalaliDate;
  /** Custom function to determine if a specific date should be disabled */
  isDateDisabled?: (jalali: JalaliDate, gregorian: Date) => boolean;
}

/**
 * Return type of `useJalaliDatePicker`
 */
export interface UseJalaliDatePickerReturn<M extends SelectionMode = "single"> {
  /** Current selection value */
  selected: DatePickerValue<M>;
  /** Current visible calendar year */
  viewYear: number;
  /** Current visible calendar month index (0-11) */
  viewMonth: JalaliMonthIndex;
  /** Generated 42-cell matrix for current month with active states */
  grid: JalaliCalendarCell[];
  /** Hovered date during active range selection */
  hoverDate: JalaliDate | null;
  /** Navigate to previous month */
  goToPrevMonth: () => void;
  /** Navigate to next month */
  goToNextMonth: () => void;
  /** Jump directly to a specific year and month */
  setView: (year: number, month: JalaliMonthIndex) => void;
  /** Jump view to current month and year */
  goToToday: () => void;
  /** Select a specific date cell */
  selectDate: (date: JalaliDate) => void;
  /** Set hover state for date range preview */
  setHoverDate: (date: JalaliDate | null) => void;
  /** Clear selection */
  clear: () => void;
  /** Helpers */
  isDateSelected: (date: JalaliDate) => boolean;
}
