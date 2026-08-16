import { useState, useCallback, useMemo } from "react";
import type {
  UseJalaliDatePickerOptions,
  SelectionMode,
  InternalSelectedValue,
  JalaliDateRange,
} from "./types";
import type { JalaliDate, JalaliMonthIndex } from "../core/types";
import { getTodayJalali, isSameJalaliDay } from "../core/jalali-math";
import { generateJalaliCalendarGrid } from "../core/calendar-grid";
import { isJalaliDateBetween } from "../core/jalali-helpers";

export function useJalaliDatePicker<M extends SelectionMode = "single">(
  options: UseJalaliDatePickerOptions<M> = {},
) {
  const {
    mode = "single" as M,
    value: controlledValue,
    defaultValue,
    initialViewDate,
    onChange,
    minDate,
    maxDate,
    isDateDisabled,
    firstDayOfWeek = 0,
  } = options;

  const today = useMemo(() => getTodayJalali(), []);

  const [internalValue, setInternalValue] = useState<InternalSelectedValue<M>>(
    () => {
      if (defaultValue !== undefined) return defaultValue;
      if (mode === "single") return null as InternalSelectedValue<M>;
      if (mode === "range")
        return [null, null] as unknown as InternalSelectedValue<M>;
      return [] as unknown as InternalSelectedValue<M>;
    },
  );

  const selected =
    controlledValue !== undefined ? controlledValue : internalValue;

  const [viewYear, setViewYear] = useState<number>(() => {
    if (initialViewDate) return initialViewDate.year;
    if (defaultValue && !Array.isArray(defaultValue))
      return (defaultValue as JalaliDate).year;
    return today.year;
  });

  const [viewMonth, setViewMonth] = useState<JalaliMonthIndex>(() => {
    if (initialViewDate) return initialViewDate.month;
    if (defaultValue && !Array.isArray(defaultValue))
      return (defaultValue as JalaliDate).month;
    return today.month;
  });

  const [hoverDate, setHoverDate] = useState<JalaliDate | null>(null);

  const setView = useCallback((year: number, month: JalaliMonthIndex) => {
    setViewYear(year);
    setViewMonth(month);
  }, []);

  const goToPrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => (m - 1) as JalaliMonthIndex);
    }
  }, [viewMonth]);

  const goToNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => (m + 1) as JalaliMonthIndex);
    }
  }, [viewMonth]);

  const goToToday = useCallback(() => {
    const t = getTodayJalali();
    setViewYear(t.year);
    setViewMonth(t.month);
  }, []);

  const selectDate = useCallback(
    (date: JalaliDate) => {
      let nextValue: InternalSelectedValue<M>;

      if (mode === "single") {
        nextValue = date as InternalSelectedValue<M>;
      } else if (mode === "range") {
        const currentRange = (selected as JalaliDateRange) || [null, null];
        const [start, end] = currentRange;

        if (!start || (start && end)) {
          nextValue = [date, null] as unknown as InternalSelectedValue<M>;
        } else {
          if (
            date.year < start.year ||
            (date.year === start.year && date.month < start.month) ||
            (date.year === start.year &&
              date.month === start.month &&
              date.day < start.day)
          ) {
            nextValue = [date, start] as unknown as InternalSelectedValue<M>;
          } else {
            nextValue = [start, date] as unknown as InternalSelectedValue<M>;
          }
        }
      } else {
        const currentList = (selected as JalaliDate[]) || [];
        const exists = currentList.some((d) => isSameJalaliDay(d, date));
        if (exists) {
          nextValue = currentList.filter(
            (d) => !isSameJalaliDay(d, date),
          ) as InternalSelectedValue<M>;
        } else {
          nextValue = [...currentList, date] as InternalSelectedValue<M>;
        }
      }

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [mode, selected, controlledValue, onChange],
  );

  const clear = useCallback(() => {
    const emptyValue = (
      mode === "single" ? null : mode === "range" ? [null, null] : []
    ) as InternalSelectedValue<M>;

    if (controlledValue === undefined) {
      setInternalValue(emptyValue);
    }
    onChange?.(emptyValue);
  }, [mode, controlledValue, onChange]);

  const grid = useMemo(() => {
    const rawGrid = generateJalaliCalendarGrid({
      year: viewYear,
      month: viewMonth,
      firstDayOfWeek,
      minDate,
      maxDate,
      isDateDisabled,
    });

    if (mode === "single") {
      const singleSelected = selected as JalaliDate | null;
      return rawGrid.map((cell) => ({
        ...cell,
        isSelected: singleSelected
          ? isSameJalaliDay(cell.jalali, singleSelected)
          : false,
      }));
    }

    if (mode === "range") {
      const [start, end] = (selected as JalaliDateRange) || [null, null];
      const effectiveEnd = end ?? (start && hoverDate ? hoverDate : null);

      return rawGrid.map((cell) => {
        const isStart = start ? isSameJalaliDay(cell.jalali, start) : false;
        const isEnd = effectiveEnd
          ? isSameJalaliDay(cell.jalali, effectiveEnd)
          : false;
        let inRange = false;
        if (start && effectiveEnd) {
          inRange = isJalaliDateBetween(cell.jalali, start, effectiveEnd);
        }
        return {
          ...cell,
          isSelected: isStart || isEnd,
          isInRange: inRange,
          isRangeStart: isStart,
          isRangeEnd: isEnd,
        };
      });
    }

    if (mode === "multiple") {
      const list = (selected as JalaliDate[]) || [];
      return rawGrid.map((cell) => ({
        ...cell,
        isSelected: list.some((d) => isSameJalaliDay(d, cell.jalali)),
      }));
    }

    return rawGrid;
  }, [
    viewYear,
    viewMonth,
    firstDayOfWeek,
    minDate,
    maxDate,
    isDateDisabled,
    mode,
    selected,
    hoverDate,
  ]);

  return {
    selected,
    viewYear,
    viewMonth,
    grid,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    setView,
    selectDate,
    setHoverDate,
    hoverDate,
    clear,
  };
}
