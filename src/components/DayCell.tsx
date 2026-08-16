import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import { toPersianDigits } from "../formatters/persian-digits";
import type { JalaliDate, JalaliCalendarCell } from "../core/types";
import type { CalendarEvent } from "../events/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";

export interface DayCellProps {
  cell?:
    | JalaliCalendarCell
    | (Partial<JalaliCalendarCell> & {
        day?: number;
        isHoliday?: boolean;
        isDisabled?: boolean;
      });
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
  holidayTitle?: string;
  events?: CalendarEvent[];
  tabIndex?: number;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
  onSelect?: (target: JalaliDate) => void;
  onHover?: (target: JalaliDate | null) => void;
  onFocus?: (target: JalaliDate) => void;
  onClick?: () => void;
}

export const DayCell: React.FC<DayCellProps> = (props) => {
  const { theme } = useTheme();

  const cell = props.cell;
  const jalaliDate: JalaliDate = cell?.jalali ?? {
    year: 1403,
    month: 1,
    day: props.day ?? (cell && "day" in cell ? (cell as any).day : 1),
  };

  const dayNumber = jalaliDate.day;
  const isCurrentMonth = cell?.isCurrentMonth ?? props.isCurrentMonth ?? true;
  const isSelected = cell?.isSelected ?? props.isSelected ?? false;
  const isToday = cell?.isToday ?? props.isToday ?? false;
  const isHoliday =
    props.isHoliday ??
    (cell && "isHoliday" in cell ? (cell as any).isHoliday : false);
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
        borderRadius:
          isRangeStart || isRangeEnd || isSelected
            ? theme.radii.md
            : isInRange
              ? "0px"
              : theme.radii.md,
        backgroundColor,
        color: textColor,
        cursor: disabled || !isCurrentMonth ? "default" : "pointer",
        fontSize: "0.85rem",
        fontWeight: isSelected || isToday ? 700 : 500,
        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: !isCurrentMonth ? 0.3 : 1,
        outline: "none",
        ...props.styles?.dayCell,
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
          e.currentTarget.style.transform = "scale(1.08)";
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
