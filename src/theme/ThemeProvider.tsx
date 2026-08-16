import React, { createContext, useContext, useMemo } from "react";
import {
  lightThemeTokens,
  darkThemeTokens,
  tokensToCssVariables,
} from "./tokens";
import type { DatePickerThemeProviderProps, ThemeContextValue } from "./types";

const ThemeContext = createContext<ThemeContextValue>({
  tokens: lightThemeTokens,
  mode: "light",
});

export const DatePickerThemeProvider: React.FC<
  DatePickerThemeProviderProps
> = ({ mode = "light", customTokens, children }) => {
  const tokens = useMemo(() => {
    const base = mode === "dark" ? darkThemeTokens : lightThemeTokens;
    return { ...base, ...customTokens };
  }, [mode, customTokens]);

  const cssVariables = useMemo(() => tokensToCssVariables(tokens), [tokens]);

  return (
    <ThemeContext.Provider value={{ tokens, mode }}>
      <div
        className="pdp-theme-root"
        dir="rtl"
        style={{
          ...(cssVariables as React.CSSProperties),
          display: "inline-block",
          fontFamily: tokens.fontFamily,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useDatePickerTheme = (): ThemeContextValue =>
  useContext(ThemeContext);
