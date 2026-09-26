// src/components/DayCell.tsx
import React, { useState } from "react";
import type { JalaliCalendarCell, JalaliDate } from "../core/types";
import { toPersianDigits, toLatinDigits } from "../formatters/persian-digits";
import type { CalendarEvent } from "../events/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";
import { mergeClassNames } from "../theme/style-utils";

export interface DayCellProps {
  cell: JalaliCalendarCell;
  digitType?: "persian" | "latin";
  isHoliday?: boolean;
  holidayTitle?: string;
  events?: CalendarEvent[];
  /** Zero-based column index inside the 7-column calendar grid. */
  gridColumnIndex?: number;
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
  gridColumnIndex,
  tabIndex = -1,
  classNames,
  styles,
  onSelect,
  onHover,
  onFocus,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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

  const isInteractive = !isDisabled && isCurrentMonth;
  const tooltipAlignment =
    gridColumnIndex === 0 ? "start" : gridColumnIndex === 6 ? "end" : "center";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInteractive) {
      onSelect(jalali);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isInteractive && onHover) {
      onHover(jalali);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    if (onHover) {
      onHover(null);
    }
  };

  const handleFocus = () => {
    if (isInteractive && onFocus) {
      onFocus(jalali);
    }
  };

  // رنگ‌بندی پس‌زمینه و متن در حالت‌های مختلف
  let cellBg = "transparent";
  let textColor = isCurrentMonth
    ? "var(--pdp-text-primary, #0f172a)"
    : "var(--pdp-text-disabled, #cbd5e1)";

  const isEdgeOfRange = isRangeStart || isRangeEnd;

  if (isSelected || isEdgeOfRange) {
    cellBg = "var(--pdp-primary, #4f46e5)";
    textColor = "#ffffff";
  } else if (isInRange) {
    cellBg = "var(--pdp-range-between-bg, rgba(79, 70, 229, 0.12))";
  } else if (isHovered && isInteractive) {
    cellBg = "var(--pdp-hover-bg, #f1f5f9)";
  }

  // رنگ روزهای تعطیل در صورت عدم انتخاب
  if (
    isHoliday &&
    isCurrentMonth &&
    !isDisabled &&
    !isSelected &&
    !isEdgeOfRange
  ) {
    textColor = "var(--pdp-holiday-color, #e11d48)";
  }

  if (isDisabled) {
    cellBg = "var(--pdp-disabled-bg, #f1f5f9)";
    textColor = "var(--pdp-text-disabled, #94a3b8)";
  }

  const stateClassName = mergeClassNames(
    classNames?.dayCell,
    isToday && classNames?.todayCell,
    isSelected && classNames?.selectedCell,
    isInRange && classNames?.rangeBetweenCell,
    isRangeStart && classNames?.rangeStartCell,
    isRangeEnd && classNames?.rangeEndCell,
    isDisabled && classNames?.disabledCell,
    !isCurrentMonth && classNames?.outsideMonthCell,
    isHoliday && classNames?.holidayCell,
  );

  const stateStyles: React.CSSProperties = {
    ...(isToday ? styles?.todayCell : undefined),
    ...(isSelected ? styles?.selectedCell : undefined),
    ...(isInRange ? styles?.rangeBetweenCell : undefined),
    ...(isRangeStart ? styles?.rangeStartCell : undefined),
    ...(isRangeEnd ? styles?.rangeEndCell : undefined),
    ...(!isCurrentMonth ? styles?.outsideMonthCell : undefined),
    ...(isHoliday ? styles?.holidayCell : undefined),
    ...(isDisabled ? styles?.disabledCell : undefined),
  };

  // انیمیشن transform بر اساس حالت‌های مختلف
  let transform = "scale(1)";
  if (isInteractive) {
    if (isPressed) {
      transform = "scale(0.92)";
    } else if (isHovered && !isInRange) {
      transform = "scale(1.08)";
    }
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minWidth: 0,
        aspectRatio: "1 / 1",
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
        aria-disabled={isDisabled || !isCurrentMonth}
        aria-selected={isSelected}
        aria-label={`${jalali.year}/${jalali.month + 1}/${jalali.day}${
          holidayTitle ? ` - ${holidayTitle}` : ""
        }`}
        onClick={handleClick}
        onFocus={handleFocus}
        onMouseDown={() => isInteractive && setIsPressed(true)}
        onMouseUp={() => isInteractive && setIsPressed(false)}
        className={stateClassName}
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
          cursor: isDisabled ? "not-allowed" : isInteractive ? "pointer" : "default",
          fontSize: "13px",
          fontWeight: isSelected || isToday ? 700 : 500,
          outline: "none",
          position: "relative",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          // انیمیشن‌های نرم هاور، اسکیل و رنگ
          transform,
          boxShadow:
            isHovered && isInteractive && !isInRange && !isSelected
              ? "0 2px 6px rgba(0, 0, 0, 0.08)"
              : "none",
          transition:
            "transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.14s ease, color 0.14s ease, box-shadow 0.16s ease",
          zIndex: isHovered && isInteractive ? 2 : 1,
          opacity: isDisabled ? 0.42 : isCurrentMonth ? 1 : 0.55,
          filter: isDisabled ? "grayscale(0.65)" : undefined,
          ...styles?.dayCell,
          ...stateStyles,
        }}
      >
        <span>{formattedDay}</span>

        {/* نقاط ایونت‌ها */}
        {events.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "3px",
              display: "flex",
              gap: "2px",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.14s ease",
              transform:
                isHovered && isInteractive ? "translateY(1px)" : "none",
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
                  transition: "background-color 0.14s ease",
                }}
              />
            ))}
          </div>
        )}
      </button>

      {/* تولتیپ شناور روز با انیمیشن Fade-in / Slide-up */}
      {isHovered && isCurrentMonth && (isHoliday || events.length > 0) && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 7px)",
            insetInlineStart:
              tooltipAlignment === "start"
                ? 0
                : tooltipAlignment === "center"
                  ? "50%"
                  : undefined,
            insetInlineEnd: tooltipAlignment === "end" ? 0 : undefined,
            transform:
              tooltipAlignment === "center" ? "translateX(-50%)" : "none",
            zIndex: 1050,
            pointerEvents: "none",
            width: "max-content",
            maxWidth: "min(240px, calc(100vw - 32px))",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
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
            animation:
              "pdpTooltipFade 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards",
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

          {/* فلش جهت‌نمای تولتیپ */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              insetInlineStart:
                tooltipAlignment === "start"
                  ? "calc(var(--pdp-cell-size, 34px) / 2 - 4px)"
                  : tooltipAlignment === "center"
                    ? "50%"
                    : undefined,
              insetInlineEnd:
                tooltipAlignment === "end"
                  ? "calc(var(--pdp-cell-size, 34px) / 2 - 4px)"
                  : undefined,
              transform:
                tooltipAlignment === "center" ? "translateX(-50%)" : "none",
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
