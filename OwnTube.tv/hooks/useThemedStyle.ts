import { ViewStyle, ImageStyle, TextStyle } from "react-native/types";
import { useTheme } from "../contexts";
import { Theme } from "../types";

type TStylesheetFn = (theme: Theme) => Record<string, ViewStyle | ImageStyle | TextStyle>;

export function useThemedStyles(styles: TStylesheetFn) {
  const { typography, colors } = useTheme();
  return styles({ typography, colors });
}
