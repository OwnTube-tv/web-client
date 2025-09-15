import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchApiImpl } from "../searchApi";
import { QUERY_KEYS } from "../constants";
import { retry } from "../helpers";
import { Video, VideosSearchQuery } from "@peertube/peertube-types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";

export const useSearchQuery = (params: VideosSearchQuery) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { count = 15 } = params;

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: { total?: number; data?: Video[]; currentPage?: number; totalPages?: number },
      allPages,
      lastPageParam?: number,
    ) => {
      const fetchedSoFar = allPages.reduce((acc, p) => acc + (p.data?.length ?? 0), 0);

      if (typeof lastPage.total === "number") {
        return fetchedSoFar < lastPage.total ? fetchedSoFar : undefined;
      }

      if (typeof lastPage.currentPage === "number" && typeof lastPage.totalPages === "number") {
        if (lastPage.currentPage < lastPage.totalPages) {
          if (typeof lastPageParam === "number") return lastPageParam + (lastPage.data?.length ?? count);
          return (lastPage.currentPage + 1) * count;
        }
        return undefined;
      }

      if (Array.isArray(lastPage.data)) {
        if (lastPage.data.length < count) return undefined;

        if (typeof lastPageParam === "number") return lastPageParam + lastPage.data.length;
        return fetchedSoFar;
      }

      return undefined;
    },
    queryKey: [QUERY_KEYS.search, params],
    queryFn: async ({ pageParam }) => {
      return SearchApiImpl.searchVideos(backend!, { ...params, start: pageParam });
    },
    retry,
    enabled: !!backend,
    refetchOnWindowFocus: false,
  });
};
