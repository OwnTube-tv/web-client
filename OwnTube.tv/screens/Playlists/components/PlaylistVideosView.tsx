import { VideoGrid } from "../../../components";
import { useGetPlaylistVideosQuery } from "../../../api";
import { ROUTES } from "../../../types";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { getAvailableVidsString } from "../../../utils";
import { ListSeparator } from "../../HomeScreen/components";
import { useAppConfigContext } from "../../../contexts";
import { useBreakpoints } from "../../../hooks";

interface PlaylistVideosViewProps {
  id: number;
  title: string;
  channel?: string;
  location?: "home" | "other";
}

export const PlaylistVideosView = ({ id, title, channel, location = "other" }: PlaylistVideosViewProps) => {
  const { backend } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useGetPlaylistVideosQuery(id);
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();
  const isOnHomePage = location === "home";
  const { currentInstanceConfig } = useAppConfigContext();
  const showHorizontalScrollableLists = currentInstanceConfig?.customizations?.homeUseHorizontalListsForMobilePortrait;

  if ((!data?.data?.length || !data?.total) && !isLoading && !isError) {
    return null;
  }

  return (
    <>
      <VideoGrid
        variant="playlist"
        scrollable={showHorizontalScrollableLists && isOnHomePage}
        reduceHeaderContrast={isOnHomePage}
        isError={isError}
        refetch={refetch}
        isLoading={isLoading}
        title={title}
        data={data?.data}
        link={{
          text: (isMobile ? t("viewFullPlaylistAbbr") : t("viewFullPlaylist")) + getAvailableVidsString(data?.total),
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
