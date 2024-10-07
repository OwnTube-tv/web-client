import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { Button } from "./shared";
import Toast from "react-native-toast-message";
import { borderRadius, spacing } from "../theme";
import { useTheme } from "@react-navigation/native";

export const OnlineToast = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.theme100 }]}>
      <Typography>{t("networkConnectionRestored")}</Typography>
      <Button contrast="high" icon="Close" onPress={() => Toast.hide()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    flexDirection: "row",
    gap: spacing.xl,
    padding: spacing.sm,
  },
});
