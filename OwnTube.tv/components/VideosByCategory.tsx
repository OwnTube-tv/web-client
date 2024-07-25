import { View, StyleSheet } from "react-native";
import { CategoryScroll, Typography } from "./";
import { FC } from "react";
import { GetVideosVideo } from "../api/models";

interface VideosByCategoryProps {
  title: string;
  videos: GetVideosVideo[];
}

export const VideosByCategory: FC<VideosByCategoryProps> = ({ title, videos }) => {
  return (
    <View style={styles.container}>
      <Typography style={styles.categoryTitle}>{title}</Typography>
      <CategoryScroll videos={videos} />
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
