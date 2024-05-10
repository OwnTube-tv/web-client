// themeTypes.ts
export type Typography = {
  size: {
    L: number; // Large font size
    M: number; // Medium font size
  };
  letterSpacing: {
    M: number; // Medium letter spacing
    S: number; // Small letter spacing
  };
};

export type Colors = {
  BACKGROUND: string; // Background color
  PRIMARY: string; // Primary color
  TEXT: string; // Text color
};

export type Theme = {
  colors: Colors;
  typography: Typography;
};
