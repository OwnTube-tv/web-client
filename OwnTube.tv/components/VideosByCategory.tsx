import { View, StyleSheet } from "react-native";
import { CategoryScroll, Typography, VideoThumbnail } from "./";
import { FC } from "react";
import { GetVideosVideo } from "../api/peertubeVideosApi";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";

interface VideosByCategoryProps {
  title: string;
  videos: GetVideosVideo[];
}

export const VideosByCategory: FC<VideosByCategoryProps> = ({ title, videos }) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();

  return (
    <View style={styles.container}>
      <Typography style={styles.categoryTitle}>{title}</Typography>
      <CategoryScroll>
        {videos.map((video) => (
          <VideoThumbnail key={video.uuid} video={video} backend={backend} />
        ))}
      </CategoryScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    paddingLeft: 50,
  },
  container: {
    paddingBottom: 20,
  },
});
