import { VideoGrid } from "../../../components";
import { useTranslation } from "react-i18next";
import { useGetVideosQuery } from "../../../api";
import { useMemo } from "react";

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
    },
    customQueryKey: `category-${category.id}`,
  });

  const linkText = useMemo(() => {
    return t("viewAll") + (Number(data?.total) > 4 ? ` (${data?.total})` : "");
  }, [data?.total, t]);

  if (!data?.data?.length && !isFetching) {
    return null;
  }

  return (
    <VideoGrid
      isLoading={isFetching}
      headerLink={{ text: linkText, href: { pathname: "#" } }}
      title={category.name}
      data={data?.data}
    />
  );
};
