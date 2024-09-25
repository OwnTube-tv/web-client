import { useGetPlaylistsQuery } from "../../api";
import { PlaylistVideosView } from "./components";
import { Screen } from "../../layouts";
import { Button, Loader } from "../../components";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../theme";
import { useInstanceConfig } from "../../hooks";

export const Playlists = () => {
  const { currentInstanceConfig } = useInstanceConfig();
  const [showHiddenPlaylists, setShowHiddenPlaylists] = useState(false);
  const { data: playlists, isFetching } = useGetPlaylistsQuery({
    enabled: true,
    hiddenPlaylists: showHiddenPlaylists ? [] : currentInstanceConfig?.customizations?.playlistsHidden,
  });

  const isShowAllButtonVisible =
    currentInstanceConfig?.customizations?.playlistsShowHiddenButton && !showHiddenPlaylists;

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Screen style={{ padding: 0 }}>
      {playlists?.data?.map(({ id, displayName }) => <PlaylistVideosView title={displayName} key={id} id={id} />)}
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
