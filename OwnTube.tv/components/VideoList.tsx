import { View, StyleSheet, FlatList, ListRenderItem } from "react-native";
import { ErrorMessage, Loader, Typography } from "./";
import { useGetVideosQuery } from "../api";
import { GetVideosVideo } from "../api/models";
import { VideoChannel } from "./VideoChannel";
import { organizeVideosByChannelAndCategory, VideosByChannel } from "../utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const VideoList = () => {
  const { t } = useTranslation();
  const { data, error, isFetching } = useGetVideosQuery<{
    raw: GetVideosVideo[];
    videosByChannel: VideosByChannel;
  }>({
    select: (data) => ({
      raw: data,
      videosByChannel: organizeVideosByChannelAndCategory(data),
    }),
  });

  const renderVideoChannelListItem = useCallback<ListRenderItem<VideosByChannel[number]>>(({ item }) => {
    return <VideoChannel channel={item.channel} data={item.data} />;
  }, []);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isFetching) {
    return <Loader />;
  }

  if (data?.raw.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Typography>{t("noVideosOrCategoriesFound")}</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList data={data?.videosByChannel} renderItem={renderVideoChannelListItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 10,
  },
});
