import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Theme } from "../../styles/styleTypes";

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      padding: 10,
      backgroundColor: theme.colors.BACKGROUND,
    },
    title: {
      color: theme.colors.PRIMARY,
      fontSize: theme.typography.size.L,
      letterSpacing: theme.typography.letterSpacing.M,
      fontWeight: "bold",
    },
    text: {
      color: theme.colors.TEXT,
      fontSize: theme.typography.size.M,
      letterSpacing: theme.typography.letterSpacing.S,
      textAlign: "justify",
    },
  });
