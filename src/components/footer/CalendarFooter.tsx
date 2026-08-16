import React from "react";
import type { CalendarFooterProps } from "./types";
import { formatJalaliDate } from "../../formatters/jalali-formatter";
import { formatTimeString } from "../../plugins/time-picker/time-utils";
import { toPersianDigits } from "../../formatters/persian-digits";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../../theme/style-slots";

export interface ExtendedCalendarFooterProps extends CalendarFooterProps {
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const CalendarFooter: React.FC<ExtendedCalendarFooterProps> = ({
  selectedDate,
  selectedRange,
  selectedDates,
  selectedTime,
  mode = "single",
  digitType = "persian",
  showStatusText = true,
  showActions = true,
  onToday,
  onClear,
  onConfirm,
  classNames,
  styles,
}) => {
  const getStatusText = (): string => {
    let text = "هیچ تاریخی انتخاب نشده است";

    if (mode === "single" && selectedDate) {
      text = formatJalaliDate(selectedDate, "dddd D MMMM YYYY", { digitType });
      if (selectedTime) {
        text += ` - ${formatTimeString(selectedTime, false, digitType)}`;
      }
    } else if (mode === "range") {
      const [start, end] = selectedRange || [null, null];
      if (start && end) {
        text = `${formatJalaliDate(start, "YYYY/MM/DD", { digitType })} تا ${formatJalaliDate(end, "YYYY/MM/DD", { digitType })}`;
      } else if (start) {
        text = `شروع: ${formatJalaliDate(start, "YYYY/MM/DD", { digitType })} (پایان را انتخاب کنید)`;
      }
    } else if (
      mode === "multiple" &&
      selectedDates &&
      selectedDates.length > 0
    ) {
      const countStr =
        digitType === "persian"
          ? toPersianDigits(selectedDates.length)
          : selectedDates.length;
      text = `${countStr} روز انتخاب شده`;
    }

    return text;
  };

  return (
    <div
      className={classNames?.footer}
      style={{
        marginTop: "8px",
        paddingTop: "8px",
        borderTop: "1px solid var(--pdp-surface-border, #e2e8f0)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        ...styles?.footer,
      }}
    >
      {showStatusText && (
        <div
          aria-live="polite"
          style={{
            fontSize: "12px",
            color: "var(--pdp-text-secondary, #475569)",
            textAlign: "center",
            minHeight: "18px",
            fontWeight: 500,
          }}
        >
          {getStatusText()}
        </div>
      )}

      {showActions && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {onToday && (
              <button
                type="button"
                onClick={onToday}
                style={{
                  padding: "3px 8px",
                  fontSize: "11px",
                  borderRadius: "4px",
                  border: "1px solid var(--pdp-surface-border, #e2e8f0)",
                  backgroundColor: "transparent",
                  color: "var(--pdp-text-primary, #0f172a)",
                  cursor: "pointer",
                }}
              >
                امروز
              </button>
            )}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                style={{
                  padding: "3px 8px",
                  fontSize: "11px",
                  borderRadius: "4px",
                  border: "1px solid var(--pdp-surface-border, #e2e8f0)",
                  backgroundColor: "transparent",
                  color: "var(--pdp-text-muted, #94a3b8)",
                  cursor: "pointer",
                }}
              >
                پاک کردن
              </button>
            )}
          </div>

          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                backgroundColor: "var(--pdp-primary-color, #0284c7)",
                color: "var(--pdp-primary-contrast-text, #ffffff)",
                cursor: "pointer",
              }}
            >
              تایید
            </button>
          )}
        </div>
      )}
    </div>
  );
};
