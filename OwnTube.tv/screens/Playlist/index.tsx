import { useGetPlaylistInfoQuery, useInfiniteGetPlaylistVideosQuery } from "../../api";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Loader, VideoGrid } from "../../components";
import { useMemo } from "react";
import { Screen } from "../../layouts";

export const Playlist = () => {
  const { playlist } = useLocalSearchParams<RootStackParams[ROUTES.PLAYLIST]>();
  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteGetPlaylistVideosQuery(
    Number(playlist),
  );
  const { data: playlistInfo, isFetching: isFetchingPlaylistInfo } = useGetPlaylistInfoQuery(Number(playlist));
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  if (isFetchingPlaylistInfo || isLoading) {
    return <Loader />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      <VideoGrid
        presentation="list"
        isLoading={isLoading}
        data={videos}
        title={playlistInfo?.displayName}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
      />
    </Screen>
  );
};
