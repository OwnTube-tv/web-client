import { useTranslation } from "react-i18next";
import { useGetChannelVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";
import { ROUTES } from "../../../types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../../app/_layout";
import { getAvailableVidsString } from "../../../utils";

interface CategoryViewProps {
  category: { name: string; id: number };
  channelHandle?: string;
}

export const CategoryView = ({ category, channelHandle }: CategoryViewProps) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL]>();
  const { t } = useTranslation();
  const { data, isLoading } = useGetChannelVideosQuery(channelHandle, { count: 4, categoryOneOf: [category.id] });

  if (!data?.data?.length && !isLoading) {
    return null;
  }

  return (
    <VideoGrid
      isLoading={isLoading}
      link={{
        text: t("viewCategory") + getAvailableVidsString(data?.total),
        href: {
          pathname: `/${ROUTES.CHANNEL_CATEGORY}`,
          params: { backend, channel: channelHandle, category: category.id },
        },
      }}
      title={category.name}
      data={data?.data}
    />
  );
};
