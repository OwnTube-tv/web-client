import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import * as Clipboard from "expo-clipboard";
import { Spacer } from "./shared/Spacer";
import { useAppConfigContext } from "../contexts";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { IcoMoonIcon } from "./IcoMoonIcon";

export const DeviceCapabilities = () => {
  const { deviceCapabilities } = useAppConfigContext();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(JSON.stringify(deviceCapabilities));
  };

  return (
    <View style={[{ backgroundColor: colors.card }, styles.modalContainer]}>
      <View style={styles.modalHeader}>
        <Typography>{t("deviceCapabilityInfoTitle")}</Typography>
        <Pressable onPress={handleCopyToClipboard}>
          <IcoMoonIcon color={colors.primary} name="Content-Copy" size={24} />
        </Pressable>
      </View>
      <Spacer height={16} />
      <View style={styles.row}>
        <Typography>{t("playerImpl")}</Typography>
        <Typography>{deviceCapabilities.playerImplementation}</Typography>
      </View>
      <View style={styles.row}>
        <Typography>{t("deviceType")}</Typography>
        <Typography>{deviceCapabilities.deviceType}</Typography>
      </View>
      <View style={styles.row}>
        <Typography>{t("operatingSystem")}</Typography>
        <Typography>{deviceCapabilities.OS}</Typography>
      </View>
      {deviceCapabilities.browser && (
        <View style={styles.row}>
          <Typography>{t("browser")}</Typography>
          <Typography>{deviceCapabilities.browser}</Typography>
        </View>
      )}
      {deviceCapabilities.device && (
        <View style={styles.row}>
          <Typography>{t("device")}</Typography>
          <Typography>{deviceCapabilities.device}</Typography>
        </View>
      )}
      <View style={styles.row}>
        <Typography>{t("screenDimensions")}</Typography>
        <Typography>{deviceCapabilities.dimensions}</Typography>
      </View>
      <View style={styles.row}>
        <Typography>{t("orientation")}</Typography>
        <Typography>{deviceCapabilities.orientation}</Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: { borderRadius: 8, minWidth: "50%", padding: 16 },
  modalHeader: { flexDirection: "row", gap: 16, justifyContent: "space-between" },
  row: { flexWrap: "wrap", justifyContent: "space-between", marginVertical: 8, width: "100%" },
});
