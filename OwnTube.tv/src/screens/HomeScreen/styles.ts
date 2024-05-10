import { StyleSheet } from "react-native";
import { Theme } from "../../styles/styleTypes";

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.colors.BACKGROUND,
      flex: 1,
      justifyContent: "center",
      padding: 10,
    },
    text: {
      color: theme.colors.TEXT,
      fontSize: theme.typography.size.M,
      letterSpacing: theme.typography.letterSpacing.S,
      textAlign: "justify",
    },
    title: {
      color: theme.colors.PRIMARY,
      fontSize: theme.typography.size.L,
      fontWeight: "bold",
      letterSpacing: theme.typography.letterSpacing.M,
    },
  });
