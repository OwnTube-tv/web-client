import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { CategoriesApiImpl } from "../categoriesApi";
import { retry } from "../helpers";

export const useGetCategoriesQuery = ({ enabled = true }: { enabled?: boolean }) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.categories, backend],
    queryFn: async () => {
      return await CategoriesApiImpl.getCategories(backend!);
    },
    enabled: !!backend && enabled,
    refetchOnWindowFocus: false,
    retry,
  });
};
