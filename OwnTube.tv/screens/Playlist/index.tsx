import { useGetChannelInfoQuery, useGetPlaylistInfoQuery, useInfiniteGetPlaylistVideosQuery } from "../../api";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { BackToChannel, InfoFooter, ListInfoHeader, Loader, VideoGrid } from "../../components";
import { useMemo } from "react";
import { Screen } from "../../layouts";
import { useInstanceConfig, usePageContentTopPadding } from "../../hooks";
import { useTranslation } from "react-i18next";

export const Playlist = () => {
  const { currentInstanceConfig } = useInstanceConfig();
  const { backend, playlist, channel } = useLocalSearchParams<
    RootStackParams[ROUTES.CHANNEL_PLAYLIST] & RootStackParams[ROUTES.PLAYLIST]
  >();
  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteGetPlaylistVideosQuery(
    Number(playlist),
    currentInstanceConfig?.customizations?.showMoreSize,
  );
  const { data: channelInfo } = useGetChannelInfoQuery(channel);
  const { data: playlistInfo, isFetching: isFetchingPlaylistInfo } = useGetPlaylistInfoQuery(Number(playlist));
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);
  const { t } = useTranslation();
  const { top } = usePageContentTopPadding();

  if (isFetchingPlaylistInfo || isLoading) {
    return <Loader />;
  }

  return (
    <Screen style={{ padding: 0, paddingTop: top }}>
      {channelInfo && <BackToChannel channelInfo={channelInfo} />}
      <ListInfoHeader
        variant="playlist"
        name={playlistInfo?.displayName}
        description={playlistInfo?.description}
        avatarUrl={`https://${backend}${playlistInfo?.thumbnailPath}`}
        linkHref={`https://${backend}/w/p/${playlistInfo?.uuid}`}
      />
      <VideoGrid
        presentation="list"
        isLoading={isLoading}
        data={videos}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
        link={{ text: t("showMore") }}
        isTVActionCardHidden={!hasNextPage}
      />
      <InfoFooter />
    </Screen>
  );
};
