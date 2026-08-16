import type { DatePickerTokens } from "./types";

export const lightThemeTokens: DatePickerTokens = {
  primaryColor: "#0284c7", // Sky-600
  primaryHover: "#0369a1",
  primaryActive: "#075985",
  primaryContrastText: "#ffffff",

  rangeBetweenBg: "#e0f2fe", // Sky-100
  rangeBetweenText: "#0369a1",

  surfaceBg: "#ffffff",
  surfaceBorder: "#e2e8f0",
  headerBg: "#f8fafc",

  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#94a3b8",
  textDisabled: "#cbd5e1",

  todayIndicatorColor: "#0284c7",

  borderRadius: "8px",
  cellSize: "36px",
  shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  fontFamily: "inherit",
};

export const darkThemeTokens: DatePickerTokens = {
  primaryColor: "#38bdf8", // Sky-400
  primaryHover: "#7dd3fc",
  primaryActive: "#bae6fd",
  primaryContrastText: "#0f172a",

  rangeBetweenBg: "#082f49", // Sky-950
  rangeBetweenText: "#7dd3fc",

  surfaceBg: "#0f172a",
  surfaceBorder: "#334155",
  headerBg: "#1e293b",

  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#64748b",
  textDisabled: "#475569",

  todayIndicatorColor: "#38bdf8",

  borderRadius: "8px",
  cellSize: "36px",
  shadow: "0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)",
  fontFamily: "inherit",
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
