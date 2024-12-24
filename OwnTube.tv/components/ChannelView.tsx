import { useGetChannelVideosQuery } from "../api";
import { VideoGrid } from "./index";
import { VideoChannel } from "@peertube/peertube-types";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { getAvailableVidsString } from "../utils";
import { ListSeparator } from "../screens/HomeScreen/components";

interface ChannelViewProps {
  channel: VideoChannel;
}

export const ChannelView = ({ channel }: ChannelViewProps) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.CHANNELS]>();
  const { data, isFetching, isError, refetch } = useGetChannelVideosQuery(channel.name);
  const { t } = useTranslation();

  if (!data?.data?.length && !isFetching) {
    return null;
  }

  return (
    <>
      <VideoGrid
        reduceHeaderContrast
        isError={isError}
        refetch={refetch}
        isLoading={isFetching}
        link={{
          text: t("visitChannel") + getAvailableVidsString(data?.total),
          href: { pathname: `/${ROUTES.CHANNEL}`, params: { backend, channel: channel.name } },
        }}
        variant="channel"
        key={channel.id}
        title={channel.displayName}
        data={data?.data}
        channelLogoUri={channel.avatars?.[0]?.path}
      />
      <ListSeparator />
    </>
  );
};
