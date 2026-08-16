// src/plugins/time-picker/TimePicker.tsx
import React from "react";
import { useTheme } from "../../theme/ThemeProvider";
import type { JalaliTime } from "./types";

export interface TimePickerProps {
  value?: JalaliTime;
  hours?: number;
  minutes?: number;
  seconds?: number;
  minuteStep?: number;
  hourStep?: number;
  showSeconds?: boolean;
  onChange: (time: JalaliTime) => void;
  [key: string]: any;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  hours,
  minutes,
  seconds,
  minuteStep = 1,
  hourStep = 1,
  showSeconds = false,
  onChange,
}) => {
  const { theme } = useTheme();

  const hour = value?.hour ?? hours ?? 0;
  const minute = value?.minute ?? minutes ?? 0;
  const second = value?.second ?? seconds ?? 0;

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
    padding: "6px 8px",
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
        gap: "8px",
        padding: "12px 14px",
        borderTop: `1px solid ${theme.colors.border}`,
        direction: "ltr",
        color: theme.colors.textPrimary,
      }}
    >
      <span
        style={{
          fontSize: "0.85rem",
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
          <option
            key={h}
            value={h}
            style={{
              background: theme.colors.background,
              color: theme.colors.textPrimary,
            }}
          >
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
          <option
            key={m}
            value={m}
            style={{
              background: theme.colors.background,
              color: theme.colors.textPrimary,
            }}
          >
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
              <option
                key={i}
                value={i}
                style={{
                  background: theme.colors.background,
                  color: theme.colors.textPrimary,
                }}
              >
                {String(i).padStart(2, "0")}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
