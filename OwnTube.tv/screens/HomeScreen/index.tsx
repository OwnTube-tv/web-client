import { CategoryView, InfoFooter, VideoGrid } from "../../components";
import { useIsFocused, useTheme } from "@react-navigation/native";
import {
  QUERY_KEYS,
  useGetCategoriesQuery,
  useGetChannelsQuery,
  useGetPlaylistsQuery,
  useGetVideoFullInfoCollectionQuery,
  useGetVideosQuery,
} from "../../api";
import { useMemo, useState } from "react";
import { useBreakpoints, useCustomFocusManager, usePageContentTopPadding, useViewHistory } from "../../hooks";
import { spacing } from "../../theme";
import { ROUTES } from "../../types";
import { Platform, RefreshControl, SectionList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LatestVideosView, SectionHeader } from "./components";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ChannelView } from "../../components";
import { PlaylistVideosView } from "../Playlists/components";
import { VideoChannel, VideoPlaylist } from "@peertube/peertube-types";
import { useAppConfigContext } from "../../contexts";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomDiagnosticsEvents } from "../../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents } from "../../diagnostics/constants";

const LIVE_STREAM_LIST_REFETCH_INTERVAL = 10_000;

export const HomeScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { viewHistory } = useViewHistory({ backendToFilter: backend });
  const { currentInstanceConfig } = useAppConfigContext();
  const { top } = usePageContentTopPadding();
  const isFocused = useIsFocused();
  useCustomFocusManager();
  const queryClient = useQueryClient();
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();
  const { isMobile } = useBreakpoints();

  const { data: channels, refetch: refetchChannels } = useGetChannelsQuery({
    enabled: !currentInstanceConfig?.customizations?.homeHideChannelsOverview,
  });
  const { data: categories, refetch: refetchCategories } = useGetCategoriesQuery({
    enabled: !currentInstanceConfig?.customizations?.homeHideCategoriesOverview,
  });
  const { data: playlistsData, refetch: refetchPlaylists } = useGetPlaylistsQuery({
    enabled: !currentInstanceConfig?.customizations?.homeHidePlaylistsOverview,
    hiddenPlaylists: currentInstanceConfig?.customizations?.playlistsHidden,
  });
  const { data: currentLiveVideos } = useGetVideosQuery({
    uniqueQueryKey: QUERY_KEYS.liveVideos,
    params: { isLive: true, count: 4 },
    refetchInterval: isFocused ? LIVE_STREAM_LIST_REFETCH_INTERVAL : 0,
  });

  const liveVideoIds = useMemo(() => {
    return Array.from(
      new Set(
        currentLiveVideos?.data
          .map(({ uuid }) => uuid)
          .concat(currentInstanceConfig?.customizations?.homeFeaturedLives || []),
      ),
    );
  }, [currentLiveVideos, currentInstanceConfig]);

  const liveVideosData = useGetVideoFullInfoCollectionQuery(
    liveVideoIds,
    QUERY_KEYS.liveStreamsCollection,
    currentInstanceConfig?.customizations?.homeDisplayScheduledLivesThreshold,
  );

  const historyData = useMemo(() => {
    return (
      viewHistory
        ?.slice(0, currentInstanceConfig?.customizations?.homeRecentlyWatchedVideoCount ?? 4)
        .filter(({ isLive }) => !isLive) || []
    );
  }, [viewHistory, currentInstanceConfig]);

  const showHorizontalScrollableLists = currentInstanceConfig?.customizations?.homeUseHorizontalListsForMobilePortrait;

  const sections = useMemo(() => {
    return [
      {
        title: t("liveStreams"),
        renderItem: () => (
          <VideoGrid
            scrollable={showHorizontalScrollableLists}
            isTVActionCardHidden={true}
            isHeaderHidden
            data={liveVideosData}
          />
        ),
        data: ["dataItemPlaceholder"],
        isVisible: Number(liveVideosData?.length) > 0,
      },
      {
        title: t("latestVideos"),
        renderItem: () => <LatestVideosView />,
        data: ["dataItemPlaceholder"],
        isVisible: true,
      },
      {
        title: isMobile ? t("recentlyWatchedAbbr") : t("recentlyWatched"),
        link: { text: t("viewHistory"), route: `/${ROUTES.HISTORY}` },
        renderItem: () => (
          <VideoGrid
            scrollable={showHorizontalScrollableLists}
            link={
              Platform.isTV
                ? { text: t("viewHistory"), href: { pathname: `/${ROUTES.HISTORY}`, params: { backend } } }
                : undefined
            }
            isHeaderHidden
            data={historyData}
            variant="history"
          />
        ),
        data: ["dataItemPlaceholder"],
        isVisible: historyData.length > 0,
      },
      {
        title: t("playlistsPageTitle"),
        link: { text: t("allPlaylists"), route: `/${ROUTES.PLAYLISTS}` },
        renderItem: ({ item }: { item: VideoPlaylist }) => (
          <PlaylistVideosView location="home" key={item.id} title={item.displayName} id={item.id} />
        ),
        data: playlistsData?.data || [],
        isVisible: !currentInstanceConfig?.customizations?.homeHidePlaylistsOverview && !!playlistsData?.data?.length,
      },
      {
        title: t("channels"),
        link: { text: t("allChannels"), route: `/${ROUTES.CHANNELS}` },
        renderItem: ({ item }: { item: VideoChannel }) => <ChannelView key={item.id} channel={item} />,
        data: channels || [],
        isVisible: !currentInstanceConfig?.customizations?.homeHideChannelsOverview && !!channels?.length,
      },
      {
        title: t("categories"),
        link: { text: t("allCategories"), route: `/${ROUTES.CATEGORIES}` },
        renderItem: ({ item }: { item: { name: string; id: number } }) => (
          <CategoryView category={item} key={item.id} />
        ),
        data: categories || [],
        isVisible: !currentInstanceConfig?.customizations?.homeHideCategoriesOverview && !!categories?.length,
      },
    ].filter(({ isVisible }) => isVisible);
  }, [
    t,
    historyData,
    backend,
    playlistsData,
    channels,
    categories,
    currentInstanceConfig,
    liveVideosData,
    showHorizontalScrollableLists,
    isMobile,
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await refetchCategories();
    await refetchChannels();
    await refetchPlaylists();
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.videos], type: "active" });
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.playlistVideos], type: "active" });
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.channelVideos], type: "active" });

    setRefreshing(false);
    captureDiagnosticsEvent(CustomPostHogEvents.PullToRefresh);
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        paddingTop: top,
      }}
    >
      <View style={{ ...styles.paddingContainer }}>
        <SectionList
          refreshControl={
            <RefreshControl
              colors={[colors.theme500]}
              progressBackgroundColor={colors.theme900}
              tintColor={colors.theme900}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          // @ts-expect-error the sections do not change in runtime so we can be sure the typings match
          sections={sections}
          disableVirtualization
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<InfoFooter />}
          style={{
            ...styles.paddingContainer,
            flex: Platform.isTV ? 0 : 1,
          }}
          renderSectionHeader={({ section: { title, link } }) => <SectionHeader title={title} link={link} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: spacing.xl,
    padding: 0,
  },
  paddingContainer: {
    flex: 1,
    width: "100%",
  },
});
