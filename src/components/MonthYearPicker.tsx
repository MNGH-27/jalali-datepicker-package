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
        gap: "10px",
        padding: "12px",
        width: "100%",
        height: "280px",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      {/* اسکرول افقی سال‌ها */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "none",
        }}
      >
        {Array.from({ length: 35 }, (_, i) => currentYear - 17 + i).map(
          (year) => {
            const isSelected = year === currentYear;
            return (
              <button
                key={year}
                ref={isSelected ? selectedYearRef : undefined}
                type="button"
                onClick={() => onSelectYear(year)}
                style={{
                  padding: "6px 12px",
                  borderRadius: theme.radii.md,
                  border: "none",
                  background: isSelected ? theme.colors.primary : "transparent",
                  color: isSelected
                    ? theme.colors.primaryText
                    : theme.colors.textPrimary,
                  cursor: "pointer",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.85rem",
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

      {/* ماتریس ۳ در ۴ ماه‌های سال */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: "8px",
          flex: 1,
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
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
