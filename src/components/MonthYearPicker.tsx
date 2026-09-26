// src/components/MonthYearPicker.tsx
import React, { useState } from "react";
import { PERSIAN_MONTH_NAMES } from "../core/constants";
import { toPersianDigits } from "../formatters/persian-digits";
import type { JalaliDate, JalaliMonthIndex } from "../core/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";
import {
  isJalaliMonthSelectable,
  isJalaliYearSelectable,
  type JalaliDateConstraints,
} from "../core/date-availability";
import { mergeClassNames } from "../theme/style-utils";

export interface MonthYearPickerProps {
  currentYear: number;
  currentMonth: number;
  onSelectMonth: (month: JalaliMonthIndex) => void;
  onSelectYear: (year: number) => void;
  minDate?: JalaliDate;
  maxDate?: JalaliDate;
  isDateDisabled?: (date: JalaliDate) => boolean;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  currentYear,
  currentMonth,
  onSelectMonth,
  onSelectYear,
  minDate,
  maxDate,
  isDateDisabled,
  classNames,
  styles,
}) => {
  const [viewLevel, setViewLevel] = useState<"months" | "years">("months");
  const [decadeStartYear, setDecadeStartYear] = useState<number>(
    () => Math.floor(currentYear / 10) * 10,
  );
  const [activeYear, setActiveYear] = useState<number>(currentYear);

  const decadeYears = Array.from(
    { length: 12 },
    (_, i) => decadeStartYear - 1 + i,
  );

  const constraints: JalaliDateConstraints = {
    minDate,
    maxDate,
    isDateDisabled,
  };
  const canSelectYear = (year: number) =>
    isJalaliYearSelectable(year, constraints);
  const canSelectMonth = (year: number, month: JalaliMonthIndex) =>
    isJalaliMonthSelectable(year, month, constraints);
  const previousPeriodDisabled =
    viewLevel === "months"
      ? !canSelectYear(activeYear - 1)
      : !Array.from({ length: 10 }, (_, i) => decadeStartYear - 10 + i).some(
          canSelectYear,
        );
  const nextPeriodDisabled =
    viewLevel === "months"
      ? !canSelectYear(activeYear + 1)
      : !Array.from({ length: 10 }, (_, i) => decadeStartYear + 10 + i).some(
          canSelectYear,
        );

  const handlePrev = () => {
    if (previousPeriodDisabled) return;
    if (viewLevel === "months") {
      const prevY = activeYear - 1;
      setActiveYear(prevY);
      onSelectYear(prevY);
    } else {
      setDecadeStartYear((prev) => prev - 10);
    }
  };

  const handleNext = () => {
    if (nextPeriodDisabled) return;
    if (viewLevel === "months") {
      const nextY = activeYear + 1;
      setActiveYear(nextY);
      onSelectYear(nextY);
    } else {
      setDecadeStartYear((prev) => prev + 10);
    }
  };

  const navBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--pdp-text-primary, #0f172a)",
    transition: "all 0.15s ease",
  };

  const cellBtnBaseStyle: React.CSSProperties = {
    height: "46px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "13.5px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    background: "transparent",
    color: "var(--pdp-text-primary, #0f172a)",
    userSelect: "none",
  };

  return (
    <div
      className={classNames?.calendar}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        height: "260px",
        padding: "6px",
        boxSizing: "border-box",
        justifyContent: "space-between",
        userSelect: "none",
        ...styles?.calendar,
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
          height: "38px",
        }}
      >
        {/* Right Arrow (Previous in RTL) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={previousPeriodDisabled}
          aria-disabled={previousPeriodDisabled}
          aria-label="Previous"
          className={mergeClassNames(
            classNames?.navButton,
            previousPeriodDisabled && classNames?.disabledNavButton,
          )}
          style={{
            ...navBtnStyle,
            cursor: previousPeriodDisabled ? "not-allowed" : "pointer",
            opacity: previousPeriodDisabled ? 0.38 : 1,
            ...(previousPeriodDisabled
              ? styles?.disabledNavButton
              : undefined),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--pdp-hover-bg, #f1f5f9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Header Year Button (Clearly Interactive) */}
        <button
          type="button"
          onClick={() => {
            if (viewLevel === "months") {
              setDecadeStartYear(Math.floor(activeYear / 10) * 10);
              setViewLevel("years");
            }
          }}
          style={{
            background:
              viewLevel === "months"
                ? "var(--pdp-surface-subtle, #f1f5f9)"
                : "transparent",
            border:
              viewLevel === "months"
                ? "1px solid var(--pdp-surface-border, #e2e8f0)"
                : "none",
            cursor: viewLevel === "months" ? "pointer" : "default",
            fontSize: "13.5px",
            fontWeight: 700,
            color: "var(--pdp-text-primary, #0f172a)",
            padding: "5px 12px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (viewLevel === "months") {
              e.currentTarget.style.backgroundColor =
                "var(--pdp-hover-bg, #e2e8f0)";
              e.currentTarget.style.borderColor = "var(--pdp-primary, #4f46e5)";
            }
          }}
          onMouseLeave={(e) => {
            if (viewLevel === "months") {
              e.currentTarget.style.backgroundColor =
                "var(--pdp-surface-subtle, #f1f5f9)";
              e.currentTarget.style.borderColor =
                "var(--pdp-surface-border, #e2e8f0)";
            }
          }}
        >
          <span>
            {viewLevel === "months"
              ? toPersianDigits(activeYear)
              : `${toPersianDigits(decadeStartYear)} - ${toPersianDigits(decadeStartYear + 9)}`}
          </span>

          {viewLevel === "months" && (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </button>

        {/* Left Arrow (Next in RTL) */}
        <button
          type="button"
          onClick={handleNext}
          disabled={nextPeriodDisabled}
          aria-disabled={nextPeriodDisabled}
          aria-label="Next"
          className={mergeClassNames(
            classNames?.navButton,
            nextPeriodDisabled && classNames?.disabledNavButton,
          )}
          style={{
            ...navBtnStyle,
            cursor: nextPeriodDisabled ? "not-allowed" : "pointer",
            opacity: nextPeriodDisabled ? 0.38 : 1,
            ...(nextPeriodDisabled ? styles?.disabledNavButton : undefined),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--pdp-hover-bg, #f1f5f9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Grid Content: 4 Columns x 3 Rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "8px 6px",
          flex: 1,
          alignItems: "center",
        }}
      >
        {viewLevel === "months"
          ? PERSIAN_MONTH_NAMES.map((name, index) => {
              const isSelected =
                index === currentMonth && activeYear === currentYear;
              const isDisabled = !canSelectMonth(
                activeYear,
                index as JalaliMonthIndex,
              );
              return (
                <button
                  key={name}
                  type="button"
                  disabled={isDisabled}
                  aria-disabled={isDisabled}
                  onClick={() => onSelectMonth(index as JalaliMonthIndex)}
                  className={mergeClassNames(
                    classNames?.monthButton,
                    isSelected && classNames?.selectedMonthButton,
                    isDisabled && classNames?.disabledMonthButton,
                  )}
                  style={{
                    ...cellBtnBaseStyle,
                    background: isSelected
                      ? "var(--pdp-primary, #4f46e5)"
                      : "transparent",
                    color: isSelected
                      ? "#ffffff"
                      : "var(--pdp-text-primary, #0f172a)",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.35 : 1,
                    ...(styles?.monthButton ?? {}),
                    ...(isSelected ? styles?.selectedMonthButton : undefined),
                    ...(isDisabled ? styles?.disabledMonthButton : undefined),
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor =
                        "var(--pdp-hover-bg, #f1f5f9)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {name}
                </button>
              );
            })
          : decadeYears.map((year, idx) => {
              const isOutlier = idx === 0 || idx === 11;
              const isSelected = year === activeYear;
              const isDisabled = !canSelectYear(year);

              return (
                <button
                  key={year}
                  type="button"
                  disabled={isDisabled}
                  aria-disabled={isDisabled}
                  className={mergeClassNames(
                    classNames?.yearButton,
                    isSelected && classNames?.selectedYearButton,
                    isDisabled && classNames?.disabledYearButton,
                  )}
                  onClick={() => {
                    setActiveYear(year);
                    onSelectYear(year);
                    setViewLevel("months");
                  }}
                  style={{
                    ...cellBtnBaseStyle,
                    background: isSelected
                      ? "var(--pdp-primary, #4f46e5)"
                      : "transparent",
                    color: isSelected
                      ? "#ffffff"
                      : isOutlier
                        ? "var(--pdp-text-disabled, #94a3b8)"
                        : "var(--pdp-text-primary, #0f172a)",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.3 : isOutlier ? 0.4 : 1,
                    ...(styles?.yearButton ?? {}),
                    ...(isSelected ? styles?.selectedYearButton : undefined),
                    ...(isDisabled ? styles?.disabledYearButton : undefined),
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor =
                        "var(--pdp-hover-bg, #f1f5f9)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {toPersianDigits(year)}
                </button>
              );
            })}
      </div>
    </div>
  );
};
