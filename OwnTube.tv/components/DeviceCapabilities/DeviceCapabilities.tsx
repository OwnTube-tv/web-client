import { StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import * as Clipboard from "expo-clipboard";
import { useAppConfigContext } from "../../contexts";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { spacing } from "../../theme";
import { BuildInfo } from "../BuildInfo";
import build_info from "../../build-info.json";
import { useAuthSessionStore } from "../../store";
import { format } from "date-fns";
import { useMemo, useRef, useState, useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { Button } from "../shared";

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
  const { backend } = useGlobalSearchParams<{ backend: string }>();
  const { currentInstanceServerConfig } = useAppConfigContext();

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

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string | undefined>(undefined);
  const pressCountRef = useRef<number>(0);
  const pressResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [shouldThrow, setShouldThrow] = useState<Error | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pressResetRef.current) clearTimeout(pressResetRef.current);
    };
  }, []);

  const handleCopyToClipboard = async () => {
    pressCountRef.current = (pressCountRef.current || 0) + 1;
    if (pressCountRef.current >= 5) {
      pressCountRef.current = 0;
      if (pressResetRef.current) {
        clearTimeout(pressResetRef.current);
        pressResetRef.current = null;
      }

      setShouldThrow(new Error(t("pressedTooManyTimesError")));
      return;
    }
    if (pressResetRef.current) clearTimeout(pressResetRef.current);
    pressResetRef.current = setTimeout(() => {
      pressCountRef.current = 0;
      pressResetRef.current = null;
    }, 2000);

    const buildInfo = process.env.EXPO_PUBLIC_HIDE_GIT_DETAILS
      ? { BUILD_TIMESTAMP: build_info.BUILD_TIMESTAMP }
      : build_info;

    await Clipboard.setStringAsync(
      JSON.stringify({
        buildInfo,
        ...deviceCapabilities,
        ...(authInfo ? { authInfo } : {}),
        backend: {
          hostname: backend,
          version: currentInstanceServerConfig?.serverVersion,
        },
      }),
    );
    setCopyButtonText(t("copied"));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopyButtonText(undefined);
    }, 3_000);
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

  if (shouldThrow) {
    // This throw happens during render and will be caught by your ErrorBoundary
    throw shouldThrow;
  }

  return (
    <View style={{ backgroundColor: colors.theme50 }}>
      <View style={styles.modalHeader}>
        <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.theme950}>
          {t("settingsPageDeviceCapabilityInfoHeading")}
        </Typography>
        <Button
          onPress={handleCopyToClipboard}
          text={copyButtonText}
          icon={"Content-Copy"}
          iconPosition="trailing"
          contrast="high"
          style={styles.iconButton}
        />
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
  iconButton: { height: 36, paddingHorizontal: spacing.sm },
  modalHeader: { flexDirection: "row", gap: 16, justifyContent: "space-between" },
  row: { flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
});

export default DeviceCapabilities;
