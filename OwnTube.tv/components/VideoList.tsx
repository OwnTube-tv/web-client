import { View, StyleSheet } from "react-native";
import { ErrorMessage, Loader, Typography, VideosByCategory } from "./";
import { useGetVideosQuery } from "../api";
import { GetVideosVideo } from "../api/models";

type CategorizedVideos = Record<string, GetVideosVideo[]>;

export const VideoList = () => {
  const { data, error, isFetching } = useGetVideosQuery<{
    videos: GetVideosVideo[];
    videosByCategory: CategorizedVideos;
  }>({
    select: (data) => ({
      videos: data,
      videosByCategory: data.reduce<CategorizedVideos>((acc, cur) => {
        acc[cur.category.label] = [...(acc[cur.category.label] || []), cur];
        return acc;
      }, {}),
    }),
  });

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isFetching) {
    return <Loader />;
  }

  if (data?.videos.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Typography>No videos or categories found.</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Object.entries(data?.videosByCategory || {}).map(([category, videos]) => (
        <VideosByCategory key={category} title={category} videos={videos} />
      ))}
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
