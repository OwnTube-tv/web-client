import { View, Text, Image, StyleSheet } from "react-native";
import { useVideoServiceContext } from "../contexts";

export const VideoDataService = () => {
  const { videos, categories, error } = useVideoServiceContext();

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Display Category Labels */}
      {categories.map((category) => (
        <View key={category}>
          <Text>Category: {category}</Text>
          <View>
            {videos
              .filter((video) => video.category.label === category)
              .map((video) => (
                <View key={video.id}>
                  <Text>ID: {video.id}</Text>
                  <Text>Name: {video.name}</Text>
                  <Text>Category ID: {video.category.id}</Text>
                  <Text>Category Label: {video.category.label}</Text>
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
