import { VideoGrid } from "../../../components";
import { useGetPlaylistVideosQuery } from "../../../api";
import { ROUTES } from "../../../types";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { getAvailableVidsString } from "../../../utils";

interface PlaylistVideosViewProps {
  id: number;
  title: string;
  channel?: string;
}

export const PlaylistVideosView = ({ id, title, channel }: PlaylistVideosViewProps) => {
  const { backend } = useLocalSearchParams();
  const { data, isFetching } = useGetPlaylistVideosQuery(id);
  const { t } = useTranslation();

  if ((!data?.data?.length || !data?.total) && !isFetching) {
    return null;
  }

  return (
    <VideoGrid
      isLoading={isFetching}
      title={title}
      data={data?.data}
      headerLink={{
        text: t("viewFullPlaylist") + getAvailableVidsString(data?.total),
        href: {
          pathname: `/${channel ? ROUTES.CHANNEL_PLAYLIST : ROUTES.PLAYLIST}`,
          params: { backend, playlist: id, channel },
        },
      }}
    />
  );
};
