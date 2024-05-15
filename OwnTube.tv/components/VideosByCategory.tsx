import { View, StyleSheet } from "react-native";
import { CategoryScroll, Typography, VideoThumbnail } from "./";
import type { VideoCategory } from "../types";

interface VideosByCategoryProps {
  category: VideoCategory;
}

export const VideosByCategory: React.FC<VideosByCategoryProps> = ({ category }) => {
  return (
    <View style={styles.container}>
      <Typography style={styles.categoryTitle}>{category.label}</Typography>

      <CategoryScroll>
        {category.videos.map((video) => (
          <VideoThumbnail key={video.id} video={video} />
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
