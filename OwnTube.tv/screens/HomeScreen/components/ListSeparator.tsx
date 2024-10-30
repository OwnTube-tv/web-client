import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../../theme";

export const ListSeparator = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: colors.theme100, ...styles.separatorBody }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  separatorBody: { height: 2, width: "100%" },
});
