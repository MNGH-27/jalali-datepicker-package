// src/a11y/types.ts
import type { JalaliDate, JalaliMonthIndex } from "../core/types";

export interface NavigateOptions {
  currentFocused: JalaliDate;
  key: string;
  isRtl?: boolean;
}

export interface NavigationResult {
  nextDate: JalaliDate;
  viewChanged: boolean;
  handled: boolean;
}

export interface UseCalendarKeyboardProps {
  viewYear: number;
  viewMonth: JalaliMonthIndex;
  selectedDate?: JalaliDate | null;
  onSelectDate: (date: JalaliDate) => void;
  onViewChange: (year: number, month: JalaliMonthIndex) => void;
  isRtl?: boolean;
}
