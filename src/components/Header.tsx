import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import { toPersianDigits } from "../formatters/persian-digits";

export interface HeaderProps {
  year: number;
  monthName: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTitleClick?: () => void;
  isPickerOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  year,
  monthName,
  onPrevMonth,
  onNextMonth,
  onTitleClick,
  isPickerOpen,
}) => {
  const { theme } = useTheme();

  const arrowButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: theme.radii.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.textPrimary,
    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderBottom: `1px solid ${theme.colors.border}`,
        userSelect: "none",
        height: "42px",
        boxSizing: "border-box",
      }}
    >
      {/* در محیط RTL: فلش راست برای ماه قبل */}
      <button
        type="button"
        onClick={onPrevMonth}
        aria-label="ماه قبل"
        style={arrowButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* دکمه باز/بسته کردن انتخابگر ماه و سال */}
      <button
        type="button"
        onClick={onTitleClick}
        style={{
          background: isPickerOpen
            ? theme.colors.backgroundHover
            : "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: theme.radii.md,
          fontSize: "0.9rem",
          fontWeight: 700,
          color: theme.colors.textPrimary,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
        }}
        onMouseLeave={(e) => {
          if (!isPickerOpen)
            e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <span>
          {monthName} {toPersianDigits(year)}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isPickerOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* در محیط RTL: فلش چپ برای ماه بعد */}
      <button
        type="button"
        onClick={onNextMonth}
        aria-label="ماه بعد"
        style={arrowButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>
  );
};
