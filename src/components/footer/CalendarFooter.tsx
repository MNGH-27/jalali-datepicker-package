// src/components/footer/CalendarFooter.tsx
import React from "react";
import { useTheme } from "../../theme/ThemeProvider";

export interface CalendarFooterProps {
  onTodayClick?: () => void;
  onClearClick?: () => void;
  showClear?: boolean;
  mode?: any;
  digitType?: "persian" | "latin";
  showStatusText?: boolean;
  showActions?: boolean;
  selectedDate?: any;
  selectedRange?: any;
  styles?: any;
  [key: string]: any;
}

export const CalendarFooter: React.FC<CalendarFooterProps> = ({
  onTodayClick,
  onClearClick,
  showClear = true,
}) => {
  const { theme } = useTheme();

  const buttonStyle: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: theme.radii.md,
    border: `1px solid ${theme.colors.border}`,
    background: "transparent",
    color: theme.colors.textPrimary,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        borderTop: `1px solid ${theme.colors.border}`,
        marginTop: "6px",
      }}
    >
      {onTodayClick && (
        <button
          type="button"
          onClick={onTodayClick}
          style={{
            ...buttonStyle,
            borderColor: theme.colors.primary,
            color: theme.colors.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme.colors.backgroundHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          برو به امروز
        </button>
      )}

      {showClear && onClearClick && (
        <button
          type="button"
          onClick={onClearClick}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme.colors.backgroundHover;
            e.currentTarget.style.color = theme.colors.holiday;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = theme.colors.textPrimary;
          }}
        >
          پاک کردن
        </button>
      )}
    </div>
  );
};
