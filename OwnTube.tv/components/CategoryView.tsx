import { VideoGrid } from "./VideoGrid";
import { useTranslation } from "react-i18next";
import { useGetVideosQuery } from "../api";
import { ROUTES } from "../types";
import { useLocalSearchParams } from "expo-router";
import { getAvailableVidsString } from "../utils";
import { ListSeparator } from "../screens/HomeScreen/components";
import { useAppConfigContext } from "../contexts";

interface CategoryViewProps {
  category: { name: string; id: number };
}

export const CategoryView = ({ category }: CategoryViewProps) => {
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useGetVideosQuery({
    enabled: true,
    params: {
      categoryOneOf: [category.id],
      count: 4,
      sort: "-publishedAt",
    },
    uniqueQueryKey: `category-${category.id}`,
  });
  const { currentInstanceConfig } = useAppConfigContext();
  const showHorizontalScrollableLists = currentInstanceConfig?.customizations?.homeUseHorizontalListsForMobilePortrait;

  if (!data?.data?.length && !isLoading && !isError) {
    return null;
  }

  return (
    <>
      <VideoGrid
        variant="category"
        scrollable={showHorizontalScrollableLists}
        reduceHeaderContrast
        refetch={refetch}
        isError={isError}
        isLoading={isLoading}
        link={{
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
