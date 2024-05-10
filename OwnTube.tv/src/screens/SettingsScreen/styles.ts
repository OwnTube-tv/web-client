import { StyleSheet } from "react-native";
import { Theme } from "../../styles/styleTypes";

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.BACKGROUND,
      gap: 10,
      padding: 20,
    },
    option: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    text: {
      color: theme.colors.TEXT,
      fontSize: theme.typography.size.M,
    },
  });
