// src/components/footer/CalendarFooter.tsx
import React from "react";
import { useTheme } from "../../theme/ThemeProvider";

export interface CalendarFooterProps {
  onToday?: () => void;
  onClear?: () => void;
  onTodayClick?: () => void;
  onClearClick?: () => void;
  showClear?: boolean;
  showActions?: boolean;
  [key: string]: any;
}

export const CalendarFooter: React.FC<CalendarFooterProps> = ({
  onToday,
  onClear,
  onTodayClick,
  onClearClick,
}) => {
  const { theme } = useTheme();

  const handleToday = onToday || onTodayClick;
  const handleClear = onClear || onClearClick;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderTop: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      {handleToday && (
        <button
          type="button"
          onClick={handleToday}
          style={{
            padding: "5px 12px",
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.background,
            color: theme.colors.primary,
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme.colors.rangeBackground;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.background;
          }}
        >
          برو به امروز
        </button>
      )}

      {handleClear && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: "5px 12px",
            borderRadius: theme.radii.sm,
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.background,
            color: theme.colors.textSecondary,
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.colors.holiday;
            e.currentTarget.style.borderColor = theme.colors.holiday;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.colors.textSecondary;
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        >
          پاک کردن
        </button>
      )}
    </div>
  );
};
