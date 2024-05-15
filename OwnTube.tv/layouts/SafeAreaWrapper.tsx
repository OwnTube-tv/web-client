import { PropsWithChildren, FC } from "react";
import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";

interface SafeAreaWrapperProps extends PropsWithChildren {
  style?: ViewStyle;
}

export const SafeAreaWrapper: FC<SafeAreaWrapperProps> = ({ children, style }) => (
  <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
