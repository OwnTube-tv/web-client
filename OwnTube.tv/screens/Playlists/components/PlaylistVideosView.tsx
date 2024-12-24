import { VideoGrid } from "../../../components";
import { useGetPlaylistVideosQuery } from "../../../api";
import { ROUTES } from "../../../types";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { getAvailableVidsString } from "../../../utils";
import { ListSeparator } from "../../HomeScreen/components";

interface PlaylistVideosViewProps {
  id: number;
  title: string;
  channel?: string;
  location?: "home" | "other";
}

export const PlaylistVideosView = ({ id, title, channel, location = "other" }: PlaylistVideosViewProps) => {
  const { backend } = useLocalSearchParams();
  const { data, isFetching, isError, refetch } = useGetPlaylistVideosQuery(id);
  const { t } = useTranslation();
  const isOnHomePage = location === "home";

  if ((!data?.data?.length || !data?.total) && !isFetching) {
    return null;
  }

  return (
    <>
      <VideoGrid
        variant="playlist"
        reduceHeaderContrast={isOnHomePage}
        isError={isError}
        refetch={refetch}
        isLoading={isFetching}
        title={title}
        data={data?.data}
        link={{
          text: t("viewFullPlaylist") + getAvailableVidsString(data?.total),
          href: {
            pathname: `/${channel ? ROUTES.CHANNEL_PLAYLIST : ROUTES.PLAYLIST}`,
            params: { backend, playlist: id, channel },
          },
        }}
      />
      {isOnHomePage && <ListSeparator />}
    </>
  );
};
