import { useGetChannelsCollectionQuery, useGetChannelsQuery } from "../../api";
import { Screen } from "../../layouts";
import { spacing } from "../../theme";
import { EmptyPage, Loader, VideoGrid } from "../../components";
import { useBreakpoints } from "../../hooks";
import { StyleSheet } from "react-native";
import { useMemo } from "react";
import { getAvailableVidsString } from "../../utils";
import { ROUTES } from "../../types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";

export const ChannelsScreen = () => {
  const { backend } = useLocalSearchParams();
  const { data: channels, isFetching: isFetchingChannels } = useGetChannelsQuery({ enabled: true });
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();
  const { data: channelSections, isFetching } = useGetChannelsCollectionQuery(channels?.map(({ name }) => name));

  const renderScreenContent = useMemo(() => {
    if (isFetching || isFetchingChannels) {
      return <Loader />;
    }

    if (!channelSections.length) {
      return <EmptyPage text={t("noChannelsAvailable")} />;
    }

    return channelSections?.map((channelVideoCollection) => {
      const channelInfoSection = channels?.find(({ name }) => name === channelVideoCollection?.id);

      return (
        <VideoGrid
          headerLink={{
            text: t("visitChannel") + getAvailableVidsString(channelVideoCollection?.total),
            href: { pathname: `/${ROUTES.CHANNEL}`, params: { backend, channel: channelInfoSection?.name } },
          }}
          variant="channel"
          key={channelVideoCollection?.id}
          title={channelInfoSection?.displayName}
          data={channelVideoCollection?.data}
          channelLogoUri={channelInfoSection?.avatars?.[0]?.path}
        />
      );
    });
  }, [isFetching, isFetchingChannels, channelSections, channels, backend]);

  return (
    <Screen
      style={{
        ...styles.screenContainer,
        paddingRight: isMobile ? 0 : spacing.xl,
      }}
    >
      {renderScreenContent}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    flex: 1,
    gap: spacing.xl,
    justifyContent: "center",
    padding: 0,
    paddingTop: spacing.xl,
  },
});
