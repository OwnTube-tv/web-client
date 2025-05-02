import { CategoryView, InfoFooter, VideoGrid } from "../../components";
import { useTheme } from "@react-navigation/native";
import {
  QUERY_KEYS,
  useGetCategoriesQuery,
  useGetChannelsQuery,
  useGetLiveStreamsCollectionQuery,
  useGetPlaylistsQuery,
  useGetVideosQuery,
} from "../../api";
import { useMemo } from "react";
import { useBreakpoints, useInstanceConfig, useViewHistory } from "../../hooks";
import { spacing } from "../../theme";
import { ROUTES } from "../../types";
import { Platform, SectionList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LatestVideosView, SectionHeader } from "./components";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ChannelView } from "../../components";
import { PlaylistVideosView } from "../Playlists/components";
import { Spacer } from "../../components/shared/Spacer";
import { VideoChannel, VideoPlaylist } from "@peertube/peertube-types";

export const HomeScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { viewHistory } = useViewHistory({ backendToFilter: backend });
  const { isMobile } = useBreakpoints();
  const { currentInstanceConfig } = useInstanceConfig();

  const { data: channels } = useGetChannelsQuery({
    enabled: !currentInstanceConfig?.customizations?.homeHideChannelsOverview,
  });
  const { data: categories } = useGetCategoriesQuery({
    enabled: !currentInstanceConfig?.customizations?.homeHideCategoriesOverview,
  });
  const { data: playlistsData } = useGetPlaylistsQuery({
    enabled: !currentInstanceConfig?.customizations?.homeHidePlaylistsOverview,
    hiddenPlaylists: currentInstanceConfig?.customizations?.playlistsHidden,
  });
  const { data: currentLiveVideos } = useGetVideosQuery({
    uniqueQueryKey: QUERY_KEYS.liveVideos,
    params: { isLive: true, count: 4 },
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

  const liveVideosData = useGetLiveStreamsCollectionQuery(liveVideoIds);

  const historyData = useMemo(() => {
    return viewHistory?.slice(0, currentInstanceConfig?.customizations?.homeRecentlyWatchedVideoCount ?? 4) || [];
  }, [viewHistory, currentInstanceConfig]);

  const sections = useMemo(() => {
    return [
      {
        title: t("liveStreams"),
        renderItem: () => <VideoGrid isTVActionCardHidden={true} isHeaderHidden data={liveVideosData} />,
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
        title: t("recentlyWatched"),
        link: { text: t("viewHistory"), route: `/${ROUTES.HISTORY}` },
        renderItem: () => (
          <VideoGrid
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
  }, [t, historyData, backend, playlistsData, channels, categories, currentInstanceConfig, liveVideosData]);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ paddingLeft: isMobile ? 0 : 24, marginRight: isMobile ? 0 : 50, ...styles.paddingContainer }}>
        <SectionList
          // @ts-expect-error the sections do not change in runtime so we can be sure the typings match
          sections={sections}
          disableVirtualization
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<InfoFooter />}
          ListHeaderComponent={!isMobile ? <Spacer height={spacing.xl} /> : <></>}
          style={{
            paddingRight: isMobile ? 0 : spacing.xl,
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
    justifyContent: "center",
    padding: 0,
  },
  paddingContainer: {
    flex: 1,
    width: "100%",
  },
});
