import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { InfoFooter, Loader, VideoGrid } from "../../components";
import { QUERY_KEYS, useGetCategoriesQuery, useInfiniteVideosQuery } from "../../api";
import { useMemo } from "react";
import { useCustomFocusManager, usePageContentTopPadding } from "../../hooks";
import { useTranslation } from "react-i18next";
import { useAppConfigContext } from "../../contexts";
import { useQueryClient } from "@tanstack/react-query";

export const CategoryScreen = () => {
  const queryClient = useQueryClient();
  const { currentInstanceConfig } = useAppConfigContext();
  const { category } = useLocalSearchParams<RootStackParams[ROUTES.CATEGORY]>();
  const { data: categories, isLoading: isLoadingCategories, isError } = useGetCategoriesQuery({});
  const { t } = useTranslation();
  const { top } = usePageContentTopPadding();
  useCustomFocusManager();

  const categoryTitle = useMemo(() => {
    return categories?.find(({ id }) => String(id) === category)?.name;
  }, [categories, category]);

  const {
    fetchNextPage,
    data,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError: isVideosError,
  } = useInfiniteVideosQuery({
    uniqueQueryKey: QUERY_KEYS.categoryVideosView,
    queryParams: { categoryOneOf: [Number(category)] },
    pageSize: currentInstanceConfig?.customizations?.showMoreSize,
  });

  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  const refetchPageData = async () => {
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.videos], type: "active" });
  };

  if (isLoadingCategories) {
    return <Loader />;
  }

  return (
    <Screen onRefresh={refetchPageData} style={{ padding: 0, paddingTop: top }}>
      <VideoGrid
        variant="category"
        isError={isError || isVideosError}
        isLoading={isLoading}
        data={videos}
        title={categoryTitle}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
        link={{ text: t("showMore") }}
        isTVActionCardHidden={!hasNextPage}
      />
      <InfoFooter />
    </Screen>
  );
};
