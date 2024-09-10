import { useTranslation } from "react-i18next";
import { useGetChannelVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";
import { useMemo } from "react";
import { ROUTES } from "../../../types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../../app/_layout";

interface CategoryViewProps {
  category: { name: string; id: number };
  channelHandle?: string;
}

export const CategoryView = ({ category, channelHandle }: CategoryViewProps) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL]>();
  const { t } = useTranslation();
  const { data, isFetching } = useGetChannelVideosQuery(channelHandle, { count: 4, categoryOneOf: [category.id] });

  const linkText = useMemo(() => {
    return t("viewAll") + (Number(data?.total) > 4 ? ` (${data?.total})` : "");
  }, [data?.total, t]);

  if (!data?.data?.length && !isFetching) {
    return null;
  }

  return (
    <VideoGrid
      isLoading={isFetching}
      headerLink={{
        text: linkText,
        href: { pathname: ROUTES.CHANNEL_CATEGORY, params: { backend, channel: channelHandle, category: category.id } },
      }}
      title={category.name}
      data={data?.data}
    />
  );
};
