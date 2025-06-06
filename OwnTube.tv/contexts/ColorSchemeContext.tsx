import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName, Platform } from "react-native";
import { readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { colorSchemes } from "../theme";
import { useAppConfigContext } from "./AppConfigContext";

const ColorSchemeContext = createContext<{ scheme: ColorSchemeName; toggleScheme?: () => void }>({
  scheme: null,
});

export const ColorSchemeContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorSchemeName>(null);
  const { currentInstanceConfig } = useAppConfigContext();

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

    if (Platform.OS === "web") {
      document?.documentElement?.style?.setProperty("--focus-color", colorSchemes[selectedColorScheme].colors.theme950);
    }
  }, [selectedColorScheme, currentInstanceConfig]);

  const toggleScheme = () => setSelectedColorScheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ColorSchemeContext.Provider value={{ scheme: selectedColorScheme, toggleScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorSchemeContext = () => useContext(ColorSchemeContext);
