import type {
  JalaliDate,
  JalaliMonthIndex,
  JalaliCalendarCell,
} from "../core/types";

export type InternalSelectedValue<M extends SelectionMode = "single"> =
  M extends "single"
    ? JalaliDate | null
    : M extends "range"
      ? JalaliDateRange
      : JalaliDate[];

export interface UseJalaliDatePickerOptions<
  M extends SelectionMode = "single",
> {
  mode?: M;
  value?: InternalSelectedValue<M>;
  defaultValue?: InternalSelectedValue<M>;
  initialViewDate?: JalaliDate;
  onChange?: (value: InternalSelectedValue<M>) => void;
  minDate?: JalaliDate;
  maxDate?: JalaliDate;
  isDateDisabled?: (date: JalaliDate) => boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}
/** Supported selection modes */
export type SelectionMode = "single" | "range" | "multiple";

/** Date range tuple representation */
export type DateRange = [Date | null, Date | null];
export type JalaliDateRange = [JalaliDate | null, JalaliDate | null];

/** Selection value types discriminated by mode */
export type DatePickerValue<M extends SelectionMode> = M extends "single"
  ? JalaliDate | null
  : M extends "range"
    ? JalaliDateRange
    : M extends "multiple"
      ? JalaliDate[]
      : never;

export type SelectedDateValue<M extends SelectionMode = "single"> =
  M extends "single" ? Date | null : M extends "range" ? DateRange : Date[];

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
