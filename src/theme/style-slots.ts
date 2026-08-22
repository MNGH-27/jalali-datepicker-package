// src/theme/style-slots.ts
import type { CSSProperties } from "react";

export interface DatePickerSlots<T> {
  /** Root wrapper */
  root?: T;
  /** Trigger text input (for popover / modal) */
  input?: T;
  /** Wrapper around a masked trigger input */
  inputWrapper?: T;
  /** Clear button inside a masked trigger input */
  inputClearButton?: T;
  /** Floating / modal overlay calendar container */
  calendar?: T;
  /** Inner calendar body */
  calendarBody?: T;
  /** Wrapper for one or two month panes */
  calendarPanes?: T;
  /** A single month pane */
  calendarPane?: T;
  /** Divider between two month panes */
  paneDivider?: T;
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
  /** First cell in a selected range */
  rangeStartCell?: T;
  /** Last cell in a selected range */
  rangeEndCell?: T;
  /** Disabled day cell */
  disabledCell?: T;
  /** Day cell belonging to the previous/next month */
  outsideMonthCell?: T;
  /** Official holiday day cell */
  holidayCell?: T;
  /** Event dot indicator */
  eventBadge?: T;
  /** Wrapper around event dot indicators */
  eventBadges?: T;
  /** Embedded TimePicker container */
  timePicker?: T;
  /** TimePicker label */
  timeLabel?: T;
  /** TimePicker controls wrapper */
  timeControls?: T;
  /** Hour/minute/second select */
  timeSelect?: T;
  /** Separator between time segments */
  timeSeparator?: T;
  /** Month/year selection panel */
  monthYearPicker?: T;
  /** Horizontally scrollable year list */
  yearList?: T;
  /** A year option */
  yearButton?: T;
  /** The selected year option */
  selectedYearButton?: T;
  /** Month options grid */
  monthGrid?: T;
  /** A month option */
  monthButton?: T;
  /** The selected month option */
  selectedMonthButton?: T;
  /** Presets shortcut bar */
  presetsBar?: T;
  /** Built-in status & actions footer */
  footer?: T;
  /** Footer selection summary */
  footerStatus?: T;
  /** Footer action buttons wrapper */
  footerActions?: T;
  /** Today action button */
  todayButton?: T;
  /** Clear action button */
  clearButton?: T;
  /** Confirm action button */
  confirmButton?: T;
  /** Modal backdrop overlay */
  modalBackdrop?: T;
  /** Modal close button */
  closeButton?: T;
}

export type DatePickerClassNames = DatePickerSlots<string>;
export type DatePickerStyles = DatePickerSlots<CSSProperties>;
