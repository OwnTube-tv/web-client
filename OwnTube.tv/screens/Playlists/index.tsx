import { useGetPlaylistsCollectionQuery, useGetPlaylistsQuery } from "../../api";
import { Screen } from "../../layouts";
import { Button, EmptyPage, Loader, VideoGrid } from "../../components";
import { getAvailableVidsString } from "../../utils";
import { ROUTES } from "../../types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../theme";
import { useInstanceConfig } from "../../hooks";

export const Playlists = () => {
  const { currentInstanceConfig } = useInstanceConfig();
  const [showHiddenPlaylists, setShowHiddenPlaylists] = useState(false);
  const { data: playlists, isFetching: isFetchingPlaylists } = useGetPlaylistsQuery({
    enabled: true,
    hiddenPlaylists: showHiddenPlaylists ? [] : currentInstanceConfig?.customizations?.playlistsHidden,
  });
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams();
  const { data: playlistSections, isFetching: isFetchingPlaylistVideos } = useGetPlaylistsCollectionQuery(
    playlists?.data,
  );
  const isShowAllButtonVisible =
    currentInstanceConfig?.customizations?.playlistsShowHiddenButton && !showHiddenPlaylists;

  if (isFetchingPlaylists || isFetchingPlaylistVideos) {
    return <Loader />;
  }

  if (!playlistSections.length) {
    return <EmptyPage text={t("noPlaylistsAvailable")} />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      {playlistSections.map((playlistData) => (
        <VideoGrid
          key={playlistData?.id}
          title={playlistData?.displayName}
          data={playlistData?.data}
          headerLink={{
            text: t("viewFullPlaylist") + getAvailableVidsString(playlistData?.total),
            href: {
              pathname: `/${ROUTES.PLAYLIST}`,
              params: { backend, playlist: playlistData?.id },
            },
          }}
        />
      ))}
      {isShowAllButtonVisible && (
        <View style={styles.showAllButtonContainer}>
          <Button contrast="low" text="Show all playlists" onPress={() => setShowHiddenPlaylists(true)} />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  showAllButtonContainer: { alignItems: "flex-start", padding: spacing.xl, width: "100%" },
});
