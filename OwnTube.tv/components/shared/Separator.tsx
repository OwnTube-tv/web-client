import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";

export const Separator = () => {
  const { colors } = useTheme();

  return <View style={[styles.base, { backgroundColor: colors.theme100 }]} />;
};

const styles = StyleSheet.create({
  base: { height: 2, width: "100%" },
});
