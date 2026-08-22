// src/components/Weekdays.tsx
import React from "react";
import { PERSIAN_WEEK_DAYS_SHORT } from "../core/constants";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";

export interface WeekdaysProps {
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const Weekdays: React.FC<WeekdaysProps> = ({
  firstDayOfWeek = 0,
  classNames,
  styles,
}) => {
  // مرتب‌سازی روزهای هفته بر اساس firstDayOfWeek
  const weekdays = React.useMemo(() => {
    const days = [...PERSIAN_WEEK_DAYS_SHORT];
    const rotated = [
      ...days.slice(firstDayOfWeek),
      ...days.slice(0, firstDayOfWeek),
    ];
    return rotated;
  }, [firstDayOfWeek]);

  return (
    <div
      role="row"
      className={classNames?.weekdays}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, var(--pdp-cell-size, 34px))",
        gap: "4px",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "6px",
        userSelect: "none",
        ...styles?.weekdays,
      }}
    >
      {weekdays.map((day, idx) => {
        // اگر جمعه باشد (در حالت شنبه تا جمعه، آخرین ایندکس ۶ است)
        const isFriday = (idx + firstDayOfWeek) % 7 === 6;

        return (
          <div
            key={day}
            role="columnheader"
            aria-label={day}
            className={classNames?.weekdayCell}
            style={{
              width: "var(--pdp-cell-size, 34px)",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11.5px",
              fontWeight: 700,
              color: isFriday
                ? "var(--pdp-holiday-color, #e11d48)"
                : "var(--pdp-text-muted, #94a3b8)",
              textAlign: "center",
              ...styles?.weekdayCell,
            }}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};
