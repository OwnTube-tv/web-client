import { useTranslation } from "react-i18next";
import { useGetChannelVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";

interface CategoryViewProps {
  category: { name: string; id: number };
  channelHandle?: string;
}

export const CategoryView = ({ category, channelHandle }: CategoryViewProps) => {
  const { t } = useTranslation();
  const { data, isFetching } = useGetChannelVideosQuery(channelHandle, { count: 4, categoryOneOf: [category.id] });

  if (!data?.length || isFetching) {
    return null;
  }

  return <VideoGrid headerLink={{ text: t("viewAll"), href: { pathname: "#" } }} title={category.name} data={data} />;
};
