import { useState, useMemo, useCallback } from "react";
import type {
  JalaliDate,
  JalaliMonthIndex,
  JalaliCalendarCell,
} from "../core/types";
import type {
  UseJalaliDatePickerOptions,
  UseJalaliDatePickerReturn,
  SelectionMode,
  DatePickerValue,
  JalaliDateRange,
} from "./types";
import { getTodayJalali, isSameJalaliDay } from "../core/jalali-math";
import { generateJalaliCalendarGrid } from "../core/calendar-grid";
import {
  compareJalaliDates,
  isJalaliDateBetween,
} from "../core/jalali-helpers";

export function useJalaliDatePicker<M extends SelectionMode = "single">(
  options: UseJalaliDatePickerOptions<M> = {},
): UseJalaliDatePickerReturn<M> {
  const {
    mode = "single" as M,
    value: controlledValue,
    defaultValue,
    onChange,
    initialViewDate,
    firstDayOfWeek = 0,
    minDate,
    maxDate,
    isDateDisabled,
  } = options;

  // 1. Selection State (Controlled vs Uncontrolled)
  const [internalValue, setInternalValue] = useState<DatePickerValue<M>>(() => {
    if (defaultValue !== undefined) return defaultValue;
    if (mode === "single") return null as DatePickerValue<M>;
    if (mode === "range") return [null, null] as DatePickerValue<M>;
    return [] as unknown as DatePickerValue<M>;
  });

  const selected = (
    controlledValue !== undefined ? controlledValue : internalValue
  ) as DatePickerValue<M>;

  // 2. Range Hover State (for dynamic preview)
  const [hoverDate, setHoverDate] = useState<JalaliDate | null>(null);

  // 3. Active View (Month & Year)
  const today = useMemo(() => getTodayJalali(), []);
  const [viewState, setViewState] = useState<{
    year: number;
    month: JalaliMonthIndex;
  }>(() => {
    if (initialViewDate) return initialViewDate;
    if (mode === "single" && selected)
      return {
        year: (selected as JalaliDate).year,
        month: (selected as JalaliDate).month,
      };
    if (mode === "range" && (selected as JalaliDateRange)?.[0]) {
      const start = (selected as JalaliDateRange)[0]!;
      return { year: start.year, month: start.month };
    }
    return { year: today.year, month: today.month };
  });

  // 4. View Navigation
  const goToNextMonth = useCallback(() => {
    setViewState((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: (prev.month + 1) as JalaliMonthIndex };
    });
  }, []);

  const goToPrevMonth = useCallback(() => {
    setViewState((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: (prev.month - 1) as JalaliMonthIndex };
    });
  }, []);

  const setView = useCallback((year: number, month: JalaliMonthIndex) => {
    setViewState({ year, month });
  }, []);

  const goToToday = useCallback(() => {
    setViewState({ year: today.year, month: today.month });
  }, [today]);

  // 5. Selection Checks
  const isDateSelected = useCallback(
    (target: JalaliDate): boolean => {
      if (mode === "single") {
        return isSameJalaliDay(selected as JalaliDate | null, target);
      }
      if (mode === "range") {
        const [start, end] = (selected as JalaliDateRange) || [null, null];
        return isSameJalaliDay(start, target) || isSameJalaliDay(end, target);
      }
      if (mode === "multiple") {
        const list = (selected as JalaliDate[]) || [];
        return list.some((d) => isSameJalaliDay(d, target));
      }
      return false;
    },
    [mode, selected],
  );

  // 6. Selection Handler
  const updateSelection = useCallback(
    (newValue: DatePickerValue<M>) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [controlledValue, onChange],
  );

  const selectDate = useCallback(
    (target: JalaliDate) => {
      if (mode === "single") {
        updateSelection(target as DatePickerValue<M>);
      } else if (mode === "multiple") {
        const currentList = (selected as JalaliDate[]) || [];
        const exists = currentList.some((d) => isSameJalaliDay(d, target));
        const updated = exists
          ? currentList.filter((d) => !isSameJalaliDay(d, target))
          : [...currentList, target].sort(compareJalaliDates);
        updateSelection(updated as unknown as DatePickerValue<M>);
      } else if (mode === "range") {
        const [start, end] = (selected as JalaliDateRange) || [null, null];

        // Step 1: Start fresh range
        if (!start || (start && end)) {
          updateSelection([target, null] as unknown as DatePickerValue<M>);
        }
        // Step 2: Complete existing range
        else {
          if (compareJalaliDates(target, start) < 0) {
            // Target is earlier than start: make target the start date
            updateSelection([target, start] as unknown as DatePickerValue<M>);
          } else {
            updateSelection([start, target] as unknown as DatePickerValue<M>);
          }
          setHoverDate(null);
        }
      }
    },
    [mode, selected, updateSelection],
  );

  const clear = useCallback(() => {
    if (mode === "single") updateSelection(null as DatePickerValue<M>);
    else if (mode === "range")
      updateSelection([null, null] as unknown as DatePickerValue<M>);
    else updateSelection([] as unknown as DatePickerValue<M>);
  }, [mode, updateSelection]);

  // 7. Month Grid Construction with Range & Multiple Metadata
  const rawGrid = useMemo(() => {
    return generateJalaliCalendarGrid({
      year: viewState.year,
      month: viewState.month,
      firstDayOfWeek,
      minDate,
      maxDate,
      isDateDisabled,
    });
  }, [
    viewState.year,
    viewState.month,
    firstDayOfWeek,
    minDate,
    maxDate,
    isDateDisabled,
  ]);

  // Enrich cells with active selection/range flags
  const grid = useMemo((): JalaliCalendarCell[] => {
    const rangeStart =
      mode === "range" ? (selected as JalaliDateRange)?.[0] : null;
    const rangeEnd =
      mode === "range" ? (selected as JalaliDateRange)?.[1] : null;
    const effectiveEnd =
      rangeEnd ?? (rangeStart && hoverDate ? hoverDate : null);

    return rawGrid.map((cell) => {
      const isSelected = isDateSelected(cell.jalali);
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;

      if (mode === "range" && rangeStart) {
        isRangeStart = isSameJalaliDay(cell.jalali, rangeStart);
        isRangeEnd = effectiveEnd
          ? isSameJalaliDay(cell.jalali, effectiveEnd)
          : false;

        if (effectiveEnd) {
          isInRange = isJalaliDateBetween(
            cell.jalali,
            rangeStart,
            effectiveEnd,
          );
        }
      }

      return {
        ...cell,
        isSelected,
        isInRange,
        isRangeStart,
        isRangeEnd,
      };
    });
  }, [rawGrid, mode, selected, hoverDate, isDateSelected]);

  return {
    selected,
    viewYear: viewState.year,
    viewMonth: viewState.month,
    grid,
    goToPrevMonth,
    goToNextMonth,
    setView,
    goToToday,
    selectDate,
    setHoverDate,
    clear,
    isDateSelected,
    hoverDate,
  };
}
