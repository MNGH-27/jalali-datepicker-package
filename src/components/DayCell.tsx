import React, { useState } from "react";
import { PERSIAN_MONTH_NAMES } from "../core/constants";
import type { JalaliCalendarCell, JalaliDate } from "../core/types";
import type { CalendarEvent } from "../events/types";
import { toPersianDigits } from "../formatters/persian-digits";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";
import { mergeClassNames } from "../theme/style-utils";
import { useTheme } from "../theme/ThemeProvider";

export interface DayCellProps {
  cell?: JalaliCalendarCell;
  day?: number;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  isHoliday?: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  disabled?: boolean;
  holidayTitle?: string;
  events?: CalendarEvent[];
  digitType?: "persian" | "latin";
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
  const [isHovered, setIsHovered] = useState(false);

  const cell = props.cell;
  const jalaliDate: JalaliDate = cell?.jalali ?? {
    year: 1403,
    month: 0,
    day: props.day ?? 1,
  };
  const isCurrentMonth = cell?.isCurrentMonth ?? props.isCurrentMonth ?? true;
  const isSelected = cell?.isSelected ?? props.isSelected ?? false;
  const isToday = cell?.isToday ?? props.isToday ?? false;
  const isHoliday = props.isHoliday ?? false;
  const isInRange = cell?.isInRange ?? props.isInRange ?? false;
  const isRangeStart = cell?.isRangeStart ?? props.isRangeStart ?? false;
  const isRangeEnd = cell?.isRangeEnd ?? props.isRangeEnd ?? false;
  const disabled = cell?.isDisabled ?? props.disabled ?? false;
  const isUnavailable = disabled || !isCurrentMonth;
  const isRangeEdge = isRangeStart || isRangeEnd;
  const isActivelySelected = isSelected || isRangeEdge;
  const displayNumber =
    props.digitType === "latin"
      ? String(jalaliDate.day)
      : toPersianDigits(jalaliDate.day);
  const displayYear =
    props.digitType === "latin"
      ? String(jalaliDate.year)
      : toPersianDigits(jalaliDate.year);

  let backgroundColor = "transparent";
  let textColor = isCurrentMonth
    ? theme.colors.textPrimary
    : theme.colors.textDisabled;

  if (isInRange && isCurrentMonth) {
    backgroundColor = theme.colors.rangeBackground;
    textColor = theme.colors.textPrimary;
  }
  if (isHoliday && isCurrentMonth) textColor = theme.colors.holiday;
  if (isHovered && !isActivelySelected && !isUnavailable) {
    backgroundColor = isHoliday
      ? theme.colors.holidayBackground
      : theme.colors.backgroundHover;
  }
  if (isActivelySelected) {
    backgroundColor = theme.colors.primary;
    textColor = theme.colors.primaryText;
  }

  const accessibleDetails = [
    `${displayNumber} ${PERSIAN_MONTH_NAMES[jalaliDate.month]} ${displayYear}`,
    props.holidayTitle,
    ...(props.events?.map((event) => event.title) ?? []),
  ].filter(Boolean);

  const handleClick = () => {
    if (isUnavailable) return;
    props.onClick?.();
    props.onSelect?.(jalaliDate);
  };

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={accessibleDetails.join("، ")}
      aria-selected={isActivelySelected}
      tabIndex={props.tabIndex ?? 0}
      disabled={isUnavailable}
      title={accessibleDetails.slice(1).join(" — ") || undefined}
      onClick={handleClick}
      onFocus={() => props.onFocus?.(jalaliDate)}
      className={mergeClassNames(
        props.classNames?.dayCell,
        !isCurrentMonth && props.classNames?.outsideMonthCell,
        isToday && props.classNames?.todayCell,
        isSelected && props.classNames?.selectedCell,
        isInRange && props.classNames?.rangeBetweenCell,
        isRangeStart && props.classNames?.rangeStartCell,
        isRangeEnd && props.classNames?.rangeEndCell,
        disabled && props.classNames?.disabledCell,
        isHoliday && props.classNames?.holidayCell,
      )}
      style={{
        position: "relative",
        width: "var(--pdp-cell-size, 36px)",
        height: "var(--pdp-cell-size, 36px)",
        padding: 0,
        border:
          isToday && !isActivelySelected
            ? `1.5px solid ${theme.colors.todayBorder}`
            : "1px solid transparent",
        borderRadius: theme.radii.md,
        backgroundColor,
        color: textColor,
        cursor: isUnavailable ? "default" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.85rem",
        fontWeight: isActivelySelected || isToday ? 700 : 500,
        lineHeight: 1,
        opacity: !isCurrentMonth ? 0.42 : disabled ? 0.5 : 1,
        transform:
          isHovered && !isActivelySelected && !isUnavailable
            ? "scale(1.04)"
            : "scale(1)",
        transition:
          "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
        ...props.styles?.dayCell,
        ...(!isCurrentMonth ? props.styles?.outsideMonthCell : undefined),
        ...(isToday ? props.styles?.todayCell : undefined),
        ...(isInRange ? props.styles?.rangeBetweenCell : undefined),
        ...(isSelected ? props.styles?.selectedCell : undefined),
        ...(isRangeStart ? props.styles?.rangeStartCell : undefined),
        ...(isRangeEnd ? props.styles?.rangeEndCell : undefined),
        ...(disabled ? props.styles?.disabledCell : undefined),
        ...(isHoliday ? props.styles?.holidayCell : undefined),
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        props.onHover?.(jalaliDate);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        props.onHover?.(null);
      }}
    >
      <span aria-hidden="true">{displayNumber}</span>
      {Boolean(props.events?.length) && (
        <span
          aria-hidden="true"
          className={props.classNames?.eventBadges}
          style={{
            position: "absolute",
            insetInline: "3px",
            bottom: "2px",
            display: "flex",
            justifyContent: "center",
            gap: "2px",
            ...props.styles?.eventBadges,
          }}
        >
          {props.events?.slice(0, 3).map((event) => (
            <span
              key={event.id}
              className={props.classNames?.eventBadge}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: event.color ?? theme.colors.primary,
                ...props.styles?.eventBadge,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
};
