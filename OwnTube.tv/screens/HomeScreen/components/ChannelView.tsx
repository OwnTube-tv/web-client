import { useGetChannelVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";
import { VideoChannel } from "@peertube/peertube-types";
import { useTranslation } from "react-i18next";

interface ChannelViewProps {
  channel: VideoChannel;
}

export const ChannelView = ({ channel }: ChannelViewProps) => {
  const { data, isFetching } = useGetChannelVideosQuery(channel.name);
  const { t } = useTranslation();

  if (!data?.length || isFetching) {
    return null;
  }

  return (
    <VideoGrid
      headerLink={{ text: t("visitChannel"), href: { pathname: "#" } }}
      variant="channel"
      key={channel.id}
      title={channel.displayName}
      data={data}
      channelLogoUri={channel.avatars?.[0]?.path}
    />
  );
};
