import React from "react";
import type { JalaliDayOfWeek } from "../core/types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";
import { PERSIAN_WEEK_DAYS_SHORT } from "../core/constants";

export interface WeekdaysProps {
  firstDayOfWeek?: JalaliDayOfWeek;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const Weekdays: React.FC<WeekdaysProps> = ({
  firstDayOfWeek = 0,
  classNames,
  styles,
}) => {
  const orderedWeekdays = [
    ...PERSIAN_WEEK_DAYS_SHORT.slice(firstDayOfWeek),
    ...PERSIAN_WEEK_DAYS_SHORT.slice(0, firstDayOfWeek),
  ];

  return (
    <div
      role="row"
      aria-label="روزهای هفته"
      className={classNames?.weekdays}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, var(--pdp-cell-size, 36px))",
        gap: "4px",
        marginBottom: "6px",
        textAlign: "center",
        ...styles?.weekdays,
      }}
    >
      {orderedWeekdays.map((name, idx) => (
        <div
          key={idx}
          role="columnheader"
          className={classNames?.weekdayCell}
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--pdp-text-muted, #94a3b8)",
            userSelect: "none",
            ...styles?.weekdayCell,
          }}
        >
          {name}
        </div>
      ))}
    </div>
  );
};
