// src/theme/style-slots.ts
import type { CSSProperties } from "react";

export interface DatePickerSlots<T> {
  /** Root wrapper */
  root?: T;
  /** Trigger text input (for popover / modal) */
  input?: T;
  /** Floating / modal overlay calendar container */
  calendar?: T;
  /** Header bar with month/year and arrows */
  header?: T;
  /** Header title button */
  headerTitle?: T;
  /** Prev/Next navigation buttons */
  navButton?: T;
  /** Weekday row wrapper */
  weekdays?: T;
  /** Weekday cell header */
  weekdayCell?: T;
  /** Calendar grid container (7 columns) */
  grid?: T;
  /** Standard day cell button */
  dayCell?: T;
  /** Today day cell */
  todayCell?: T;
  /** Selected day cell */
  selectedCell?: T;
  /** Cells between selected range */
  rangeBetweenCell?: T;
  /** Disabled day cell */
  disabledCell?: T;
  /** Official holiday day cell */
  holidayCell?: T;
  /** Event dot indicator */
  eventBadge?: T;
  /** Embedded TimePicker container */
  timePicker?: T;
  /** Presets shortcut bar */
  presetsBar?: T;
  /** Built-in status & actions footer */
  footer?: T;
  /** Modal backdrop overlay */
  modalBackdrop?: T;
}

export type DatePickerClassNames = DatePickerSlots<string>;
export type DatePickerStyles = DatePickerSlots<CSSProperties>;
