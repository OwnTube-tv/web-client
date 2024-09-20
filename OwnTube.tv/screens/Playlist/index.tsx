import { useGetChannelInfoQuery, useGetPlaylistInfoQuery, useInfiniteGetPlaylistVideosQuery } from "../../api";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { BackToChannel, ListInfoHeader, Loader, VideoGrid } from "../../components";
import { useMemo } from "react";
import { Screen } from "../../layouts";

export const Playlist = () => {
  const { backend, playlist, channel } = useLocalSearchParams<
    RootStackParams[ROUTES.CHANNEL_PLAYLIST] & RootStackParams[ROUTES.PLAYLIST]
  >();
  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteGetPlaylistVideosQuery(
    Number(playlist),
  );
  const { data: channelInfo } = useGetChannelInfoQuery(channel);
  const { data: playlistInfo, isFetching: isFetchingPlaylistInfo } = useGetPlaylistInfoQuery(Number(playlist));
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  if (isFetchingPlaylistInfo || isLoading) {
    return <Loader />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      {channelInfo && <BackToChannel channelInfo={channelInfo} />}
      <ListInfoHeader
        variant="playlist"
        name={playlistInfo?.displayName}
        description={playlistInfo?.description}
        avatarUrl={`https://${backend}${playlistInfo?.thumbnailPath}`}
      />
      <VideoGrid
        presentation="list"
        isLoading={isLoading}
        data={videos}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
      />
    </Screen>
  );
};
