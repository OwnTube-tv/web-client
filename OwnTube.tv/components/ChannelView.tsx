import { useGetChannelVideosQuery } from "../api";
import { VideoGrid } from "./index";
import { VideoChannel } from "@peertube/peertube-types";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";

interface ChannelViewProps {
  channel: VideoChannel;
}

export const ChannelView = ({ channel }: ChannelViewProps) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.CHANNELS]>();
  const { data, isFetching } = useGetChannelVideosQuery(channel.name);
  const { t } = useTranslation();

  if (!data?.length && !isFetching) {
    return null;
  }

  return (
    <VideoGrid
      isLoading={isFetching}
      headerLink={{
        text: t("visitChannel"),
        href: { pathname: ROUTES.CHANNEL, params: { backend, channel: channel.name } },
      }}
      variant="channel"
      key={channel.id}
      title={channel.displayName}
      data={data}
      channelLogoUri={channel.avatars?.[0]?.path}
    />
  );
};
