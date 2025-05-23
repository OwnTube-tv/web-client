import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useQueries, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { CategoriesApiImpl } from "../categoriesApi";
import { combineCollectionQueryResults, retry } from "../helpers";
import { ApiServiceImpl } from "../peertubeVideosApi";
import { OwnTubeError } from "../models";

export const useGetCategoriesQuery = ({ enabled = true }: { enabled?: boolean }) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.categories, backend],
    queryFn: async () => {
      return await CategoriesApiImpl.getCategories(backend!);
    },
    enabled: !!backend && enabled,
    retry,
  });
};

export const useGetCategoriesCollectionQuery = (categories: Array<{ name: string; id: number }> = []) => {
  const { backend } = useLocalSearchParams<RootStackParams["categories"]>();

  return useQueries({
    queries: categories?.map(({ name, id }) => ({
      queryKey: [QUERY_KEYS.categoriesCollection, id, backend],
      queryFn: async () => {
        try {
          const res = await ApiServiceImpl.getVideos(backend!, {
            categoryOneOf: [id],
            count: 4,
            sort: "-publishedAt",
          });

          return { ...res, name, id };
        } catch (error) {
          if ((error as unknown as OwnTubeError).code === 429) {
            throw error;
          }
          return { error, isError: true, id, name, data: [], total: 0 };
        }
      },
      retry,
      enabled: !!backend,
    })),
    combine: combineCollectionQueryResults<{ name: string; id: number }>,
  });
};
