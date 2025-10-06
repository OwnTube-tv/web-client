import { getErrorTextKeys, QUERY_KEYS, useGetCategoriesCollectionQuery, useGetCategoriesQuery } from "../../api";
import { Screen } from "../../layouts";
import { EmptyPage, ErrorPage, InfoFooter, Loader, VideoGrid } from "../../components";
import { getAvailableVidsString } from "../../utils";
import { ROUTES } from "../../types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorForbiddenLogo } from "../../components/Svg";
import { useCustomFocusManager, usePageContentTopPadding } from "../../hooks";

export const CategoriesScreen = () => {
  const queryClient = useQueryClient();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery({});
  const {
    data,
    isLoading: isLoadingCategoriesCollection,
    isError: isCollectionError,
    error: collectionError,
  } = useGetCategoriesCollectionQuery(categories);
  const { backend } = useLocalSearchParams();
  const { t } = useTranslation();
  const { top } = usePageContentTopPadding();
  const isError = isCategoriesError || isCollectionError;
  const isLoading = isLoadingCategoriesCollection || isLoadingCategories;
  useCustomFocusManager();

  const refetchPageData = async () => {
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.categories] });
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.categoriesCollection] });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    const { title, description } = getErrorTextKeys(categoriesError || collectionError[0] || null);

    return (
      <ErrorPage
        title={t(title)}
        description={t(description)}
        logo={<ErrorForbiddenLogo />}
        button={{ text: t("tryAgain"), action: refetchPageData }}
      />
    );
  }

  if (!data.length) {
    return <EmptyPage text={t("noCategoriesAvailable")} />;
  }

  return (
    <Screen onRefresh={refetchPageData} style={{ padding: 0, paddingTop: top }}>
      {data?.map(({ data, isLoading, refetch }) => (
        <VideoGrid
          isLoading={isLoading}
          refetch={refetch}
          key={data?.id}
          link={{
            text: t("viewCategory") + getAvailableVidsString(data?.total),
            href: { pathname: `/${ROUTES.CATEGORY}`, params: { backend, category: data?.id } },
          }}
          title={data?.name}
          data={data?.data}
        />
      ))}
      <InfoFooter />
    </Screen>
  );
};
