// src/components/DayCell.tsx
import React, { useState } from "react";
import type { JalaliCalendarCell, JalaliDate } from "../core/types";
import { toPersianDigits, toLatinDigits } from "../formatters/persian-digits";
import type { CalendarEvent } from "../events/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";

export interface DayCellProps {
  cell: JalaliCalendarCell;
  digitType?: "persian" | "latin";
  isHoliday?: boolean;
  holidayTitle?: string;
  events?: CalendarEvent[];
  tabIndex?: number;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
  onSelect: (date: JalaliDate) => void;
  onHover?: (date: JalaliDate | null) => void;
  onFocus?: (date: JalaliDate) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  cell,
  digitType = "persian",
  isHoliday = false,
  holidayTitle,
  events = [],
  tabIndex = -1,
  classNames,
  styles,
  onSelect,
  onHover,
  onFocus,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    jalali,
    dayNumber,
    isCurrentMonth,
    isToday,
    isSelected,
    isDisabled,
    isInRange,
    isRangeStart,
    isRangeEnd,
  } = cell;

  const formattedDay =
    digitType === "persian"
      ? toPersianDigits(dayNumber)
      : toLatinDigits(dayNumber.toString());

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled && isCurrentMonth) {
      onSelect(jalali);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isDisabled && isCurrentMonth && onHover) {
      onHover(jalali);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHover) {
      onHover(null);
    }
  };

  const handleFocus = () => {
    if (!isDisabled && isCurrentMonth && onFocus) {
      onFocus(jalali);
    }
  };

  // Cell Background Logic
  let cellBg = "transparent";
  let textColor = isCurrentMonth
    ? "var(--pdp-text-primary, #0f172a)"
    : "var(--pdp-text-disabled, #cbd5e1)";

  if (isSelected || isRangeStart || isRangeEnd) {
    cellBg = "var(--pdp-primary, #4f46e5)";
    textColor = "#ffffff";
  } else if (isInRange) {
    cellBg = "var(--pdp-range-between-bg, rgba(79, 70, 229, 0.12))";
  }

  // Holiday styling (if not selected)
  if (
    isHoliday &&
    isCurrentMonth &&
    !isSelected &&
    !isRangeStart &&
    !isRangeEnd
  ) {
    textColor = "var(--pdp-holiday-color, #e11d48)";
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "var(--pdp-cell-size, 34px)",
        height: "var(--pdp-cell-size, 34px)",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        role="gridcell"
        tabIndex={tabIndex}
        disabled={isDisabled || !isCurrentMonth}
        aria-selected={isSelected}
        aria-label={`${jalali.year}/${jalali.month + 1}/${jalali.day}${holidayTitle ? ` - ${holidayTitle}` : ""}`}
        onClick={handleClick}
        onFocus={handleFocus}
        className={classNames?.dayCell}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: isRangeStart
            ? "0 8px 8px 0"
            : isRangeEnd
              ? "8px 0 0 8px"
              : isInRange
                ? "0"
                : "8px",
          border:
            isToday && !isSelected
              ? "1px solid var(--pdp-primary, #4f46e5)"
              : "none",
          backgroundColor: cellBg,
          color: textColor,
          cursor: isDisabled || !isCurrentMonth ? "default" : "pointer",
          fontSize: "13px",
          fontWeight: isSelected || isToday ? 700 : 500,
          outline: "none",
          transition: "all 0.12s ease",
          position: "relative",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          ...styles?.dayCell,
        }}
      >
        <span>{formattedDay}</span>

        {/* Event Dots */}
        {events.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "3px",
              display: "flex",
              gap: "2px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {events.slice(0, 3).map((ev) => (
              <span
                key={ev.id}
                style={{
                  width: "3.5px",
                  height: "3.5px",
                  borderRadius: "50%",
                  backgroundColor: isSelected
                    ? "#ffffff"
                    : ev.color || "var(--pdp-primary, #4f46e5)",
                }}
              />
            ))}
          </div>
        )}
      </button>

      {/* Tooltip on Hover */}
      {isHovered && isCurrentMonth && (isHoliday || events.length > 0) && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            backgroundColor: "var(--pdp-tooltip-bg, #0f172a)",
            color: "var(--pdp-tooltip-text, #ffffff)",
            padding: "5px 9px",
            borderRadius: "6px",
            fontSize: "11.5px",
            fontWeight: 600,
            lineHeight: 1.3,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            textAlign: "center",
          }}
        >
          {isHoliday && holidayTitle && (
            <span style={{ color: "#fda4af" }}>{holidayTitle}</span>
          )}

          {events.map((ev) => (
            <span key={ev.id} style={{ color: "#e2e8f0" }}>
              • {ev.title}
            </span>
          ))}

          {/* Tooltip Arrow */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              borderWidth: "4px",
              borderStyle: "solid",
              borderColor:
                "var(--pdp-tooltip-bg, #0f172a) transparent transparent transparent",
            }}
          />
        </div>
      )}
    </div>
  );
};
