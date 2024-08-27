import { useQuery } from "@tanstack/react-query";
import { ApiServiceImpl } from "./peertubeVideosApi";
import { SOURCES } from "../types";
import { getLocalData } from "./helpers";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { InstanceSearchServiceImpl } from "./instanceSearchApi";
import { GetVideosVideo } from "./models";
import { InstanceInformationApiImpl } from "./instance";

export enum QUERY_KEYS {
  videos = "videos",
  video = "video",
  instances = "instances",
  instance = "instance",
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

      const data = await ApiServiceImpl.getVideos(backend!, 5000);
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

export const useGetInstancesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.instances],
    queryFn: async () => {
      return await InstanceSearchServiceImpl.searchInstances();
    },
    refetchOnWindowFocus: false,
    select: ({ data }) => data,
  });
};

export const useGetInstanceInfoQuery = (backend?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.instance, backend],
    queryFn: async () => {
      return await InstanceInformationApiImpl.getInstanceInfo(backend!);
    },
    select: ({ instance }) => instance,
    enabled: !!backend,
    refetchOnWindowFocus: false,
  });
};
