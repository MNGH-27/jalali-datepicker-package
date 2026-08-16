import type { JalaliDate } from "../../core/types";
import type { JalaliDateRange } from "../../hooks/types";
import type { JalaliTime } from "../../plugins/time-picker/types";

export interface CalendarFooterProps {
  /** Selected single date */
  selectedDate?: JalaliDate | null;
  /** Selected date range */
  selectedRange?: JalaliDateRange;
  /** Selected multiple dates */
  selectedDates?: JalaliDate[];
  /** Selected time if time picker is active */
  selectedTime?: JalaliTime | null;
  /** Current selection mode */
  mode?: "single" | "range" | "multiple";
  /** Number display format */
  digitType?: "persian" | "latin";
  /** Custom text/template or boolean to toggle status text */
  showStatusText?: boolean;
  /** Show action buttons (Clear, Today, Submit) */
  showActions?: boolean;
  /** Callback for 'Today' action */
  onToday?: () => void;
  /** Callback for 'Clear' action */
  onClear?: () => void;
  /** Callback for 'Confirm/Apply' action */
  onConfirm?: () => void;
}
