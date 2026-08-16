// src/theme/types.ts
export type ThemeMode = "light" | "dark" | "auto";

export interface DatePickerTokens {
  // Primary Palette
  primaryColor: string;
  primaryHover: string;
  primaryActive: string;
  primaryContrastText: string;

  // Range Selection Colors
  rangeBetweenBg: string;
  rangeBetweenText: string;

  // Background & Borders
  surfaceBg: string;
  surfaceBorder: string;
  headerBg: string;

  // Typography Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;

  // Today Indicator
  todayIndicatorColor: string;

  // Geometry & Elevations
  borderRadius: string;
  cellSize: string;
  shadow: string;
  fontFamily: string;
}

export interface ThemeContextValue {
  tokens: DatePickerTokens;
  mode: ThemeMode;
}

export interface DatePickerThemeProviderProps {
  mode?: ThemeMode;
  customTokens?: Partial<DatePickerTokens>;
  children: React.ReactNode;
}
