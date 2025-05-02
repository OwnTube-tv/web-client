import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export interface ColorScheme {
  theme50: string;
  theme100: string;
  theme200: string;
  theme500: string;
  theme600: string;
  theme800: string;
  theme900: string;
  theme950: string;
  themeDesaturated500: string;
  white10: string;
  white25: string;
  white80: string;
  white94: string;
  black50: string;
  black80: string;
  black100: string;
  error500: string;
}

const blackAndWhite = {
  white10: "#FFFFFF1A",
  white25: "#FFFFFF40",
  white80: "#FFFFFFCC",
  white94: "#FFFFFFF0",
  black50: "#00000080",
  black80: "#000000CC",
  black100: "#000000",
};

const light: ColorScheme = {
  theme50: "#F5F9FD",
  theme100: "#E0E9F4",
  theme200: "#B8CFE5",
  theme500: "#007EF2",
  theme600: "#0060B9",
  theme800: "#2E4357",
  theme900: "#1E2F3F",
  theme950: "#0D151D",
  themeDesaturated500: "#607385",
  error500: "#FF3C00",
  ...blackAndWhite,
};

const dark: ColorScheme = {
  theme50: "#001510",
  theme100: "#1E2F3F",
  theme200: "#254357",
  theme500: "#0060B9",
  theme600: "#007EF2",
  theme800: "#B3CFEA",
  theme900: "#DEEAF6",
  theme950: "#F5F9FD",
  themeDesaturated500: "#7A8D9F",
  error500: "#FF3C00",
  ...blackAndWhite,
};

export const colorSchemes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...light,
      background: light.theme50,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...dark,
      background: dark.theme50,
    },
  },
};

export const colors = { light, dark };
