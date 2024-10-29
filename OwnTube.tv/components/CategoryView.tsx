import { VideoGrid } from "./index";
import { useTranslation } from "react-i18next";
import { useGetVideosQuery } from "../api";
import { ROUTES } from "../types";
import { useLocalSearchParams } from "expo-router";
import { getAvailableVidsString } from "../utils";
import { ListSeparator } from "../screens/HomeScreen/components";

interface CategoryViewProps {
  category: { name: string; id: number };
}

export const CategoryView = ({ category }: CategoryViewProps) => {
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams();
  const { data, isFetching, isError, refetch } = useGetVideosQuery({
    enabled: true,
    params: {
      categoryOneOf: [category.id],
      count: 4,
      sort: "-publishedAt",
    },
    uniqueQueryKey: `category-${category.id}`,
  });

  if (!data?.data?.length && !isFetching) {
    return null;
  }

  return (
    <>
      <VideoGrid
        reduceHeaderContrast
        refetch={refetch}
        isError={isError}
        isLoading={isFetching}
        headerLink={{
          text: t("viewCategory") + getAvailableVidsString(data?.total),
          href: { pathname: `/${ROUTES.CATEGORY}`, params: { backend, category: category.id } },
        }}
        title={category.name}
        data={data?.data}
      />
      <ListSeparator />
    </>
  );
};
