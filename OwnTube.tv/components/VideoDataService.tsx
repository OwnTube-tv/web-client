import { View, Image, StyleSheet } from "react-native";
import { useVideoServiceContext } from "../contexts";
import { Typography } from "./Typography";

export const VideoDataService = () => {
  const { videos, categories, error } = useVideoServiceContext();

  if (error) {
    return (
      <View>
        <Typography>Error: {error}</Typography>
      </View>
    );
  }

  return (
    <View>
      {/* Display Category Labels */}
      {categories.map((category) => (
        <View key={category}>
          <Typography>Category: {category}</Typography>
          <View>
            {videos
              .filter((video) => video.category.label === category)
              .map((video) => (
                <View key={video.id}>
                  <Typography>ID: {video.id}</Typography>
                  <Typography>Name: {video.name}</Typography>
                  <Typography>Category ID: {video.category.id}</Typography>
                  <Typography>Category Label: {video.category.label}</Typography>
                  <Image source={{ uri: video.thumbnailUrl }} style={styles.image} />
                </View>
              ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 180,
    width: 200,
  },
});
