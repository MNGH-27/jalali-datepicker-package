// src/components/Header.tsx
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderBottom: `1px solid ${theme.colors.border}`,
        userSelect: "none",
      }}
    >
      {/* دکمه ماه قبل */}
      <button
        type="button"
        onClick={onPrevMonth}
        aria-label="ماه قبل"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          borderRadius: theme.radii.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textPrimary,
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* عنوان ماه و سال */}
      <button
        type="button"
        onClick={onTitleClick}
        style={{
          background: isPickerOpen
            ? theme.colors.backgroundHover
            : "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: theme.radii.md,
          fontSize: "0.95rem",
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
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isPickerOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* دکمه ماه بعد */}
      <button
        type="button"
        onClick={onNextMonth}
        aria-label="ماه بعد"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          borderRadius: theme.radii.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textPrimary,
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>
  );
};
