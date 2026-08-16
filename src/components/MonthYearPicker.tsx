import React, { useState } from "react";
import type { JalaliMonthIndex } from "../core/types";
import { PERSIAN_MONTH_NAMES } from "../core/constants";
import { toPersianDigits } from "../formatters/persian-digits";

export interface MonthYearPickerProps {
  currentYear: number;
  currentMonth: JalaliMonthIndex;
  onSelectMonth: (month: JalaliMonthIndex) => void;
  onSelectYear: (year: number) => void;
  onClose: () => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  currentYear,
  currentMonth,
  onSelectMonth,
  onSelectYear,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<"months" | "years">("months");
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor(currentYear / 12) * 12,
  );

  const years = Array.from({ length: 12 }, (_, i) => yearPageStart + i);

  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: "var(--pdp-surface-bg, #ffffff)",
        borderRadius: "var(--pdp-border-radius, 8px)",
      }}
    >
      {/* Header Selector Switch */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <button
          type="button"
          onClick={() =>
            viewMode === "years" ? setYearPageStart((y) => y - 12) : null
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "var(--pdp-text-primary)",
          }}
        >
          ‹
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setViewMode("months")}
            style={{
              fontWeight: viewMode === "months" ? 700 : 400,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--pdp-primary-color, #0284c7)",
            }}
          >
            {PERSIAN_MONTH_NAMES[currentMonth]}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("years")}
            style={{
              fontWeight: viewMode === "years" ? 700 : 400,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--pdp-primary-color, #0284c7)",
            }}
          >
            {toPersianDigits(currentYear)}
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            viewMode === "years" ? setYearPageStart((y) => y + 12) : null
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "var(--pdp-text-primary)",
          }}
        >
          ›
        </button>
      </div>

      {/* Grid of Months */}
      {viewMode === "months" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}
        >
          {PERSIAN_MONTH_NAMES.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onSelectMonth(index as JalaliMonthIndex);
                onClose();
              }}
              style={{
                padding: "8px 4px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  currentMonth === index
                    ? "var(--pdp-primary-color, #0284c7)"
                    : "transparent",
                color:
                  currentMonth === index
                    ? "#ffffff"
                    : "var(--pdp-text-primary, #0f172a)",
                fontSize: "13px",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Years */}
      {viewMode === "years" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}
        >
          {years.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => {
                onSelectYear(yr);
                setViewMode("months");
              }}
              style={{
                padding: "8px 4px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  currentYear === yr
                    ? "var(--pdp-primary-color, #0284c7)"
                    : "transparent",
                color:
                  currentYear === yr
                    ? "#ffffff"
                    : "var(--pdp-text-primary, #0f172a)",
                fontSize: "13px",
              }}
            >
              {toPersianDigits(yr)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
