import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { PlaylistsApiImpl } from "../playlistsApi";
import { combineCollectionQueryResults, retry } from "../helpers";
import { GetVideosVideo, OwnTubeError } from "../models";
import { VideoPlaylist } from "@peertube/peertube-types";

export const useGetPlaylistsQuery = ({
  enabled = true,
  hiddenPlaylists,
}: {
  enabled?: boolean;
  hiddenPlaylists?: string[];
}) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.playlists, backend],
    queryFn: async () => {
      const data = await PlaylistsApiImpl.getPlaylists(backend!);
      return { ...data, data: data.data.filter(({ isLocal, videosLength }) => isLocal && videosLength > 0) };
    },
    enabled: !!backend && enabled,
    select: (queryData) => {
      return { ...queryData, data: queryData.data.filter(({ id }) => !hiddenPlaylists?.includes(String(id))) };
    },
    retry,
  });
};

export const useGetPlaylistVideosQuery = (playlistId?: number, count: number = 4) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.playlistVideos, backend, playlistId],
    queryFn: async () => {
      return await PlaylistsApiImpl.getPlaylistVideos(backend!, playlistId!, { count });
    },
    enabled: !!backend && !!playlistId,
    retry,
  });
};

export const useInfiniteGetPlaylistVideosQuery = (playlistId?: number, pageSize: number = 24) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? pageSize : lastPageParam) + (lastPageParam ? pageSize : 0);

      return nextCount >= lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.playlistVideos, backend, playlistId, "infinite"],
    queryFn: async ({ pageParam }) => {
      return await PlaylistsApiImpl.getPlaylistVideos(backend!, playlistId!, {
        count: pageSize,
        start: pageParam,
      });
    },
    enabled: !!backend && !!playlistId,
    retry,
  });
};

export const useGetPlaylistInfoQuery = (playlistId?: number) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.playlistInfo, backend, playlistId],
    queryFn: async () => {
      return await PlaylistsApiImpl.getPlaylistInfo(backend!, playlistId!);
    },
    enabled: !!backend && !!playlistId,
    retry,
  });
};

export const useGetPlaylistsCollectionQuery = (playlists: Array<VideoPlaylist> = []) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQueries({
    queries: playlists.map(({ displayName, id, videoChannel }) => ({
      queryKey: [QUERY_KEYS.playlistsCollection, id, backend],
      queryFn: async () => {
        try {
          const res = await PlaylistsApiImpl.getPlaylistVideos(backend, id, { count: 4 });
          return { ...res, id, displayName, videoChannel };
        } catch (error) {
          if ((error as unknown as OwnTubeError).status === 429) {
            throw error;
          }
          return { error, isError: true, id, displayName, videoChannel, data: [], total: 0 };
        }
      },
      retry,
      enabled: !!backend,
    })),
    combine: combineCollectionQueryResults<{
      id: number;
      displayName: string;
      videoChannel: VideoPlaylist["videoChannel"];
    }>,
  });
};
