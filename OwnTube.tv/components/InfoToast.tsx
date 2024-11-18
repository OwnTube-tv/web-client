import Toast, { ToastConfigParams } from "react-native-toast-message";
import { Typography } from "./Typography";
import { Button } from "./shared";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../theme";

type InfoToastProps = ToastConfigParams<{ isError?: boolean }>;

export const InfoToast = ({ props: { isError }, ...toastProps }: InfoToastProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-color-literals
        {
          backgroundColor: colors.theme100,
          borderColor: isError ? "red" : undefined,
          borderWidth: isError ? 1 : undefined,
        },
      ]}
    >
      <Typography numberOfLines={2} style={styles.text}>
        {toastProps.text1}
      </Typography>
      <Button hasTVPreferredFocus contrast="high" icon="Close" onPress={() => Toast.hide()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    flexDirection: "row",
    gap: spacing.xl,
    justifyContent: "space-between",
    maxWidth: "90%",
    padding: spacing.sm,
  },
  text: { maxWidth: "70%" },
});
