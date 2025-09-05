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
import { useAuthSessionStore } from "../../store";
import { format } from "date-fns";
import { useMemo } from "react";

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
  const { session } = useAuthSessionStore();

  const { colors } = useTheme();
  const { t } = useTranslation();
  const authInfo = useMemo(
    () =>
      session
        ? {
            backend: session.backend,
            email: session.email,
            twoFactorEnabled: session.twoFactorEnabled,
            sessionCreatedAt: session.sessionCreatedAt,
            sessionUpdatedAt: session.sessionUpdatedAt,
            sessionExpired: session.sessionExpired,
            accessTokenIssuedAt: session.accessTokenIssuedAt,
            refreshTokenIssuedAt: session.refreshTokenIssuedAt,
            userInfoUpdatedAt: session.userInfoUpdatedAt,
          }
        : null,
    [session],
  );

  const handleCopyToClipboard = async () => {
    const buildInfo = process.env.EXPO_PUBLIC_HIDE_GIT_DETAILS
      ? { BUILD_TIMESTAMP: build_info.BUILD_TIMESTAMP }
      : build_info;

    await Clipboard.setStringAsync(
      JSON.stringify({ buildInfo, ...deviceCapabilities, ...(authInfo ? { authInfo } : {}) }),
    );
  };

  const currentAuthText = useMemo(() => {
    if (!authInfo) return "";

    return t("currentAuthText", {
      userName: authInfo.email,
      backend: authInfo.backend,
      _2fa: authInfo.twoFactorEnabled ? t("_2faOn") : t("_2faOff"),
      sessionStartedAt: format(authInfo.sessionCreatedAt, "yyyy-MM-dd HH:mm"),
      sessionUpdatedAt: format(authInfo.sessionUpdatedAt, "yyyy-MM-dd HH:mm"),
      expiredText: authInfo.sessionExpired ? t("sessionExpired") : t("sessionActive"),
      refreshTokenIssuedAt: format(authInfo.refreshTokenIssuedAt, "yyyy-MM-dd HH:mm"),
    });
  }, [authInfo, t]);

  return (
    <View style={{ backgroundColor: colors.theme50 }}>
      <View style={styles.modalHeader}>
        <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.theme950}>
          {t("settingsPageDeviceCapabilityInfoHeading")}
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
        {authInfo && <CapabilityKeyValuePair label={t("currentAuth")} value={currentAuthText} />}
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
