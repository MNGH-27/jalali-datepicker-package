import React, { useMemo } from "react";
import type { PresetsBarProps, DatePickerPreset } from "./types";
import { getDefaultJalaliPresets } from "./default-presets";
import { isSameJalaliDay } from "../../core/jalali-math";
import type { JalaliDate } from "../../core/types";
import type { JalaliDateRange } from "../../hooks/types";

export const PresetsBar: React.FC<PresetsBarProps> = ({
  presets,
  onSelectPreset,
  selectedValue,
  orientation = "vertical",
  digitType = "persian",
  disabled = false,
  classNames,
  styles,
}) => {
  const activePresets: DatePickerPreset[] = useMemo(() => {
    return presets ?? getDefaultJalaliPresets(digitType);
  }, [presets, digitType]);

  const isPresetActive = (preset: DatePickerPreset): boolean => {
    if (!selectedValue) return false;
    const val = preset.getValue();

    if (!Array.isArray(val) && !Array.isArray(selectedValue)) {
      return isSameJalaliDay(val as JalaliDate, selectedValue as JalaliDate);
    }

    if (Array.isArray(val) && Array.isArray(selectedValue)) {
      const [vStart, vEnd] = val as JalaliDateRange;
      const [sStart, sEnd] = selectedValue as JalaliDateRange;
      if (!vStart || !vEnd || !sStart || !sEnd) return false;
      return isSameJalaliDay(vStart, sStart) && isSameJalaliDay(vEnd, sEnd);
    }

    return false;
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: orientation === "vertical" ? "column" : "row",
    gap: "4px",
    padding: "8px",
    backgroundColor: "var(--pdp-header-bg, #f8fafc)",
    borderLeft:
      orientation === "vertical"
        ? "1px solid var(--pdp-surface-border, #e2e8f0)"
        : "none",
    borderBottom:
      orientation === "horizontal"
        ? "1px solid var(--pdp-surface-border, #e2e8f0)"
        : "none",
    overflowX: orientation === "horizontal" ? "auto" : "visible",
    maxHeight: orientation === "vertical" ? "280px" : "none",
    overflowY: orientation === "vertical" ? "auto" : "visible",
    minWidth: orientation === "vertical" ? "110px" : "auto",
    ...styles?.presetsBar,
  };

  return (
    <div
      role="group"
      aria-label="کلیدهای میانبر تاریخ"
      className={classNames?.presetsBar}
      style={containerStyle}
    >
      {activePresets.map((preset: DatePickerPreset) => {
        const active = isPresetActive(preset);
        return (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPreset(preset.getValue())}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: active ? 600 : 400,
              textAlign: "right",
              border: "none",
              borderRadius: "var(--pdp-border-radius, 6px)",
              cursor: disabled ? "not-allowed" : "pointer",
              backgroundColor: active
                ? "var(--pdp-primary-color, #0284c7)"
                : "transparent",
              color: active
                ? "var(--pdp-primary-contrast-text, #ffffff)"
                : "var(--pdp-text-primary, #0f172a)",
              whiteSpace: "nowrap",
              transition: "background-color 0.15s ease, color 0.15s ease",
            }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};
