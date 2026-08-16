import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../../theme/style-slots";

/**
 * Jalali time data structure (hour, minute, second).
 */
export interface JalaliTime {
  /** Hour in 24-hour format (0 to 23). */
  hour: number;
  /** Minute (0 to 59). */
  minute: number;
  /** Second (0 to 59) - optional. */
  second?: number;
}

/**
 * Props for the TimePicker component.
 */
export interface TimePickerProps {
  /** Currently selected time (controlled mode). */
  value?: JalaliTime | null;
  /** Initial default time (uncontrolled mode). */
  defaultValue?: JalaliTime;
  /** Callback triggered when time changes. */
  onChange?: (time: JalaliTime) => void;
  /** Step increment for minutes (default: 1, common values: 5, 15, 30). */
  minuteStep?: number;
  /** Step increment for hours (default: 1). */
  hourStep?: number;
  /** Whether to render the seconds selector segment. */
  showSeconds?: boolean;
  /** Format of rendered digits ('persian' or 'latin'). */
  digitType?: "persian" | "latin";
  /** Whether the time picker is disabled. */
  disabled?: boolean;

  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}
