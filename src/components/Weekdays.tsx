import React from "react";
import { PERSIAN_WEEK_DAYS_SHORT } from "../core/constants";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";
import { useTheme } from "../theme/ThemeProvider";

export interface WeekdaysProps {
  firstDayOfWeek?: number;
  direction?: "rtl" | "ltr";
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const Weekdays: React.FC<WeekdaysProps> = ({
  firstDayOfWeek = 0,
  direction = "rtl",
  classNames,
  styles,
}) => {
  const { theme } = useTheme();
  const normalizedFirstDay =
    ((Math.trunc(firstDayOfWeek) % 7) + 7) % 7;
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const dayIndex = (normalizedFirstDay + index) % 7;
    return {
      dayIndex,
      label: PERSIAN_WEEK_DAYS_SHORT[dayIndex],
    };
  });

  return (
    <div
      role="row"
      dir={direction}
      className={classNames?.weekdays}
      style={{
        display: "grid",
        width: "var(--pdp-calendar-pane-width, 276px)",
        gridTemplateColumns: "repeat(7, var(--pdp-cell-size, 36px))",
        gap: "var(--pdp-cell-gap, 4px)",
        padding: "6px 0 4px",
        textAlign: "center",
        userSelect: "none",
        ...styles?.weekdays,
      }}
    >
      {weekdays.map(({ dayIndex, label }) => (
        <span
          key={dayIndex}
          role="columnheader"
          className={classNames?.weekdayCell}
          style={{
            display: "inline-flex",
            width: "var(--pdp-cell-size, 36px)",
            height: "28px",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.78rem",
            fontWeight: 700,
            color:
              dayIndex === 6
                ? theme.colors.holiday
                : theme.colors.textSecondary,
            ...styles?.weekdayCell,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
};
