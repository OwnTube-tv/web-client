import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { PlaylistsApiImpl } from "../playlistsApi";
import { retry } from "../helpers";
import { GetVideosVideo } from "../models";

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
    refetchOnWindowFocus: false,
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
    refetchOnWindowFocus: false,
    retry,
  });
};

export const useInfiniteGetPlaylistVideosQuery = (playlistId?: number, pageSize: number = 4) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? pageSize * 4 : lastPageParam) + (lastPageParam ? pageSize : 0);

      return nextCount >= lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.playlistVideos, backend, playlistId, "infinite"],
    queryFn: async ({ pageParam }) => {
      return await PlaylistsApiImpl.getPlaylistVideos(backend!, playlistId!, {
        count: pageParam === 0 ? pageSize * 4 : pageSize,
        start: pageParam,
      });
    },
    refetchOnWindowFocus: false,
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
    refetchOnWindowFocus: false,
    retry,
  });
};
