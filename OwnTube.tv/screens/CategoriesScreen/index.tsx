import { getErrorTextKeys, QUERY_KEYS, useGetCategoriesCollectionQuery, useGetCategoriesQuery } from "../../api";
import { Screen } from "../../layouts";
import { EmptyPage, ErrorPage, Loader, VideoGrid } from "../../components";
import { getAvailableVidsString } from "../../utils";
import { ROUTES } from "../../types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorForbiddenLogo } from "../../components/Svg";

export const CategoriesScreen = () => {
  const queryClient = useQueryClient();
  const {
    data: categories,
    isFetching: isFetchingCategories,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery({});
  const {
    data,
    isFetching: isFetchingCategoriesCollection,
    isError: isCollectionError,
  } = useGetCategoriesCollectionQuery(categories);
  const { backend } = useLocalSearchParams();
  const { t } = useTranslation();
  const isError = isCategoriesError || isCollectionError;
  const isFetching = isFetchingCategoriesCollection || isFetchingCategories;

  const retry = async () => {
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.categories] });
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.categoriesCollection] });
  };

  if (isFetching) {
    return <Loader />;
  }

  if (isError) {
    const { title, description } = getErrorTextKeys(categoriesError);

    return (
      <ErrorPage
        title={t(title)}
        description={t(description)}
        logo={<ErrorForbiddenLogo />}
        button={{ text: t("tryAgain"), action: retry }}
      />
    );
  }

  if (!data.length) {
    return <EmptyPage text={t("noCategoriesAvailable")} />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      {data?.map(({ data, isFetching, refetch }) => (
        <VideoGrid
          isLoading={isFetching}
          refetch={refetch}
          key={data?.id}
          headerLink={{
            text: t("viewCategory") + getAvailableVidsString(data?.total),
            href: { pathname: `/${ROUTES.CATEGORY}`, params: { backend, category: data?.id } },
          }}
          title={data?.name}
          data={data?.data}
        />
      ))}
    </Screen>
  );
};
