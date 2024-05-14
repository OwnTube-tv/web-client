import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Error: {message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    // color: theme.colors.red,
    fontSize: 16,
  },
});
