import { VideoGrid } from "../../../components";
import { useTranslation } from "react-i18next";
import { useGetVideosQuery } from "../../../api";

interface CategoryViewProps {
  category: { name: string; id: number };
}

export const CategoryView = ({ category }: CategoryViewProps) => {
  const { t } = useTranslation();
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
      headerLink={{ text: `${t("viewAll")} (${Number(data?.total)})`, href: { pathname: "#" } }}
      title={category.name}
      data={data?.data}
    />
  );
};
