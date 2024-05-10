import { StyleSheet } from "react-native";
import { Theme } from "../../styles/styleTypes";

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: 10,
      padding: 20,
      backgroundColor: theme.colors.BACKGROUND,
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
