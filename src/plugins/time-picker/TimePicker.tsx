// src/plugins/time-picker/TimePicker.tsx
import React from 'react';
import type { JalaliTime } from './types';
import type { DatePickerClassNames, DatePickerStyles } from '../../theme/style-slots';

export interface TimePickerProps {
  value?: JalaliTime;
  hours?: number;
  minutes?: number;
  seconds?: number;
  minuteStep?: number;
  hourStep?: number;
  showSeconds?: boolean;
  digitType?: 'persian' | 'latin';
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
  onChange: (time: JalaliTime) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  hours,
  minutes,
  seconds,
  minuteStep = 1,
  hourStep = 1,
  showSeconds = false,
  classNames,
  styles,
  onChange,
}) => {
  // Normalize time attributes from incoming props or fallback to 0
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
    background: 'var(--pdp-surface-subtle, #f8fafc)',
    color: 'var(--pdp-text-primary, #0f172a)',
    border: '1px solid var(--pdp-surface-border, #e2e8f0)',
    borderRadius: '6px',
    padding: '4px 6px',
    fontSize: '12px',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
    direction: 'ltr',
  };

  return (
    <div
      className={classNames?.timePicker}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderTop: '1px solid var(--pdp-surface-border, #e2e8f0)',
        direction: 'ltr',
        color: 'var(--pdp-text-primary, #0f172a)',
        ...styles?.timePicker,
      }}
    >
      <span
        style={{
          fontSize: '12px',
          color: 'var(--pdp-text-muted, #64748b)',
          marginRight: '4px',
          fontWeight: 500,
        }}
      >
        Time:
      </span>

      {/* Hours Select */}
      <select
        value={hour}
        onChange={handleHourChange}
        style={selectStyle}
        aria-label="Select Hour"
      >
        {Array.from({ length: Math.ceil(24 / hourStep) }, (_, i) => i * hourStep).map((h) => (
          <option key={h} value={h}>
            {String(h).padStart(2, '0')}
          </option>
        ))}
      </select>

      <span style={{ color: 'var(--pdp-text-muted, #64748b)', fontWeight: 700 }}>:</span>

      {/* Minutes Select */}
      <select
        value={minute}
        onChange={handleMinuteChange}
        style={selectStyle}
        aria-label="Select Minute"
      >
        {Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep).map((m) => (
          <option key={m} value={m}>
            {String(m).padStart(2, '0')}
          </option>
        ))}
      </select>

      {/* Optional Seconds Select */}
      {showSeconds && (
        <>
          <span style={{ color: 'var(--pdp-text-muted, #64748b)', fontWeight: 700 }}>:</span>
          <select
            value={second}
            onChange={handleSecondChange}
            style={selectStyle}
            aria-label="Select Second"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
