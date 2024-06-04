import { useQuery } from "@tanstack/react-query";
import { ApiServiceImpl, GetVideosVideo } from "./peertubeVideosApi";
import { useAppConfigContext } from "../contexts";
import { SOURCES } from "../types";
import { getLocalData } from "./helpers";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";

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
  const { source } = useAppConfigContext();

  return useQuery({
    queryKey: [QUERY_KEYS.videos],
    queryFn: async () => {
      if (source === SOURCES.TEST_DATA) {
        return getLocalData<{ data: GetVideosVideo[] }>("videos").data;
      }

      const data = await ApiServiceImpl.getVideos(source!);
      return data.map((video) => ({ ...video, thumbnailPath: `${source}${video.thumbnailPath}` }));
    },
    enabled: enabled && !!source,
    refetchOnWindowFocus: false,
    select,
  });
};

export const useGetVideoQuery = (id?: string) => {
  const { source } = useAppConfigContext();

  return useQuery({
    queryKey: [QUERY_KEYS.video],
    queryFn: async () => {
      if (source === SOURCES.TEST_DATA) {
        return getLocalData<Video>("video");
      }

      return await ApiServiceImpl.getVideo(source!, id!);
    },
    refetchOnWindowFocus: false,
    enabled: !!source && !!id,
  });
};
