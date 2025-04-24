import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { GetVideosVideo } from "../models";
import { ApiServiceImpl } from "../peertubeVideosApi";
import { VideosCommonQuery, Video } from "@peertube/peertube-types";
import { SOURCES } from "../../types";
import { getLocalData, retry } from "../helpers";

import { QUERY_KEYS } from "../constants";
import { useAppConfigContext } from "../../contexts";

export const useGetVideosQuery = <TResult = GetVideosVideo[]>({
  enabled = true,
  select,
  params,
  uniqueQueryKey,
}: {
  enabled?: boolean;
  select?: (queryReturn: { data: GetVideosVideo[]; total: number }) => { data: TResult; total: number };
  params?: VideosCommonQuery;
  uniqueQueryKey?: string;
}) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.videos, backend, uniqueQueryKey],
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

export const useInfiniteVideosQuery = (
  queryArg: Partial<{
    firstPageSize?: number;
    pageSize: number;
    uniqueQueryKey: string;
    queryParams: VideosCommonQuery;
  }>,
) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();
  const { pageSize = 24, uniqueQueryKey, queryParams, firstPageSize } = queryArg;
  const _0PageSize = firstPageSize ?? pageSize;

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? _0PageSize : lastPageParam) + (lastPageParam ? pageSize : 0);

      return nextCount >= lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.videos, backend, "infinite", uniqueQueryKey],
    queryFn: async ({ pageParam }) => {
      return await ApiServiceImpl.getVideos(backend!, {
        count: pageParam === 0 ? _0PageSize : pageSize,
        start: pageParam,
        sort: "-publishedAt",
        ...queryParams,
      });
    },
    refetchOnWindowFocus: false,
    enabled: !!backend,
    retry,
  });
};

export const useGetVideoQuery = <TResult = Video>({
  id,
  select,
  enabled = true,
}: {
  id?: string;
  select?: (data: Video) => TResult;
  enabled?: boolean;
}) => {
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
    enabled: !!backend && !!id && enabled,
    select,
    retry,
  });
};

export const usePostVideoViewMutation = () => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();
  const { sessionId } = useAppConfigContext();

  return useMutation({
    mutationFn: async ({
      videoId,
      currentTime = 0,
      viewEvent,
    }: {
      videoId?: string;
      currentTime?: number;
      viewEvent?: "seek";
    }) => {
      return await ApiServiceImpl.postVideoView(backend!, videoId!, {
        currentTime,
        viewEvent,
        sessionId,
      });
    },
  });
};

export const useGetVideoCaptionsQuery = (id?: string, enabled = true) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.videoCaptions, id],
    queryFn: async () => {
      return await ApiServiceImpl.getVideoCaptions(backend!, id!);
    },
    refetchOnWindowFocus: false,
    enabled: !!backend && !!id && enabled,
    retry,
  });
};
