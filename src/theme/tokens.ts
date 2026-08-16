// src/theme/tokens.ts
import { Theme } from "./types";

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    // Primary
    primary: "#4F46E5", // Indigo 600
    primaryHover: "#4338CA", // Indigo 700
    primaryText: "#FFFFFF",

    // Background
    background: "#FFFFFF",
    backgroundHover: "#F8FAFC", // Slate 50

    // Surface
    surface: "#F1F5F9", // Slate 100

    // Border
    border: "#CBD5E1", // Slate 300

    // Text
    textPrimary: "#0F172A", // Slate 900
    textSecondary: "#475569", // Slate 600
    textDisabled: "#94A3B8", // Slate 400

    // Holiday
    holiday: "#E11D48", // Rose 600
    holidayBackground: "#FFF1F2", // Rose 50

    // Selected range
    rangeBackground: "#E0E7FF", // Indigo 100

    // Today
    todayBorder: "#4F46E5", // Indigo 600
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
    // Primary
    primary: "#818CF8", // Indigo 400
    primaryHover: "#A5B4FC", // Indigo 300
    primaryText: "#0F172A",

    // Background
    background: "#0F172A", // Slate 900
    backgroundHover: "#1E293B", // Slate 800

    // Surface
    surface: "#1E293B", // Slate 800

    // Border
    border: "#475569", // Slate 600

    // Text
    textPrimary: "#F8FAFC", // Slate 50
    textSecondary: "#CBD5E1", // Slate 300
    textDisabled: "#64748B", // Slate 500

    // Holiday
    holiday: "#FB7185", // Rose 400
    holidayBackground: "#3F1D2E",

    // Selected range
    rangeBackground: "#3730A3", // Indigo 700

    // Today
    todayBorder: "#A5B4FC", // Indigo 300
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
