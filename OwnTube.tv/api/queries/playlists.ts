import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { PlaylistsApiImpl } from "../playlistsApi";
import { retry } from "../helpers";

export const useGetPlaylistsQuery = () => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.playlists, backend],
    queryFn: async () => {
      const data = await PlaylistsApiImpl.getPlaylists(backend!);
      return { ...data, data: data.data.filter(({ isLocal, videosLength }) => isLocal && videosLength > 0) };
    },
    enabled: !!backend,
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
