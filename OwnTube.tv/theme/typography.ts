const size = {
  S: 16,
  M: 20,
  L: 30,
};

const letterSpacing = {
  S: 2,
  M: 5,
  L: 10,
};

export const fontSizes = {
  sizeXXL: 32,
  sizeXL: 24,
  sizeLg: 18,
  sizeMd: 16,
  sizeSm: 14,
  sizeXS: 13,
} as const;

export const lineHeights = {
  sizeXXL: 39,
  sizeXL: 29,
  sizeLg: 22,
  sizeMd: 19,
  sizeSm: 17,
  sizeXS: 16,
} as const;

export const fontWeights = {
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
} as const;

export const fontFamilies = {
  Regular: "Inter_400Regular",
  Medium: "Inter_500Medium",
  SemiBold: "Inter_600SemiBold",
  Bold: "Inter_700Bold",
  ExtraBold: "Inter_800ExtraBold",
} as const;

export const typography = { size, letterSpacing };
