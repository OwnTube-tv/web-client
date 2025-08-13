import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Logo } from "../../components/Svg";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { InfoFooter, PlatformCard, Typography } from "../../components";
import { useBreakpoints, useRecentInstances } from "../../hooks";
import { Spacer } from "../../components/shared/Spacer";
import { spacing } from "../../theme";
import { Screen } from "../../layouts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppConfigContext } from "../../contexts";
import {
  useGetInstanceServerConfigQuery,
  useGetInstanceInfoCollectionQuery,
  useGetInstancesQuery,
  WRONG_SERVER_VERSION_STATUS_CODE,
} from "../../api";
import { useFocusEffect, useRouter } from "expo-router";
import ComboBoxInput from "../../components/ComboBoxInput";
import Toast from "react-native-toast-message";
import { OwnTubeError } from "../../api/models";
import { ROUTES } from "../../types";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCustomDiagnosticsEvents } from "../../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents } from "../../diagnostics/constants";

export const LandingScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isDesktop } = useBreakpoints();
  const { featuredInstances } = useAppConfigContext();
  const insets = useSafeAreaInsets();
  const { data } = useGetInstancesQuery();
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();
  const router = useRouter();
  const availableInstances = useMemo(() => {
    return data
      ?.filter(({ totalLocalVideos }) => totalLocalVideos > 0)
      .map(({ name, host, totalLocalVideos }) => ({
        label: `${host} - ${name} (${totalLocalVideos})`,
        value: host,
      }));
  }, [data]);

  const [hostnameToOpen, setHostnameToOpen] = useState<string | undefined>();
  const { isSuccess: isInstanceConfigValid, error: instanceConfigError } = useGetInstanceServerConfigQuery({
    hostname: hostnameToOpen,
    shouldValidate: true,
  });
  const handleSelectSource = (hostname: string) => {
    setHostnameToOpen(hostname);
  };

  useEffect(() => {
    if (isInstanceConfigValid) {
      Toast.hide();
      router.push({ pathname: `/${ROUTES.HOME}`, params: { backend: hostnameToOpen } });
    }

    if (instanceConfigError) {
      Toast.show({
        type: "info",
        props: { isError: true },
        text1:
          (instanceConfigError as unknown as OwnTubeError)?.status === WRONG_SERVER_VERSION_STATUS_CODE
            ? instanceConfigError.message
            : t("siteDidNotRespondError", {
                errorCode:
                  (instanceConfigError as unknown as OwnTubeError)?.status || instanceConfigError.message || "",
              }),
        autoHide: false,
      });
    }
    setHostnameToOpen(undefined);
  }, [isInstanceConfigValid, instanceConfigError, t]);

  const { recentInstances } = useRecentInstances();
  const { data: recentInstancesData, refetch: refetchInstancesData } = useGetInstanceInfoCollectionQuery(
    recentInstances?.slice(0, 12) || [],
  );

  useFocusEffect(
    useCallback(() => {
      refetchInstancesData();
    }, [recentInstances]),
  );

  const { width } = useWindowDimensions();

  const searchInputWidth = useMemo(() => {
    const calculatedWidth = width * 0.375;

    return calculatedWidth < 344 ? 344 : calculatedWidth > 600 ? 600 : calculatedWidth;
  }, [width]);

  const onChangeComboBoxInput = (text: string) => {
    captureDiagnosticsEvent(CustomPostHogEvents.InstanceSearchTextChanged, {
      searchText: text,
    });
  };

  return (
    <Screen
      style={{
        ...styles.screenContainer,
        paddingTop: insets.top || spacing.xxxl,
      }}
    >
      <View style={[styles.container, { maxWidth: isDesktop ? "38%" : "95%" }]}>
        <Logo textColor={colors.theme950} width={isDesktop ? "125.5" : "90"} height={isDesktop ? "56" : "40"} />
        <Spacer height={spacing.xl} />
        <Typography
          style={styles.centeredText}
          fontWeight="Bold"
          fontSize={isDesktop ? "sizeXXL" : "sizeXL"}
          color={colors.theme900}
        >
          {t("welcomeText", { appName: Constants.expoConfig?.name })}
        </Typography>
        <Spacer height={12} />
        <Typography
          style={styles.centeredText}
          fontWeight="Regular"
          fontSize={isDesktop ? "sizeLg" : "sizeMd"}
          color={colors.theme800}
        >
          {t("welcomeDescriptionText")}
        </Typography>
      </View>
      <Spacer height={isDesktop ? spacing.xxxl : spacing.xxl} />
      <Typography fontWeight="Bold" fontSize={isDesktop ? "sizeXL" : "sizeLg"}>
        {t("findAVideoSite")}
      </Typography>
      <Spacer height={isDesktop ? spacing.xxl : spacing.xl} />
      <ComboBoxInput
        onChangeText={onChangeComboBoxInput}
        width={searchInputWidth}
        testID={"custom-instance-select"}
        data={availableInstances}
        onChange={handleSelectSource}
        placeholder={t("tubeInstanceName")}
        allowCustomOptions
        getCustomOptionText={(hostname) => {
          return t("openCustomSite", { hostname });
        }}
      />
      <Spacer height={isDesktop ? spacing.xxxl : spacing.xxl} />
      <Typography fontWeight="Bold" fontSize={isDesktop ? "sizeXL" : "sizeLg"}>
        {t("exploreVideoSites")}
      </Typography>
      <Spacer height={isDesktop ? spacing.xxl : spacing.xl} />
      <View style={styles.platformsContainer}>
        {featuredInstances?.map((platform, index) => (
          <View
            key={index}
            style={{ width: isDesktop ? 392 : 344, alignSelf: "flex-start", height: isDesktop ? 164 : 132 }}
          >
            <PlatformCard {...platform} />
          </View>
        ))}
      </View>
      {Number(recentInstances?.length) > 0 && (
        <View style={{ alignItems: "center", width: "100%" }}>
          <Spacer height={isDesktop ? spacing.xxxl : spacing.xxl} />
          <Typography fontWeight="Bold" fontSize={isDesktop ? "sizeXL" : "sizeLg"}>
            {t("recentlyVisited")}
          </Typography>
          <Spacer height={isDesktop ? spacing.xxl : spacing.xl} />
          <View style={styles.platformsContainer}>
            {recentInstancesData?.map((platform, index) => {
              const featuredPlatformData = featuredInstances?.find(({ hostname }) => hostname === platform?.hostname);

              return (
                <View
                  key={index}
                  style={{ width: isDesktop ? 392 : 344, alignSelf: "flex-start", height: isDesktop ? 164 : 132 }}
                >
                  <PlatformCard
                    name={featuredPlatformData?.name || platform?.name}
                    description={
                      featuredPlatformData?.description || platform?.description || platform?.shortDescription
                    }
                    logoUrl={
                      featuredPlatformData?.logoUrl || `https://${platform?.hostname}${platform?.avatars?.[0]?.path}`
                    }
                    hostname={platform?.hostname}
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}
      <InfoFooter showBuildInfo />
    </Screen>
  );
};

const styles = StyleSheet.create({
  centeredText: { textAlign: "center" },
  container: { alignItems: "center" },
  platformsContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    width: "76%",
  },
  screenContainer: { alignItems: "center", justifyContent: "center", padding: 0 },
});
