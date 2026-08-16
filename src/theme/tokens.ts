import type { DatePickerTokens } from "./types";

import { Theme } from "./types";

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryText: "#ffffff",
    background: "#ffffff",
    backgroundHover: "#f1f5f9",
    surface: "#f8fafc",
    border: "#e2e8f0",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    textDisabled: "#cbd5e1",
    holiday: "#ef4444",
    holidayBackground: "#fef2f2",
    rangeBackground: "#dbeafe",
    todayBorder: "#3b82f6",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    primary: "#3b82f6",
    primaryHover: "#60a5fa",
    primaryText: "#ffffff",
    background: "#0f172a",
    backgroundHover: "#1e293b",
    surface: "#1e293b",
    border: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textDisabled: "#475569",
    holiday: "#f87171",
    holidayBackground: "#451a1a",
    rangeBackground: "#1e3a8a",
    todayBorder: "#60a5fa",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
  },
};

/**
 * Maps camelCase tokens to kebab-case CSS variables for injection.
 */
export function tokensToCssVariables(
  tokens: Partial<DatePickerTokens>,
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (value !== undefined) {
      const cssVarName = `--pdp-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      vars[cssVarName] = value;
    }
  }
  return vars;
}
