import { View, Text, StyleSheet } from "react-native";
import { CategoryScroll, VideoThumbnail } from "./";
import type { VideoCategory } from "../types";

interface VideosByCategoryProps {
  category: VideoCategory;
}

export const VideosByCategory: React.FC<VideosByCategoryProps> = ({ category }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category.label}</Text>

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
    // color: theme.colors.white,
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    paddingLeft: 50,
  },
  container: {
    // backgroundColor: theme.colors.darkGray,
    paddingBottom: 20,
  },
});
