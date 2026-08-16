import React from "react";
import type { JalaliMonthIndex } from "../core/types";
import { PERSIAN_MONTH_NAMES } from "../core/constants";
import { toPersianDigits } from "../formatters/persian-digits";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";

export interface HeaderProps {
  year: number;
  month: JalaliMonthIndex;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTogglePicker: () => void;
  onGoToToday: () => void;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const Header: React.FC<HeaderProps> = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onTogglePicker,
  classNames,
  styles,
}) => {
  return (
    <div
      className={classNames?.header}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
        padding: "0 4px",
        height: "28px",
        ...styles?.header,
      }}
    >
      <button
        type="button"
        aria-label="ماه قبل"
        onClick={onPrevMonth}
        className={classNames?.navButton}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          border: "1px solid var(--pdp-surface-border, #e2e8f0)",
          backgroundColor: "var(--pdp-surface-bg, #ffffff)",
          color: "var(--pdp-text-primary, #0f172a)",
          cursor: "pointer",
          ...styles?.navButton,
        }}
      >
        ›
      </button>

      <button
        type="button"
        onClick={onTogglePicker}
        className={classNames?.headerTitle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--pdp-text-primary, #0f172a)",
          display: "flex",
          gap: "6px",
          ...styles?.headerTitle,
        }}
      >
        <span>{PERSIAN_MONTH_NAMES[month]}</span>
        <span>{toPersianDigits(year)}</span>
      </button>

      <button
        type="button"
        aria-label="ماه بعد"
        onClick={onNextMonth}
        className={classNames?.navButton}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          border: "1px solid var(--pdp-surface-border, #e2e8f0)",
          backgroundColor: "var(--pdp-surface-bg, #ffffff)",
          color: "var(--pdp-text-primary, #0f172a)",
          cursor: "pointer",
          ...styles?.navButton,
        }}
      >
        ‹
      </button>
    </div>
  );
};
