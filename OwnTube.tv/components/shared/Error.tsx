import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../Typography";
import { useTheme } from "@react-navigation/native";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  const { notification } = useTheme().colors;

  return (
    <View style={styles.container}>
      <Typography style={styles.text} color={notification}>
        Error: {message}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
});
