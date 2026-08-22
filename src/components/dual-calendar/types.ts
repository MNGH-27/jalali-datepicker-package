import type {
  JalaliDate,
  JalaliMonthIndex,
  JalaliDayOfWeek,
} from "../../core/types";
import type { JalaliDateRange } from "../../hooks/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../../theme/style-slots";

/**
 * Props for the DualMonthCalendar component.
 */
export interface DualMonthCalendarProps {
  /** Selected date range [start, end]. */
  value?: JalaliDateRange;
  /** Default uncontrolled range value. */
  defaultValue?: JalaliDateRange;
  /** Callback fired when range changes. */
  onChange?: (range: JalaliDateRange) => void;
  /** Initial view date (defaults to current date or range start). */
  initialViewDate?: { year: number; month: JalaliMonthIndex };
  /** First day of week (0 = Saturday / شنبه). */
  firstDayOfWeek?: JalaliDayOfWeek;
  /** Output digit type for day numbers. */
  digitType?: "persian" | "latin";
  /** Minimum selectable date (inclusive). */
  minDate?: Date | JalaliDate;
  /** Maximum selectable date (inclusive). */
  maxDate?: Date | JalaliDate;
  /** Custom disable rule predicate. */
  isDateDisabled?: (jalali: JalaliDate, gregorian: Date) => boolean;
  /** Layout direction. */
  direction?: "rtl" | "ltr";
  className?: string;
  style?: React.CSSProperties;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}
