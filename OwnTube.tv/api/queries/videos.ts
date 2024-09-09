import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { GetVideosVideo } from "../models";
import { ApiServiceImpl } from "../peertubeVideosApi";
import { VideosCommonQuery } from "@peertube/peertube-types";
import { SOURCES } from "../../types";
import { getLocalData, retry } from "../helpers";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";

import { QUERY_KEYS } from "../constants";

export const useGetVideosQuery = <TResult = GetVideosVideo[]>({
  enabled = true,
  select,
  params,
  customQueryKey,
}: {
  enabled?: boolean;
  select?: (queryReturn: { data: GetVideosVideo[]; total: number }) => { data: TResult; total: number };
  params?: VideosCommonQuery;
  customQueryKey?: string;
}) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.videos, backend, customQueryKey],
    queryFn: async () => {
      if (backend === SOURCES.TEST_DATA) {
        return getLocalData<{ data: GetVideosVideo[]; total: 10 }>("videos");
      }

      return await ApiServiceImpl.getVideos(backend!, { count: 50, ...params });
    },
    enabled: enabled && !!backend,
    refetchOnWindowFocus: false,
    select,
    retry,
  });
};

export const useInfiniteVideosQuery = (pageSize = 4) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? pageSize * 3 : lastPageParam) + (lastPageParam ? pageSize : 0);

      return nextCount > lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.videos, backend, "infinite"],
    queryFn: async ({ pageParam }) => {
      return await ApiServiceImpl.getVideos(backend!, {
        count: pageParam === 0 ? pageSize * 3 : pageSize,
        start: pageParam,
        sort: "-publishedAt",
      });
    },
    refetchOnWindowFocus: false,
    enabled: !!backend,
    retry,
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
    retry,
  });
};
