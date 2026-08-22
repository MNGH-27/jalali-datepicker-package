import type { JalaliDate } from "../../core/types";

/**
 * Validation error codes emitted on invalid manual input.
 */
export type DateValidationError =
  | "INVALID_FORMAT"
  | "INVALID_MONTH"
  | "INVALID_DAY"
  | "OUT_OF_MIN_BOUNDS"
  | "OUT_OF_MAX_BOUNDS"
  | "DISABLED_DATE";

/**
 * Result structure returned by the date parser.
 */
export interface DateParseResult {
  isValid: boolean;
  date: JalaliDate | null;
  error?: DateValidationError;
}

/**
 * Props for the MaskedDateInput component.
 */
export interface MaskedDateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> {
  /** Controlled Jalali date value. */
  value?: JalaliDate | null;
  /** Default uncontrolled Jalali date value. */
  defaultValue?: JalaliDate | null;
  /** Callback fired when a valid date is typed or cleared. */
  onChange?: (date: JalaliDate | null) => void;
  /** Callback fired on validation state change. */
  onValidationError?: (error: DateValidationError | null) => void;
  /** Output digit presentation ('persian' or 'latin'). Defaults to 'persian'. */
  digitType?: "persian" | "latin";
  /** Minimum selectable date constraint (inclusive). */
  minDate?: JalaliDate;
  /** Maximum selectable date constraint (inclusive). */
  maxDate?: JalaliDate;
  /** Custom disable rule predicate. */
  isDateDisabled?: (date: JalaliDate) => boolean;
  /** Whether the input allows a clear button (X icon). */
  clearable?: boolean;
  /** Layout direction. */
  direction?: "rtl" | "ltr";
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  clearButtonClassName?: string;
  clearButtonStyle?: React.CSSProperties;
}
