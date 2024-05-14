import { StyleSheet } from "react-native";
import { Theme } from "../../types";

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "flex-start",
      backgroundColor: theme.colors.BACKGROUND,
      gap: 10,
      padding: 20,
    },
    option: {
      flexDirection: "row",
      gap: 5,
    },
    text: {
      color: theme.colors.TEXT,
      fontSize: theme.typography.size.M,
    },
  });
