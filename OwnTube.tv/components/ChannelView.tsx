import { useGetChannelVideosQuery } from "../api";
import { VideoGrid } from "./VideoGrid";
import { VideoChannel } from "@peertube/peertube-types";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { getAvailableVidsString } from "../utils";
import { ListSeparator } from "../screens/HomeScreen/components";
import { useAppConfigContext } from "../contexts";

interface ChannelViewProps {
  channel: VideoChannel;
}

export const ChannelView = ({ channel }: ChannelViewProps) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.CHANNELS]>();
  const { data, isLoading, isError, refetch } = useGetChannelVideosQuery(channel.name);
  const { t } = useTranslation();
  const { currentInstanceConfig } = useAppConfigContext();
  const showHorizontalScrollableLists = currentInstanceConfig?.customizations?.homeUseHorizontalListsForMobilePortrait;

  if (!data?.data?.length && !isLoading) {
    return null;
  }

  return (
    <>
      <VideoGrid
        scrollable={showHorizontalScrollableLists}
        reduceHeaderContrast
        isError={isError}
        refetch={refetch}
        isLoading={isLoading}
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
