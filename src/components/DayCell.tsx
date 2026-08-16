import React, { useState } from "react";
import type { JalaliCalendarCell, JalaliDate } from "../core/types";
import { toPersianDigits } from "../formatters/persian-digits";
import { getAriaDayLabel } from "../a11y/aria-helpers";
import type { CalendarEvent } from "../events/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";

export interface DayCellProps {
  cell: JalaliCalendarCell;
  tabIndex: number;
  digitType?: "persian" | "latin";
  isHoliday?: boolean;
  holidayTitle?: string;
  events?: CalendarEvent[];
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
  onSelect: (date: JalaliDate) => void;
  onHover?: (date: JalaliDate | null) => void;
  onFocus?: (date: JalaliDate) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  cell,
  tabIndex,
  digitType = "persian",
  isHoliday = false,
  holidayTitle,
  events = [],
  classNames,
  styles,
  onSelect,
  onHover,
  onFocus,
}) => {
  const {
    jalali,
    isCurrentMonth,
    isToday,
    isSelected,
    isDisabled,
    isInRange,
    isRangeStart,
    isRangeEnd,
  } = cell;

  const [isHovered, setIsHovered] = useState(false);

  const dayDisplay =
    digitType === "persian" ? toPersianDigits(cell.dayNumber) : cell.dayNumber;
  let ariaLabel = getAriaDayLabel(jalali);

  if (isHoliday && holidayTitle) {
    ariaLabel += ` (${holidayTitle})`;
  }

  // Base Dynamic Styles
  let backgroundColor = "transparent";
  let textColor = isCurrentMonth
    ? isHoliday
      ? "var(--pdp-holiday-color, #ef4444)"
      : "var(--pdp-text-primary, #0f172a)"
    : "var(--pdp-text-disabled, #cbd5e1)";

  if (isInRange && !isSelected) {
    backgroundColor = "var(--pdp-range-between-bg, #e0f2fe)";
    textColor = "var(--pdp-range-between-text, #0369a1)";
  }

  if (isSelected || isRangeStart || isRangeEnd) {
    backgroundColor = "var(--pdp-primary-color, #0284c7)";
    textColor = "var(--pdp-primary-contrast-text, #ffffff)";
  }

  // Aggregate dynamic classNames
  const combinedClasses = [
    classNames?.dayCell,
    isToday && classNames?.todayCell,
    isSelected && classNames?.selectedCell,
    isInRange && !isSelected && classNames?.rangeBetweenCell,
    isDisabled && classNames?.disabledCell,
    isHoliday && classNames?.holidayCell,
  ]
    .filter(Boolean)
    .join(" ");

  // Aggregate dynamic custom styles
  const combinedStyles: React.CSSProperties = {
    width: "var(--pdp-cell-size, 36px)",
    height: "var(--pdp-cell-size, 36px)",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius:
      isRangeStart || isRangeEnd || (!isInRange && isSelected)
        ? "var(--pdp-border-radius, 8px)"
        : "4px",
    border:
      isToday && !isSelected
        ? "1px solid var(--pdp-today-indicator-color, #0284c7)"
        : "none",
    backgroundColor,
    color: textColor,
    fontWeight: isToday || isSelected || isHoliday ? 700 : 400,
    fontSize: "14px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.4 : 1,
    transition: "background-color 0.15s ease, color 0.15s ease",
    outline: "none",
    position: "relative",
    ...styles?.dayCell,
    ...(isToday ? styles?.todayCell : {}),
    ...(isSelected ? styles?.selectedCell : {}),
    ...(isInRange && !isSelected ? styles?.rangeBetweenCell : {}),
    ...(isDisabled ? styles?.disabledCell : {}),
    ...(isHoliday ? styles?.holidayCell : {}),
  };

  const hasEvents = events.length > 0;
  const primaryBadgeColor = hasEvents
    ? (events[0].color ?? "var(--pdp-primary-color, #0284c7)")
    : undefined;

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (!isDisabled) onHover?.(jalali);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover?.(null);
      }}
    >
      <button
        type="button"
        role="gridcell"
        tabIndex={isDisabled ? -1 : tabIndex}
        aria-selected={isSelected || isRangeStart || isRangeEnd}
        aria-disabled={isDisabled}
        aria-label={ariaLabel}
        disabled={isDisabled}
        onClick={() => !isDisabled && onSelect(jalali)}
        onFocus={() => !isDisabled && onFocus?.(jalali)}
        className={combinedClasses || undefined}
        style={combinedStyles}
      >
        <span style={{ lineHeight: 1 }}>{dayDisplay}</span>

        {hasEvents && !isSelected && (
          <div
            className={classNames?.eventBadge}
            style={{
              display: "flex",
              gap: "2px",
              position: "absolute",
              bottom: "3px",
              ...styles?.eventBadge,
            }}
          >
            {events.slice(0, 3).map((ev, idx) => (
              <span
                key={idx}
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: ev.color ?? primaryBadgeColor,
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        )}
      </button>

      {/* Hover Tooltip */}
      {isHovered && (hasEvents || (isHoliday && holidayTitle)) && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            minWidth: "max-content",
            maxWidth: "200px",
            textAlign: "center",
          }}
        >
          {isHoliday && holidayTitle && (
            <div style={{ color: "#f87171", fontWeight: 600 }}>
              {holidayTitle}
            </div>
          )}
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                justifyContent: "center",
              }}
            >
              {ev.color && (
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: ev.color,
                    display: "inline-block",
                  }}
                />
              )}
              <span style={{ fontWeight: 500 }}>{ev.title}</span>
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              borderWidth: "4px",
              borderStyle: "solid",
              borderColor: "#0f172a transparent transparent transparent",
            }}
          />
        </div>
      )}
    </div>
  );
};
