import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import * as Clipboard from "expo-clipboard";
import { useAppConfigContext } from "../../contexts";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { IcoMoonIcon } from "../IcoMoonIcon";
import { borderRadius } from "../../theme";
import { BuildInfo } from "../BuildInfo";
import build_info from "../../build-info.json";

const CapabilityKeyValuePair = ({ label, value }: { label: string; value: string }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Typography color={colors.themeDesaturated500} fontSize="sizeXS" fontWeight="Medium">
        {label}
      </Typography>
      <Typography color={colors.themeDesaturated500} fontSize="sizeXS" fontWeight="Medium">
        {value}
      </Typography>
    </View>
  );
};

const DeviceCapabilities = () => {
  const { deviceCapabilities } = useAppConfigContext();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleCopyToClipboard = async () => {
    const buildInfo = process.env.EXPO_PUBLIC_HIDE_GIT_DETAILS
      ? { BUILD_TIMESTAMP: build_info.BUILD_TIMESTAMP }
      : build_info;

    await Clipboard.setStringAsync(JSON.stringify({ buildInfo, ...deviceCapabilities }));
  };

  return (
    <View style={{ backgroundColor: colors.theme50 }}>
      <View style={styles.modalHeader}>
        <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.theme950}>
          {t("deviceCapabilityInfoTitle")}
        </Typography>
        <Pressable onPress={handleCopyToClipboard} style={[styles.iconButton, { backgroundColor: colors.theme500 }]}>
          <IcoMoonIcon color={colors.white94} name="Content-Copy" size={24} />
        </Pressable>
      </View>
      <View style={styles.capabilitiesContainer}>
        <View style={styles.row}>
          <Typography color={colors.themeDesaturated500} fontSize="sizeXS" fontWeight="Medium">
            {t("currentBuild")}
          </Typography>
          <BuildInfo />
        </View>
        <CapabilityKeyValuePair label={t("playerImpl")} value={deviceCapabilities.playerImplementation} />
        <CapabilityKeyValuePair label={t("deviceType")} value={deviceCapabilities.deviceType} />
        <CapabilityKeyValuePair label={t("operatingSystem")} value={deviceCapabilities.OS} />
        {deviceCapabilities.browser && (
          <CapabilityKeyValuePair label={t("browser")} value={deviceCapabilities.browser} />
        )}
        {deviceCapabilities.device && <CapabilityKeyValuePair label={t("device")} value={deviceCapabilities.device} />}
        <CapabilityKeyValuePair label={t("screenDimensions")} value={deviceCapabilities.dimensions} />
        <CapabilityKeyValuePair label={t("orientation")} value={deviceCapabilities.orientation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  capabilitiesContainer: {
    gap: 8,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  modalHeader: { flexDirection: "row", gap: 16, justifyContent: "space-between" },
  row: { flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
});

export default DeviceCapabilities;
