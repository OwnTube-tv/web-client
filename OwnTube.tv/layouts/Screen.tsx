import { PropsWithChildren, FC } from "react";
import { ScrollView, View, StyleSheet, ViewStyle } from "react-native";

interface ScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

export const Screen: FC<ScreenProps> = ({ children, style }) => (
  <ScrollView>
    <View style={[styles.container, style]}>{children}</View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
});
