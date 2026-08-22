// src/plugins/time-picker/TimePicker.tsx
import React, { useState, useRef, useEffect } from "react";
import type { JalaliTime } from "./types";
import { toPersianDigits } from "../../formatters/persian-digits";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../../theme/style-slots";

export interface TimePickerProps {
  value: JalaliTime;
  onChange: (time: JalaliTime) => void;
  minuteStep?: number;
  hourStep?: number;
  showSeconds?: boolean;
  digitType?: "persian" | "latin";
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minuteStep = 1,
  hourStep = 1,
  showSeconds = false,
  digitType = "persian",
  classNames,
  styles,
}) => {
  const [openDropdown, setOpenDropdown] = useState<
    "hour" | "minute" | "second" | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from(
    { length: Math.ceil(24 / hourStep) },
    (_, i) => i * hourStep,
  );
  const minutes = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep,
  );
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const formatNum = (n: number) => {
    const formatted = String(n).padStart(2, "0");
    return digitType === "persian" ? toPersianDigits(formatted) : formatted;
  };

  const renderSelectColumn = (
    type: "hour" | "minute" | "second",
    currentVal: number,
    options: number[],
    onSelect: (val: number) => void,
  ) => {
    const isOpen = openDropdown === type;

    return (
      <div style={{ position: "relative" }}>
        {/* Clickable Badge Trigger */}
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : type)}
          style={{
            minWidth: "40px",
            height: "30px",
            padding: "0 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            backgroundColor: isOpen
              ? "var(--pdp-primary, #4f46e5)"
              : "var(--pdp-surface-bg, #ffffff)",
            color: isOpen ? "#ffffff" : "var(--pdp-text-primary, #0f172a)",
            border: `1px solid ${isOpen ? "var(--pdp-primary, #4f46e5)" : "var(--pdp-surface-border, #e2e8f0)"}`,
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s ease",
            boxShadow: isOpen ? "0 0 0 2px rgba(79, 70, 229, 0.2)" : "none",
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = "var(--pdp-primary, #4f46e5)";
              e.currentTarget.style.backgroundColor =
                "var(--pdp-hover-bg, #f1f5f9)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor =
                "var(--pdp-surface-border, #e2e8f0)";
              e.currentTarget.style.backgroundColor =
                "var(--pdp-surface-bg, #ffffff)";
            }
          }}
        >
          {formatNum(currentVal)}
        </button>

        {/* Scrollable Dropdown List */}
        {isOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 4px)",
              left: "50%",
              transform: "translateX(-50%)",
              maxHeight: "140px",
              width: "52px",
              overflowY: "auto",
              backgroundColor: "var(--pdp-surface-bg, #ffffff)",
              border: "1px solid var(--pdp-surface-border, #e2e8f0)",
              borderRadius: "8px",
              boxShadow:
                "var(--pdp-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.15))",
              zIndex: 1050,
              padding: "4px 2px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {options.map((opt) => {
              const isSelected = opt === currentVal;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    setOpenDropdown(null);
                  }}
                  style={{
                    padding: "4px 0",
                    border: "none",
                    borderRadius: "4px",
                    background: isSelected
                      ? "var(--pdp-primary, #4f46e5)"
                      : "transparent",
                    color: isSelected
                      ? "#ffffff"
                      : "var(--pdp-text-primary, #0f172a)",
                    fontSize: "12px",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor =
                        "var(--pdp-hover-bg, #f1f5f9)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {formatNum(opt)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={classNames?.timePicker}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "6px 12px",
        borderTop: "1px solid var(--pdp-surface-border, #e2e8f0)",
        backgroundColor: "var(--pdp-surface-subtle, #f8fafc)",
        borderRadius:
          "0 0 var(--pdp-border-radius, 10px) var(--pdp-border-radius, 10px)",
        direction: "ltr",
        userSelect: "none",
        ...styles?.timePicker,
      }}
    >
      {/* ساعت */}
      {renderSelectColumn("hour", value.hour, hours, (h) =>
        onChange({ ...value, hour: h }),
      )}

      <span
        style={{
          fontWeight: 800,
          color: "var(--pdp-text-muted, #94a3b8)",
          fontSize: "14px",
        }}
      >
        :
      </span>

      {/* دقیقه */}
      {renderSelectColumn("minute", value.minute, minutes, (m) =>
        onChange({ ...value, minute: m }),
      )}

      {/* ثانیه */}
      {showSeconds && (
        <>
          <span
            style={{
              fontWeight: 800,
              color: "var(--pdp-text-muted, #94a3b8)",
              fontSize: "14px",
            }}
          >
            :
          </span>
          {renderSelectColumn("second", value.second ?? 0, seconds, (s) =>
            onChange({ ...value, second: s }),
          )}
        </>
      )}
    </div>
  );
};
