import { StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import { useAppConfigContext } from "../../contexts";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

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

  return (
    <View style={{ backgroundColor: colors.theme50 }}>
      <View style={styles.modalHeader}>
        <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.theme950}>
          {t("settingsPageDeviceCapabilityInfoHeading")}
        </Typography>
      </View>
      <View style={styles.capabilitiesContainer}>
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
  modalHeader: { flexDirection: "row", gap: 16, justifyContent: "space-between" },
  row: { flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
});

export default DeviceCapabilities;
