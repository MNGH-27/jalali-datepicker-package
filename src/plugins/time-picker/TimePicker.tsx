import React, { useCallback } from "react";
import type { TimePickerProps, JalaliTime } from "./types";
import { formatTimeSegment, getCurrentTime, clampTime } from "./time-utils";

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  defaultValue,
  onChange,
  minuteStep = 1,
  hourStep = 1,
  showSeconds = false,
  digitType = "persian",
  disabled = false,
  styles,
  classNames,
}) => {
  // Internal state for uncontrolled usage
  const [internalTime, setInternalTime] = React.useState<JalaliTime>(
    defaultValue ?? getCurrentTime(),
  );

  // Active time resolution (controlled vs uncontrolled)
  const activeTime =
    value !== undefined ? (value ?? getCurrentTime()) : internalTime;

  // Handles state updates and triggers onChange
  const updateTime = useCallback(
    (newTime: JalaliTime) => {
      const clamped = clampTime(newTime);
      if (value === undefined) {
        setInternalTime(clamped);
      }
      onChange?.(clamped);
    },
    [value, onChange],
  );

  // Hour increment / decrement
  const changeHour = (delta: number) => {
    const newHour = (activeTime.hour + delta * hourStep + 24) % 24;
    updateTime({ ...activeTime, hour: newHour });
  };

  // Minute increment / decrement
  const changeMinute = (delta: number) => {
    const newMinute = (activeTime.minute + delta * minuteStep + 60) % 60;
    updateTime({ ...activeTime, minute: newMinute });
  };

  // Second increment / decrement
  const changeSecond = (delta: number) => {
    if (!showSeconds) return;
    const currentSec = activeTime.second ?? 0;
    const newSecond = (currentSec + delta + 60) % 60;
    updateTime({ ...activeTime, second: newSecond });
  };

  const buttonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    color: "var(--pdp-primary-color, #0284c7)",
    fontSize: "12px",
    padding: "2px 6px",
    lineHeight: 1,
  };

  const segmentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const digitStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--pdp-text-primary, #0f172a)",
    minWidth: "24px",
    textAlign: "center",
  };

  return (
    <div
      role="group"
      aria-label="Time Selection"
      className={classNames?.timePicker}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "8px 12px",
        borderTop: "1px solid var(--pdp-surface-border, #e2e8f0)",
        backgroundColor: "var(--pdp-header-bg, #f8fafc)",
        borderRadius:
          "0 0 var(--pdp-border-radius, 8px) var(--pdp-border-radius, 8px)",
        direction: "ltr", // Preserves standard (HH:MM:SS) layout direction ,
        ...styles?.timePicker,
      }}
    >
      {/* Hours Column */}
      <div style={segmentStyle}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => changeHour(1)}
          style={buttonStyle}
          aria-label="Increase Hour"
        >
          ▼
        </button>
        <span style={digitStyle}>
          {formatTimeSegment(activeTime.hour, digitType)}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => changeHour(-1)}
          style={buttonStyle}
          aria-label="Decrease Hour"
        >
          ▲
        </button>
      </div>

      <span
        style={{ fontWeight: 700, color: "var(--pdp-text-secondary, #475569)" }}
      >
        :
      </span>

      {/* Minutes Column */}
      <div style={segmentStyle}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => changeMinute(1)}
          style={buttonStyle}
          aria-label="Increase Minute"
        >
          ▲
        </button>
        <span style={digitStyle}>
          {formatTimeSegment(activeTime.minute, digitType)}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => changeMinute(-1)}
          style={buttonStyle}
          aria-label="Decrease Minute"
        >
          ▼
        </button>
      </div>

      {/* Seconds Column (Optional) */}
      {showSeconds && (
        <>
          <span
            style={{
              fontWeight: 700,
              color: "var(--pdp-text-secondary, #475569)",
            }}
          >
            :
          </span>
          <div style={segmentStyle}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => changeSecond(1)}
              style={buttonStyle}
              aria-label="Increase Second"
            >
              ▲
            </button>
            <span style={digitStyle}>
              {formatTimeSegment(activeTime.second ?? 0, digitType)}
            </span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => changeSecond(-1)}
              style={buttonStyle}
              aria-label="Decrease Second"
            >
              ▼
            </button>
          </div>
        </>
      )}
    </div>
  );
};
