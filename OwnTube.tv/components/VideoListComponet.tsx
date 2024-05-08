import React, { useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useVideoServiceContext } from "../contexts";
import VideosByCategoryComponent from "./VideosByCategoryComponent";

interface ErrorComponentProps {
  errorMessage: string;
}


const ErrorComponent = ({ errorMessage }: ErrorComponentProps) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Error: {errorMessage}</Text>
  </View>
);

export const MainPageC = () => {
  const { videos, categories, error,  } = useVideoServiceContext();

  if (error) return <ErrorComponent errorMessage={error} />;

  const categoryObjects = useMemo(() => categories.map((category, index) => ({
    id: index,
    label: category
  })), [categories]);

  const videosByCategory = useMemo(() => categoryObjects.map(category => ({
    ...category,
    videos: videos.filter(video => video.category.label === category.label)
  })), [videos, categoryObjects]);

  if (!categories.length || !videos.length) {
    return (
      <View style={styles.centeredContainer}>
        <Text>No videos or categories found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videosByCategory.map((category) => (
        <VideosByCategoryComponent key={category.id} category={category} videos={category.videos} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
