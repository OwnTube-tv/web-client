import { PropsWithChildren, FC } from "react";
import { ScrollView, View, StyleSheet, ViewStyle } from "react-native";

interface ScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

export const Screen: FC<ScreenProps> = ({ children, style }) => {
  return (
    <ScrollView>
      <View style={[styles.container, style]}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
