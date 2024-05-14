import { useState, createContext, PropsWithChildren, useContext } from "react";
import { colors, typography } from "../theme";

interface IThemeContext {
  colors: typeof colors.light | typeof colors.dark; // Define theme colors
  typography: typeof typography; // Typography styles
  toggleTheme: () => void; // Function to toggle themes
  isLightTheme: boolean; // Current theme status
}

export const ThemeContext = createContext<IThemeContext>({
  colors: colors.light, // Default light theme
  typography, // Typography styles
  toggleTheme: () => {}, // No-op function
  isLightTheme: true, // Default to light theme
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [isLightTheme, setIsLightTheme] = useState<boolean>(true);
  const toggleTheme = () => setIsLightTheme((previousState) => !previousState);

  const theme = {
    colors: isLightTheme ? colors.light : colors.dark,
    typography,
    toggleTheme,
    isLightTheme,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
