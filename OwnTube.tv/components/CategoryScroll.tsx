import { FC, useCallback, useState } from "react";
import { View, StyleSheet, FlatList, ViewToken } from "react-native";
import { useCategoryScroll, useViewHistory } from "../hooks";
import { Button, VideoThumbnail } from "./";
import { useTheme } from "@react-navigation/native";
import { GetVideosVideo } from "../api/models";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";

export const CategoryScroll: FC<{ videos: GetVideosVideo[] }> = ({ videos }) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { getViewHistoryEntryByUuid } = useViewHistory(false);
  const { ref, windowWidth, scrollRight, scrollLeft } = useCategoryScroll();
  const { colors } = useTheme();
  const [viewableItems, setViewableItems] = useState<string[]>([]);

  const renderItem = useCallback(
    ({ item: video }: { item: GetVideosVideo }) => {
      const { timestamp } = getViewHistoryEntryByUuid(video.uuid) || {};

      return (
        <VideoThumbnail
          isVisible={viewableItems.includes(video.uuid)}
          key={video.uuid}
          video={video}
          backend={backend}
          timestamp={timestamp}
        />
      );
    },
    [backend, getViewHistoryEntryByUuid],
  );

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<GetVideosVideo>[] }) =>
      setViewableItems(viewableItems.map(({ key }) => key)),
    [],
  );

  return (
    <View style={styles.horizontalScrollContainer}>
      <Button
        icon="Chevron"
        onPress={scrollLeft}
        style={{ ...styles.scrollButton, ...styles.scrollLeft, backgroundColor: colors.card }}
      />
      <FlatList
        onViewableItemsChanged={handleViewableItemsChanged}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={ref}
        contentContainerStyle={styles.videoThumbnailsContainer}
        data={videos}
        renderItem={renderItem}
        style={[styles.scrollView, { width: windowWidth - 120 }]}
        keyExtractor={({ uuid }) => uuid}
        viewabilityConfig={{
          minimumViewTime: 0,
          itemVisiblePercentThreshold: 0,
          waitForInteraction: false,
        }}
      />
      <Button
        icon="Chevron"
        onPress={scrollRight}
        style={{ ...styles.scrollButton, ...styles.scrollRight, backgroundColor: colors.card }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalScrollContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginHorizontal: 5,
    width: 40,
  },
  scrollLeft: { transform: [{ rotate: "90deg" }] },
  scrollRight: { transform: [{ rotate: "-90deg" }] },
  scrollView: {
    flexGrow: 0,
    overflow: "visible",
  },
  videoThumbnailsContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
