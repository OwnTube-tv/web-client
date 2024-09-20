import { VideoGrid } from "./index";
import { useTranslation } from "react-i18next";
import { useGetVideosQuery } from "../api";
import { ROUTES } from "../types";
import { useLocalSearchParams } from "expo-router";
import { getAvailableVidsString } from "../utils";

interface CategoryViewProps {
  category: { name: string; id: number };
}

export const CategoryView = ({ category }: CategoryViewProps) => {
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams();
  const { data, isFetching } = useGetVideosQuery({
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
    <VideoGrid
      isLoading={isFetching}
      headerLink={{
        text: t("viewCategory") + getAvailableVidsString(data?.total),
        href: { pathname: `/${ROUTES.CATEGORY}`, params: { backend, category: category.id } },
      }}
      title={category.name}
      data={data?.data}
    />
  );
};
