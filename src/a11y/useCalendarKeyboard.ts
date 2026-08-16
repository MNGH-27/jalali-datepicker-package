import { useState, useCallback } from "react";
import type { JalaliDate } from "../core/types";
import { calculateNextFocusedDate } from "./keyboard-navigation";
import { isSameJalaliDay } from "../core/jalali-math";
import type { UseCalendarKeyboardProps } from "./types";

export function useCalendarKeyboard(props: UseCalendarKeyboardProps) {
  const {
    viewYear,
    viewMonth,
    selectedDate,
    onSelectDate,
    onViewChange,
    isRtl = true,
  } = props;

  const [focusedDate, setFocusedDate] = useState<JalaliDate>(() => {
    return selectedDate ?? { year: viewYear, month: viewMonth, day: 1 };
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectDate(focusedDate);
        return;
      }

      const result = calculateNextFocusedDate({
        currentFocused: focusedDate,
        key: e.key,
        isRtl,
      });

      if (result.handled) {
        e.preventDefault();
        setFocusedDate(result.nextDate);

        if (result.viewChanged) {
          onViewChange(result.nextDate.year, result.nextDate.month);
        }
      }
    },
    [focusedDate, isRtl, onSelectDate, onViewChange],
  );

  const getCellTabIndex = useCallback(
    (cellDate: JalaliDate): number => {
      return isSameJalaliDay(cellDate, focusedDate) ? 0 : -1;
    },
    [focusedDate],
  );

  return {
    focusedDate,
    setFocusedDate,
    handleKeyDown,
    getCellTabIndex,
  };
}
