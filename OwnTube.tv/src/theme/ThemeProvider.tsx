import React, { useState, createContext, PropsWithChildren } from "react";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";

interface ThemeContextType {
  colors: typeof colors.light | typeof colors.dark; // Define theme colors
  typography: typeof typography; // Typography styles
  toggleTheme: () => void; // Function to toggle themes
  isLightTheme: boolean; // Current theme status
}

const defaultTheme: ThemeContextType = {
  colors: colors.light, // Default light theme
  typography, // Typography styles
  toggleTheme: () => {}, // No-op function
  isLightTheme: true, // Default to light theme
};

export const ThemeContext = createContext(defaultTheme);

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [isLightTheme, setLightTheme] = useState(true);
  const toggleTheme = () => setLightTheme((previousState) => !previousState);

  const theme = {
    colors: isLightTheme ? colors.light : colors.dark,
    typography,
    toggleTheme,
    isLightTheme,
  };

  return <ThemeContext.Provider value={theme}> {children} </ThemeContext.Provider>;
};

export default ThemeProvider;
