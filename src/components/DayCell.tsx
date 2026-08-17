// src/components/DayCell.tsx
import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import { toPersianDigits } from "../formatters/persian-digits";
import type { JalaliDate, JalaliCalendarCell } from "../core/types";

export interface DayCellProps {
  cell?: JalaliCalendarCell | any;
  day?: number;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  isHoliday?: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  disabled?: boolean;
  digitType?: "persian" | "latin";
  tabIndex?: number;
  onSelect?: (target: JalaliDate) => void;
  onHover?: (target: JalaliDate | null) => void;
  onFocus?: (target: JalaliDate) => void;
  onClick?: () => void;
  [key: string]: any;
}

export const DayCell: React.FC<DayCellProps> = (props) => {
  const { theme } = useTheme();

  const cell = props.cell;
  const jalaliDate: JalaliDate = cell?.jalali ?? {
    year: 1403,
    month: 1,
    day: props.day ?? (cell && "day" in cell ? cell.day : 1),
  };

  const dayNumber = jalaliDate.day;
  const isCurrentMonth = cell?.isCurrentMonth ?? props.isCurrentMonth ?? true;
  const isSelected = cell?.isSelected ?? props.isSelected ?? false;
  const isToday = cell?.isToday ?? props.isToday ?? false;
  const isHoliday =
    props.isHoliday ?? (cell && "isHoliday" in cell ? cell.isHoliday : false);
  const isInRange = cell?.isInRange ?? props.isInRange ?? false;
  const isRangeStart = cell?.isRangeStart ?? props.isRangeStart ?? false;
  const isRangeEnd = cell?.isRangeEnd ?? props.isRangeEnd ?? false;
  const disabled = cell?.isDisabled ?? props.disabled ?? false;

  let backgroundColor = "transparent";
  let textColor = isCurrentMonth
    ? theme.colors.textPrimary
    : theme.colors.textDisabled;

  if (isInRange && isCurrentMonth) {
    backgroundColor = theme.colors.rangeBackground;
    textColor = theme.colors.primary;
  }

  if (isSelected || isRangeStart || isRangeEnd) {
    backgroundColor = theme.colors.primary;
    textColor = theme.colors.primaryText;
  } else if (isHoliday && isCurrentMonth) {
    textColor = theme.colors.holiday;
  }

  const handleClick = () => {
    if (disabled || !isCurrentMonth) return;
    if (props.onClick) props.onClick();
    if (props.onSelect) props.onSelect(jalaliDate);
  };

  return (
    <button
      type="button"
      tabIndex={props.tabIndex ?? 0}
      disabled={disabled || !isCurrentMonth}
      onClick={handleClick}
      onFocus={() => props.onFocus?.(jalaliDate)}
      style={{
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border:
          isToday && !isSelected && !isRangeStart && !isRangeEnd
            ? `1.5px solid ${theme.colors.todayBorder}`
            : "none",
        borderRadius: theme.radii.md, // گردی یکپارچه و یکنواخت برای تمام روزها
        backgroundColor,
        color: textColor,
        cursor: disabled || !isCurrentMonth ? "default" : "pointer",
        fontSize: "0.85rem",
        fontWeight:
          isSelected || isToday || isRangeStart || isRangeEnd ? 700 : 500,
        transition: "all 0.15s ease",
        opacity: !isCurrentMonth ? 0.35 : 1,
        outline: "none",
      }}
      onMouseEnter={(e) => {
        props.onHover?.(jalaliDate);
        if (
          isCurrentMonth &&
          !disabled &&
          !isSelected &&
          !isRangeStart &&
          !isRangeEnd
        ) {
          e.currentTarget.style.backgroundColor = isHoliday
            ? theme.colors.holidayBackground
            : theme.colors.backgroundHover;
          e.currentTarget.style.transform = "scale(1.06)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !isRangeStart && !isRangeEnd) {
          e.currentTarget.style.backgroundColor = isInRange
            ? theme.colors.rangeBackground
            : "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      {props.digitType === "latin" ? dayNumber : toPersianDigits(dayNumber)}
    </button>
  );
};
