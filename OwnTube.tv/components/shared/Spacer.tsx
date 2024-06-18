import { View, ViewStyle } from "react-native";

export const Spacer = ({ width = "100%", height = 0 }: Pick<ViewStyle, "width" | "height">) => {
  return <View style={{ width, height }} />;
};
