import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Logo } from "../../components/Svg";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { InfoFooter, PlatformCard, Typography } from "../../components";
import { useBreakpoints, useRecentInstances } from "../../hooks";
import { Spacer } from "../../components/shared/Spacer";
import { spacing } from "../../theme";
import { Screen } from "../../layouts";
import { useMemo } from "react";
import { useAppConfigContext } from "../../contexts";
import { useGetInstanceInfoCollectionQuery, useGetInstancesQuery } from "../../api";
import { useRouter } from "expo-router";
import ComboBoxInput from "../../components/ComboBoxInput";

export const LandingScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isDesktop } = useBreakpoints();
  const { featuredInstances } = useAppConfigContext();
  const { data } = useGetInstancesQuery();
  const router = useRouter();
  const availableInstances = useMemo(() => {
    return data
      ?.filter(({ totalLocalVideos }) => totalLocalVideos > 0)
      .map(({ name, host, totalLocalVideos }) => ({
        label: `${host} - ${name} (${totalLocalVideos})`,
        value: host,
      }));
  }, [data]);
  const handleSelectSource = (hostname: string) => {
    router.navigate({ pathname: "./", params: { backend: hostname } });
  };
  const { recentInstances } = useRecentInstances();
  const { data: recentInstancesData } = useGetInstanceInfoCollectionQuery(recentInstances?.slice(0, 12) || []);
  const { width } = useWindowDimensions();

  const searchInputWidth = useMemo(() => {
    const calculatedWidth = width * 0.375;

    return calculatedWidth < 344 ? 344 : calculatedWidth > 600 ? 600 : calculatedWidth;
  }, [width]);

  return (
    <Screen
      style={{
        ...styles.screenContainer,
        paddingTop: isDesktop ? spacing.xxxl : spacing.xxl,
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
          {t("welcomeText")}
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
        width={searchInputWidth}
        testID={"custom-instance-select"}
        data={availableInstances}
        onChange={handleSelectSource}
        placeholder={t("tubeInstanceName")}
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
            {recentInstancesData.map((platform, index) => {
              const featuredPlatformData = featuredInstances?.find(({ hostname }) => hostname === platform?.hostname);

              return (
                <View
                  key={index}
                  style={{ width: isDesktop ? 392 : 344, alignSelf: "flex-start", height: isDesktop ? 164 : 132 }}
                >
                  <PlatformCard
                    name={featuredPlatformData?.name || platform?.name}
                    description={featuredPlatformData?.description || platform?.description}
                    logoUrl={featuredPlatformData?.logoUrl || platform?.avatars[0]?.url}
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
