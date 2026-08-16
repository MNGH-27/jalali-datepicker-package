// src/components/Weekdays.tsx
import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import { PERSIAN_WEEK_DAYS_SHORT } from "../core/constants";

export const Weekdays: React.FC<{ firstDayOfWeek?: number }> = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        textAlign: "center",
        padding: "6px 0",
        marginBottom: "4px",
        userSelect: "none",
      }}
    >
      {PERSIAN_WEEK_DAYS_SHORT.map((day, idx) => (
        <span
          key={day}
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color:
              idx === 6 ? theme.colors.holiday : theme.colors.textSecondary,
          }}
        >
          {day}
        </span>
      ))}
    </div>
  );
};
