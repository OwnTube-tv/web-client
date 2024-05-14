import { View, Text, StyleSheet } from "react-native";
import { ErrorMessage, VideosByCategory } from "./";
import { useVideoServiceContext } from "../contexts";
import { useCategoryFilter } from "../hooks";

export const VideoList = () => {
  const { error } = useVideoServiceContext();
  const { videosByCategory, isEmpty } = useCategoryFilter();

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (isEmpty) {
    return (
      <View style={styles.centeredContainer}>
        <Text>No videos or categories found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videosByCategory.map((category) => (
        <VideosByCategory key={category.id} category={category} />
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
