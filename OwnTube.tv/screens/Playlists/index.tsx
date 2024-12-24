import { getErrorTextKeys, QUERY_KEYS, useGetPlaylistsCollectionQuery, useGetPlaylistsQuery } from "../../api";
import { Screen } from "../../layouts";
import { Button, EmptyPage, ErrorPage, InfoFooter, Loader, VideoGrid } from "../../components";
import { getAvailableVidsString } from "../../utils";
import { ROUTES } from "../../types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../theme";
import { useInstanceConfig } from "../../hooks";
import { ErrorForbiddenLogo } from "../../components/Svg";
import { useQueryClient } from "@tanstack/react-query";

export const Playlists = () => {
  const { currentInstanceConfig } = useInstanceConfig();
  const queryClient = useQueryClient();
  const [showHiddenPlaylists, setShowHiddenPlaylists] = useState(false);
  const {
    data: playlists,
    isFetching: isFetchingPlaylists,
    isError: isPlaylistsError,
    error: playlistsError,
  } = useGetPlaylistsQuery({
    enabled: true,
    hiddenPlaylists: showHiddenPlaylists ? [] : currentInstanceConfig?.customizations?.playlistsHidden,
  });
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams();
  const {
    data: playlistSections,
    isFetching: isFetchingPlaylistVideos,
    isError: isCollectionError,
  } = useGetPlaylistsCollectionQuery(playlists?.data);
  const isShowAllButtonVisible =
    currentInstanceConfig?.customizations?.playlistsShowHiddenButton && !showHiddenPlaylists;
  const isError = isPlaylistsError || isCollectionError;
  const isFetching = isFetchingPlaylists || isFetchingPlaylistVideos;

  const retry = async () => {
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.playlists] });
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.playlistsCollection] });
  };

  if (isFetching) {
    return <Loader />;
  }

  if (isError) {
    const { title, description } = getErrorTextKeys(playlistsError);

    return (
      <ErrorPage
        title={t(title)}
        description={t(description)}
        logo={<ErrorForbiddenLogo />}
        button={{ text: t("tryAgain"), action: retry }}
      />
    );
  }

  if (!playlistSections.length) {
    return <EmptyPage text={t("noPlaylistsAvailable")} />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      {playlistSections.map(({ data, isFetching, refetch }) => (
        <VideoGrid
          isLoading={isFetching}
          variant="playlist"
          isError={data?.isError}
          refetch={refetch}
          key={data?.id}
          title={data?.displayName}
          data={data?.data}
          link={{
            text: t("viewFullPlaylist") + getAvailableVidsString(data?.total),
            href: {
              pathname: `/${ROUTES.PLAYLIST}`,
              params: { backend, playlist: data?.id },
            },
          }}
        />
      ))}
      {isShowAllButtonVisible && (
        <View style={styles.showAllButtonContainer}>
          <Button contrast="low" text="Show all playlists" onPress={() => setShowHiddenPlaylists(true)} />
        </View>
      )}
      <InfoFooter />
    </Screen>
  );
};

const styles = StyleSheet.create({
  showAllButtonContainer: { alignItems: "flex-start", padding: spacing.xl, width: "100%" },
});
