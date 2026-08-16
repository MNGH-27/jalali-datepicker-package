// src/theme/tokens.ts
import { Theme } from "./types";

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    primaryText: "#ffffff",
    background: "#ffffff",
    backgroundHover: "#f1f5f9",
    surface: "#f8fafc",
    border: "#e2e8f0",
    textPrimary: "#1e293b", // رنگ تیره و واضح برای متون عادی و اعداد
    textSecondary: "#64748b", // رنگ خاکستری برای سرستون‌ها و عناوین فرعی
    textDisabled: "#cbd5e1", // روزهای ماه قبل/بعد
    holiday: "#e11d48", // قرمز روزهای جمعه و تعطیل
    holidayBackground: "#fff1f2",
    rangeBackground: "#e0e7ff",
    todayBorder: "#4f46e5",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
    lg: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    primaryText: "#ffffff",
    background: "#0f172a",
    backgroundHover: "#1e293b",
    surface: "#1e293b",
    border: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textDisabled: "#475569",
    holiday: "#fb7185",
    holidayBackground: "#4c0519",
    rangeBackground: "#312e81",
    todayBorder: "#818cf8",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
  },
};
