import React from "react";
import { useTheme } from "../../theme/ThemeProvider";
import type { JalaliTime } from "./types";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../../theme/style-slots";

export interface TimePickerProps {
  value?: JalaliTime;
  hours?: number;
  minutes?: number;
  seconds?: number;
  hour?: number;
  minute?: number;
  second?: number;
  minuteStep?: number;
  hourStep?: number;
  showSeconds?: boolean;
  digitType?: "persian" | "latin";
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
  onChange: (time: JalaliTime) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  hours,
  minutes,
  seconds,
  hour = value?.hour ?? hours ?? 0,
  minute = value?.minute ?? minutes ?? 0,
  second = value?.second ?? seconds ?? 0,
  minuteStep = 1,
  hourStep = 1,
  showSeconds = false,
  onChange,
}) => {
  const { theme } = useTheme();

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ hour: parseInt(e.target.value, 10), minute, second });
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ hour, minute: parseInt(e.target.value, 10), second });
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ hour, minute, second: parseInt(e.target.value, 10) });
  };

  const selectStyle: React.CSSProperties = {
    background: theme.colors.surface,
    color: theme.colors.textPrimary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii.sm,
    padding: "4px 6px",
    fontSize: "0.85rem",
    fontWeight: 600,
    outline: "none",
    cursor: "pointer",
    direction: "ltr",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "8px 12px",
        borderTop: `1px solid ${theme.colors.border}`,
        direction: "ltr",
      }}
    >
      <span
        style={{
          fontSize: "0.8rem",
          color: theme.colors.textSecondary,
          marginRight: "4px",
        }}
      >
        زمان:
      </span>

      <select value={hour} onChange={handleHourChange} style={selectStyle}>
        {Array.from(
          { length: Math.ceil(24 / hourStep) },
          (_, i) => i * hourStep,
        ).map((h) => (
          <option key={h} value={h}>
            {String(h).padStart(2, "0")}
          </option>
        ))}
      </select>

      <span style={{ color: theme.colors.textSecondary, fontWeight: 700 }}>
        :
      </span>

      <select value={minute} onChange={handleMinuteChange} style={selectStyle}>
        {Array.from(
          { length: Math.ceil(60 / minuteStep) },
          (_, i) => i * minuteStep,
        ).map((m) => (
          <option key={m} value={m}>
            {String(m).padStart(2, "0")}
          </option>
        ))}
      </select>

      {showSeconds && (
        <>
          <span style={{ color: theme.colors.textSecondary, fontWeight: 700 }}>
            :
          </span>
          <select
            value={second}
            onChange={handleSecondChange}
            style={selectStyle}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
