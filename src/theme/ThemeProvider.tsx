import React, { createContext, useContext, useMemo } from "react";
import { lightTheme, darkTheme } from "./tokens";
import type { Theme, ThemeMode, DeepPartial } from "./types";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: "light",
});

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: lightTheme, mode: "light" };
  }
  return context;
};

export interface DatePickerThemeProviderProps {
  children: React.ReactNode;
  mode?: ThemeMode;
  customTheme?: DeepPartial<Theme>;
}

export const DatePickerThemeProvider: React.FC<
  DatePickerThemeProviderProps
> = ({ children, mode = "light", customTheme }) => {
  const baseTheme = mode === "dark" ? darkTheme : lightTheme;

  const value = useMemo<ThemeContextType>(() => {
    if (!customTheme) {
      return { theme: baseTheme, mode };
    }

    return {
      mode,
      theme: {
        ...baseTheme,
        ...customTheme,
        mode,
        colors: {
          ...baseTheme.colors,
          ...(customTheme.colors || {}),
        },
        radii: {
          ...baseTheme.radii,
          ...(customTheme.radii || {}),
        },
        shadows: {
          ...baseTheme.shadows,
          ...(customTheme.shadows || {}),
        },
      },
    };
  }, [baseTheme, customTheme, mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
