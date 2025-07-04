import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { ChannelsApiImpl } from "../channelsApi";
import { combineCollectionQueryResults, retry } from "../helpers";
import { VideosCommonQuery } from "@peertube/peertube-types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { GetVideosVideo, OwnTubeError } from "../models";

import { QUERY_KEYS } from "../constants";

export const useGetChannelInfoQuery = (channelHandle?: string) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.channel, backend, channelHandle],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannelInfo(backend!, channelHandle!);
    },
    enabled: !!backend && !!channelHandle,
    retry,
  });
};

export const useGetChannelsQuery = ({ enabled = true }: { enabled?: boolean }) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.channels, backend],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannels(backend!);
    },
    select: ({ data }) => data.filter(({ isLocal }) => isLocal),
    enabled: !!backend && enabled,
    retry,
  });
};

export const useGetChannelVideosQuery = (channelHandle?: string, queryParams: VideosCommonQuery = { count: 4 }) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.channelVideos, backend, channelHandle, queryParams?.categoryOneOf],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannelVideos(backend!, channelHandle!, queryParams);
    },
    enabled: !!backend && !!channelHandle,
    retry,
  });
};

export const useInfiniteGetChannelVideosQuery = (
  queryArgs: Partial<{ channelHandle: string; category: number; pageSize: number; uniqueQueryKey: string }>,
) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();
  const { channelHandle, category, pageSize = 24, uniqueQueryKey } = queryArgs;

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? pageSize : lastPageParam) + (lastPageParam ? pageSize : 0);

      return nextCount >= lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.channelVideos, backend, channelHandle, "infinite", uniqueQueryKey],
    queryFn: async ({ pageParam }) => {
      return await ChannelsApiImpl.getChannelVideos(backend!, channelHandle!, {
        count: pageSize,
        start: pageParam,
        sort: "-publishedAt",
        categoryOneOf: category ? [category] : undefined,
        skipCount: false,
      });
    },
    enabled: !!backend && !!channelHandle,
    retry,
  });
};

export const useGetChannelPlaylistsQuery = (channelHandle?: string) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.channelPlaylists, backend, channelHandle],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannelPlaylists(backend!, channelHandle!);
    },
    enabled: !!backend && !!channelHandle,
    select: (data) => data.filter(({ isLocal, videosLength }) => isLocal && videosLength > 0),
    retry,
  });
};

export const useGetChannelsCollectionQuery = (channelIds: string[] = []) => {
  const { backend } = useLocalSearchParams<RootStackParams["channels"]>();

  return useQueries({
    queries: channelIds?.map((id) => ({
      queryKey: [QUERY_KEYS.channelsCollection, backend, id],
      queryFn: async () => {
        try {
          const res = await ChannelsApiImpl.getChannelVideos(backend!, id, { count: 4 });
          return { ...res, id };
        } catch (error) {
          if ((error as unknown as OwnTubeError).status === 429) {
            throw error;
          }
          return { error, isError: true, id, data: [], total: 0 };
        }
      },
      retry,
      enabled: !!backend,
    })),
    combine: combineCollectionQueryResults<{ id: string }>,
  });
};
