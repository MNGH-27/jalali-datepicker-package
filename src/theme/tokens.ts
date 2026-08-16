// src/theme/tokens.ts
import { Theme } from "./types";

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    primary: "#4f46e5", // Indigo-600 مدرن و خوانا
    primaryHover: "#4338ca", // Indigo-700
    primaryText: "#ffffff",
    background: "#ffffff",
    backgroundHover: "#f8fafc", // Slate-50 نرم
    surface: "#f1f5f9", // Slate-100
    border: "#e2e8f0", // Slate-200
    textPrimary: "#0f172a", // Slate-900
    textSecondary: "#64748b", // Slate-500
    textDisabled: "#cbd5e1", // Slate-300
    holiday: "#e11d48", // Rose-600
    holidayBackground: "#fff1f2", // Rose-50
    rangeBackground: "#e0e7ff", // Indigo-100
    todayBorder: "#4f46e5",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    primary: "#6366f1", // Indigo-500
    primaryHover: "#4f46e5",
    primaryText: "#ffffff",
    background: "#0f172a", // Slate-900
    backgroundHover: "#1e293b", // Slate-800
    surface: "#1e293b",
    border: "#334155", // Slate-700
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textDisabled: "#475569",
    holiday: "#fb7185", // Rose-400
    holidayBackground: "#4c0519", // Rose-950
    rangeBackground: "#312e81", // Indigo-900
    todayBorder: "#818cf8",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
  },
};
