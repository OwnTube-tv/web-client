import { useGetCategoriesCollectionQuery, useGetCategoriesQuery } from "../../api";
import { Screen } from "../../layouts";
import { EmptyPage, Loader, VideoGrid } from "../../components";
import { getAvailableVidsString } from "../../utils";
import { ROUTES } from "../../types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";

export const CategoriesScreen = () => {
  const { data: categories, isFetching: isFetchingCategories } = useGetCategoriesQuery({});
  const { data, isFetching } = useGetCategoriesCollectionQuery(categories);
  const { backend } = useLocalSearchParams();
  const { t } = useTranslation();

  if (isFetching || isFetchingCategories) {
    return <Loader />;
  }

  if (!data.length) {
    return <EmptyPage text={t("noCategoriesAvailable")} />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      {data?.map((categoryData) => (
        <VideoGrid
          key={categoryData?.id}
          headerLink={{
            text: t("viewCategory") + getAvailableVidsString(categoryData?.total),
            href: { pathname: `/${ROUTES.CATEGORY}`, params: { backend, category: categoryData?.id } },
          }}
          title={categoryData?.name}
          data={categoryData?.data}
        />
      ))}
    </Screen>
  );
};
