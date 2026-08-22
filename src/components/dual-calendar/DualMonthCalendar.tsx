import React, { useState, useMemo, useCallback } from "react";
import type { DualMonthCalendarProps } from "./types";
import type {
  JalaliDate,
  JalaliMonthIndex,
  JalaliCalendarCell,
} from "../../core/types";
import type { JalaliDateRange } from "../../hooks/types";
import { getTodayJalali, isSameJalaliDay } from "../../core/jalali-math";
import { generateJalaliCalendarGrid } from "../../core/calendar-grid";
import {
  compareJalaliDates,
  isJalaliDateBetween,
} from "../../core/jalali-helpers";
import { PERSIAN_MONTH_NAMES } from "../../core/constants";
import { toPersianDigits } from "../../formatters/persian-digits";
import { Weekdays } from "../Weekdays";
import { DayCell } from "../DayCell";
import { useTheme } from "../../theme/ThemeProvider";
import { mergeClassNames } from "../../theme/style-utils";

export const DualMonthCalendar: React.FC<DualMonthCalendarProps> = ({
  value,
  defaultValue = [null, null],
  onChange,
  initialViewDate,
  firstDayOfWeek = 0,
  digitType = "persian",
  minDate,
  maxDate,
  isDateDisabled,
  direction = "rtl",
  className,
  style,
  classNames,
  styles,
}) => {
  const { theme } = useTheme();
  // 1. Selection State (Controlled vs Uncontrolled)
  const [internalRange, setInternalRange] =
    useState<JalaliDateRange>(defaultValue);
  const activeRange = value !== undefined ? value : internalRange;

  // 2. Hover state for range preview
  const [hoveredDate, setHoveredDate] = useState<JalaliDate | null>(null);
  const formatNumber = (value: number) =>
    digitType === "persian" ? toPersianDigits(value) : String(value);

  // 3. View state for First Month (Left)
  const today = useMemo(() => getTodayJalali(), []);
  const [viewState, setViewState] = useState<{
    year: number;
    month: JalaliMonthIndex;
  }>(() => {
    if (initialViewDate) return initialViewDate;
    if (activeRange[0])
      return { year: activeRange[0].year, month: activeRange[0].month };
    return { year: today.year, month: today.month };
  });

  // Calculate Second Month (Right)
  const nextMonthState = useMemo<{
    year: number;
    month: JalaliMonthIndex;
  }>(() => {
    if (viewState.month === 11) {
      return { year: viewState.year + 1, month: 0 };
    }
    return {
      year: viewState.year,
      month: (viewState.month + 1) as JalaliMonthIndex,
    };
  }, [viewState]);

  // 4. Synchronized Navigation (moves both months together)
  const handlePrevMonth = () => {
    setViewState((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: (prev.month - 1) as JalaliMonthIndex };
    });
  };

  const handleNextMonth = () => {
    setViewState((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: (prev.month + 1) as JalaliMonthIndex };
    });
  };

  // 5. Date Selection Handler
  const handleDateSelect = useCallback(
    (target: JalaliDate) => {
      const [start, end] = activeRange;
      let newRange: JalaliDateRange;

      if (!start || (start && end)) {
        newRange = [target, null];
      } else {
        if (compareJalaliDates(target, start) < 0) {
          newRange = [target, start];
        } else {
          newRange = [start, target];
        }
        setHoveredDate(null);
      }

      if (value === undefined) {
        setInternalRange(newRange);
      }
      onChange?.(newRange);
    },
    [activeRange, value, onChange],
  );

  // 6. Enrich cells with cross-month range metadata
  const enrichGridCells = useCallback(
    (year: number, month: JalaliMonthIndex): JalaliCalendarCell[] => {
      const rawGrid = generateJalaliCalendarGrid({
        year,
        month,
        firstDayOfWeek,
        minDate,
        maxDate,
        isDateDisabled,
      });

      const [start, end] = activeRange;
      const effectiveEnd = end ?? (start && hoveredDate ? hoveredDate : null);

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
    },
    [
      firstDayOfWeek,
      minDate,
      maxDate,
      isDateDisabled,
      activeRange,
      hoveredDate,
    ],
  );

  const leftGrid = useMemo(
    () => enrichGridCells(viewState.year, viewState.month),
    [enrichGridCells, viewState.year, viewState.month],
  );

  const rightGrid = useMemo(
    () => enrichGridCells(nextMonthState.year, nextMonthState.month),
    [enrichGridCells, nextMonthState.year, nextMonthState.month],
  );

  const renderMonthPane = (
    year: number,
    month: JalaliMonthIndex,
    grid: JalaliCalendarCell[],
    isLeftPane: boolean,
  ) => (
    <div
      dir={direction}
      className={classNames?.calendarPane}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "var(--pdp-calendar-pane-width, 276px)",
        minWidth: "var(--pdp-calendar-pane-width, 276px)",
        ...styles?.calendarPane,
      }}
    >
      {/* Pane Header */}
      <div
        className={classNames?.header}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
          height: "32px",
          ...styles?.header,
        }}
      >
        {isLeftPane ? (
          <button
            type="button"
            aria-label="ماه قبل"
            onClick={handlePrevMonth}
            className={classNames?.navButton}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              cursor: "pointer",
              ...styles?.navButton,
            }}
          >
            {direction === "rtl" ? "›" : "‹"}
          </button>
        ) : (
          <div style={{ width: "28px" }} />
        )}

        <div
          style={{
            fontWeight: 600,
            fontSize: "14px",
            color: theme.colors.textPrimary,
          }}
        >
          {PERSIAN_MONTH_NAMES[month]} {formatNumber(year)}
        </div>

        {!isLeftPane ? (
          <button
            type="button"
            aria-label="ماه بعد"
            onClick={handleNextMonth}
            className={classNames?.navButton}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              cursor: "pointer",
              ...styles?.navButton,
            }}
          >
            {direction === "rtl" ? "‹" : "›"}
          </button>
        ) : (
          <div style={{ width: "28px" }} />
        )}
      </div>

      <Weekdays
        firstDayOfWeek={firstDayOfWeek}
        direction={direction}
        classNames={classNames}
        styles={styles}
      />

      {/* Grid */}
      <div
        role="grid"
        aria-label={`${PERSIAN_MONTH_NAMES[month]} ${formatNumber(year)}`}
        dir={direction}
        className={classNames?.grid}
        style={{
          display: "grid",
          width: "var(--pdp-calendar-pane-width, 276px)",
          gridTemplateColumns: "repeat(7, var(--pdp-cell-size, 36px))",
          gap: "var(--pdp-cell-gap, 4px)",
          ...styles?.grid,
        }}
      >
        {grid.map((cell) => (
          <DayCell
            key={`${cell.jalali.year}-${cell.jalali.month}-${cell.jalali.day}`}
            cell={cell}
            digitType={digitType}
            classNames={classNames}
            styles={styles}
            tabIndex={0}
            onSelect={handleDateSelect}
            onHover={setHoveredDate}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      role="region"
      aria-label="تقویم دوقلو شمسی"
      dir={direction}
      className={mergeClassNames(className, classNames?.calendar)}
      style={{
        "--pdp-cell-size": "36px",
        "--pdp-cell-gap": "4px",
        "--pdp-calendar-pane-width": "276px",
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        padding: "16px",
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        borderRadius: theme.radii.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.lg,
        width: "fit-content",
        ...style,
        ...styles?.calendar,
      } as React.CSSProperties}
    >
      {renderMonthPane(viewState.year, viewState.month, leftGrid, true)}
      <div
        className={classNames?.paneDivider}
        style={{
          width: "1px",
          backgroundColor: theme.colors.border,
          ...styles?.paneDivider,
        }}
      />
      {renderMonthPane(
        nextMonthState.year,
        nextMonthState.month,
        rightGrid,
        false,
      )}
    </div>
  );
};
