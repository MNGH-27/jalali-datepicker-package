// src/theme/types.ts
export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryText: string;
  background: string;
  backgroundHover: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  holiday: string;
  holidayBackground: string;
  rangeBackground: string;
  todayBorder: string;
}

export interface ThemeRadii {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  radii: ThemeRadii;
  shadows: ThemeShadows;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

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
