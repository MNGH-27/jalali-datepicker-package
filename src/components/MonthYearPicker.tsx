// src/components/MonthYearPicker.tsx
import React, { useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { PERSIAN_MONTH_NAMES } from "../core/constants";
import { toPersianDigits } from "../formatters/persian-digits";

export interface MonthYearPickerProps {
  currentYear: number;
  currentMonth: number;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  currentYear,
  currentMonth,
  onSelectMonth,
  onSelectYear,
}) => {
  const { theme } = useTheme();
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentYear]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "10px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "4px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "none",
        }}
      >
        {Array.from({ length: 31 }, (_, i) => currentYear - 15 + i).map(
          (year) => {
            const isSelected = year === currentYear;
            return (
              <button
                key={year}
                ref={isSelected ? selectedYearRef : undefined}
                type="button"
                onClick={() => onSelectYear(year)}
                style={{
                  padding: "4px 10px",
                  borderRadius: theme.radii.sm,
                  border: "none",
                  background: isSelected ? theme.colors.primary : "transparent",
                  color: isSelected
                    ? theme.colors.primaryText
                    : theme.colors.textPrimary,
                  cursor: "pointer",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor =
                      theme.colors.backgroundHover;
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {toPersianDigits(year)}
              </button>
            );
          },
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
        }}
      >
        {PERSIAN_MONTH_NAMES.map((name, index) => {
          const isSelected = index + 1 === currentMonth;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectMonth(index + 1)}
              style={{
                padding: "8px 4px",
                borderRadius: theme.radii.md,
                border: "none",
                background: isSelected
                  ? theme.colors.primary
                  : theme.colors.surface,
                color: isSelected
                  ? theme.colors.primaryText
                  : theme.colors.textPrimary,
                cursor: "pointer",
                fontWeight: isSelected ? 700 : 500,
                fontSize: "0.82rem",
                textAlign: "center",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor =
                    theme.colors.backgroundHover;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
