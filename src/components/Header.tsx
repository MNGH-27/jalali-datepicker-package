import React, { useState } from "react";
import { toPersianDigits } from "../formatters/persian-digits";
import type {
  DatePickerClassNames,
  DatePickerStyles,
} from "../theme/style-slots";
import { useTheme } from "../theme/ThemeProvider";

export interface HeaderProps {
  year: number;
  monthName: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTitleClick?: () => void;
  isPickerOpen?: boolean;
  digitType?: "persian" | "latin";
  direction?: "rtl" | "ltr";
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
}

type HoverTarget = "prev" | "title" | "next" | null;

export const Header: React.FC<HeaderProps> = ({
  year,
  monthName,
  onPrevMonth,
  onNextMonth,
  onTitleClick,
  isPickerOpen = false,
  digitType = "persian",
  direction = "rtl",
  classNames,
  styles,
}) => {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState<HoverTarget>(null);
  const displayYear =
    digitType === "persian" ? toPersianDigits(year) : String(year);

  const navStyle = (target: Exclude<HoverTarget, "title" | null>) => ({
    width: "32px",
    height: "32px",
    padding: 0,
    borderRadius: theme.radii.md,
    border: "none",
    backgroundColor:
      hovered === target ? theme.colors.backgroundHover : "transparent",
    color: theme.colors.textPrimary,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.15s ease, color 0.15s ease",
    ...styles?.navButton,
  });

  return (
    <div
      dir={direction}
      className={classNames?.header}
      style={{
        display: "flex",
        minHeight: "40px",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        padding: "4px 0 10px",
        borderBottom: `1px solid ${theme.colors.border}`,
        userSelect: "none",
        ...styles?.header,
      }}
    >
      <button
        type="button"
        onClick={onPrevMonth}
        aria-label="ماه قبل"
        className={classNames?.navButton}
        style={navStyle("prev")}
        onMouseEnter={() => setHovered("prev")}
        onMouseLeave={() => setHovered(null)}
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
          aria-hidden="true"
          style={{ transform: direction === "ltr" ? "scaleX(-1)" : undefined }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onTitleClick}
        aria-expanded={isPickerOpen}
        className={classNames?.headerTitle}
        style={{
          minHeight: "32px",
          padding: "6px 12px",
          borderRadius: theme.radii.md,
          border: "none",
          backgroundColor:
            isPickerOpen || hovered === "title"
              ? theme.colors.backgroundHover
              : "transparent",
          color: theme.colors.textPrimary,
          cursor: onTitleClick ? "pointer" : "default",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontSize: "0.95rem",
          fontWeight: 700,
          whiteSpace: "nowrap",
          transition: "background-color 0.15s ease",
          ...styles?.headerTitle,
        }}
        onMouseEnter={() => setHovered("title")}
        onMouseLeave={() => setHovered(null)}
      >
        <span>
          {monthName} {displayYear}
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
          aria-hidden="true"
          style={{
            transform: isPickerOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onNextMonth}
        aria-label="ماه بعد"
        className={classNames?.navButton}
        style={navStyle("next")}
        onMouseEnter={() => setHovered("next")}
        onMouseLeave={() => setHovered(null)}
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
          aria-hidden="true"
          style={{ transform: direction === "ltr" ? "scaleX(-1)" : undefined }}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>
  );
};
