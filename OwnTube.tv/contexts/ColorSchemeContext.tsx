import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { useInstanceConfig } from "../hooks";

const ColorSchemeContext = createContext<{ scheme: ColorSchemeName; toggleScheme?: () => void }>({
  scheme: null,
});

export const ColorSchemeContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorSchemeName>(null);
  const { currentInstanceConfig } = useInstanceConfig();

  useEffect(() => {
    if (!selectedColorScheme) {
      const deviceScheme = Appearance.getColorScheme();

      readFromAsyncStorage("colorScheme").then((scheme: ColorSchemeName) => {
        setSelectedColorScheme(
          scheme || currentInstanceConfig?.customizations?.pageDefaultTheme || deviceScheme || "light",
        );
      });

      return;
    }

    writeToAsyncStorage("colorScheme", selectedColorScheme);
  }, [selectedColorScheme]);

  const toggleScheme = () => setSelectedColorScheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ColorSchemeContext.Provider value={{ scheme: selectedColorScheme, toggleScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorSchemeContext = () => useContext(ColorSchemeContext);
