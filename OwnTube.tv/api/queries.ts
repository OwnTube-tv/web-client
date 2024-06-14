import { useQuery } from "@tanstack/react-query";
import { ApiServiceImpl, GetVideosVideo } from "./peertubeVideosApi";
import { SOURCES } from "../types";
import { getLocalData } from "./helpers";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";

export enum QUERY_KEYS {
  videos = "videos",
  video = "video",
}

export const useGetVideosQuery = <TResult = GetVideosVideo[]>({
  enabled = true,
  select,
}: {
  enabled?: boolean;
  select?: (data: GetVideosVideo[]) => TResult;
}) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.videos, backend],
    queryFn: async () => {
      if (backend === SOURCES.TEST_DATA) {
        return getLocalData<{ data: GetVideosVideo[] }>("videos").data;
      }

      const data = await ApiServiceImpl.getVideos(backend!);
      return data.map((video) => ({ ...video, thumbnailPath: `https://${backend}${video.thumbnailPath}` }));
    },
    enabled: enabled && !!backend,
    refetchOnWindowFocus: false,
    select,
  });
};

export const useGetVideoQuery = <TResult = Video>(id?: string, select?: (data: Video) => TResult) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.video, id],
    queryFn: async () => {
      if (backend === SOURCES.TEST_DATA) {
        return getLocalData<Video>("video");
      }

      return await ApiServiceImpl.getVideo(backend!, id!);
    },
    refetchOnWindowFocus: false,
    enabled: !!backend && !!id,
    select,
  });
};
