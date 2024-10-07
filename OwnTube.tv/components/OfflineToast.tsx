import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { useTranslation } from "react-i18next";
import { Button } from "./shared";
import Toast from "react-native-toast-message";
import { borderRadius, spacing } from "../theme";
import { useTheme } from "@react-navigation/native";

export const OfflineToast = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.theme100,
        },
      ]}
    >
      <Typography>{t("noNetworkConnection")}</Typography>
      <Button contrast="high" icon="Close" onPress={() => Toast.hide()} />
    </View>
  );
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    alignItems: "center",
    borderColor: "red",
    borderRadius: borderRadius.radiusMd,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xl,
    padding: spacing.sm,
  },
});
