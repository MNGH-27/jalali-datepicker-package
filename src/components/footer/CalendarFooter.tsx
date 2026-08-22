import React from "react";
import { formatJalaliDate } from "../../formatters/jalali-formatter";
import { toPersianDigits } from "../../formatters/persian-digits";
import { formatTimeString } from "../../plugins/time-picker/time-utils";
import { useTheme } from "../../theme/ThemeProvider";
import type { CalendarFooterProps } from "./types";

export const CalendarFooter: React.FC<CalendarFooterProps> = ({
  selectedDate,
  selectedRange,
  selectedDates,
  selectedTime,
  showSeconds = false,
  mode = "single",
  digitType = "persian",
  showStatusText = true,
  showActions = true,
  onToday,
  onClear,
  onConfirm,
  direction = "rtl",
  classNames,
  styles,
}) => {
  const { theme } = useTheme();

  const statusText = (() => {
    if (mode === "single") {
      if (!selectedDate) return "تاریخی انتخاب نشده";
      const date = formatJalaliDate(selectedDate, "YYYY/MM/DD", { digitType });
      const time = selectedTime
        ? formatTimeString(selectedTime, showSeconds, digitType)
        : "";
      return time ? `${date}، ${time}` : date;
    }

    if (mode === "range") {
      const [start, end] = selectedRange ?? [null, null];
      if (!start) return "بازه‌ای انتخاب نشده";
      const startText = formatJalaliDate(start, "YYYY/MM/DD", { digitType });
      if (!end) return `${startText} تا …`;
      const endText = formatJalaliDate(end, "YYYY/MM/DD", { digitType });
      return `${startText} تا ${endText}`;
    }

    const count = selectedDates?.length ?? 0;
    const displayCount =
      digitType === "persian" ? toPersianDigits(count) : String(count);
    return count ? `${displayCount} تاریخ انتخاب شده` : "تاریخی انتخاب نشده";
  })();

  const actionButtonStyle: React.CSSProperties = {
    minHeight: "34px",
    padding: "5px 12px",
    borderRadius: theme.radii.sm,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.textSecondary,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.78rem",
    fontWeight: 600,
  };

  return (
    <div
      dir={direction}
      className={classNames?.footer}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: showStatusText ? "space-between" : "flex-end",
        flexWrap: "wrap",
        gap: "8px",
        padding: "10px 0 0",
        borderTop: `1px solid ${theme.colors.border}`,
        color: theme.colors.textPrimary,
        ...styles?.footer,
      }}
    >
      {showStatusText && (
        <span
          className={classNames?.footerStatus}
          style={{
            color: theme.colors.textSecondary,
            fontSize: "0.78rem",
            lineHeight: 1.5,
            ...styles?.footerStatus,
          }}
        >
          {statusText}
        </span>
      )}

      {showActions && (
        <div
          className={classNames?.footerActions}
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "6px",
            ...styles?.footerActions,
          }}
        >
          {onToday && (
            <button
              type="button"
              onClick={onToday}
              className={classNames?.todayButton}
              style={{
                ...actionButtonStyle,
                color: theme.colors.primary,
                ...styles?.todayButton,
              }}
            >
              امروز
            </button>
          )}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className={classNames?.clearButton}
              style={{ ...actionButtonStyle, ...styles?.clearButton }}
            >
              پاک کردن
            </button>
          )}
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={classNames?.confirmButton}
              style={{
                ...actionButtonStyle,
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryText,
                ...styles?.confirmButton,
              }}
            >
              تأیید
            </button>
          )}
        </div>
      )}
    </div>
  );
};
