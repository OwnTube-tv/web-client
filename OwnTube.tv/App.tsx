import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, ScaledSize } from 'react-native';
import VideoService from './src/components/Services/videoServices';
import MainPageComponent from './src/components/MainPageComponent';
import { Video, CategoryLabel } from './src/components/VideoTypes';

const App = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<CategoryLabel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [screenSize, setScreenSize] = useState(Dimensions.get('window'));

  useEffect(() => {
    // Skapa en instans av VideoService inuti useEffect för att undvika att skapa en ny instans på varje render.
    const videoService = new VideoService();

    const fetchData = async () => {
      try {
        await videoService.fetchVideos();
        setVideos(videoService.getVideos()); // Antag att getVideos() finns som en metod
        setCategories(videoService.getVideoCategoryLabels()); // Antag att getVideoCategoryLabels() finns som en metod
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      }
    };

    fetchData();

    const onChange = (result: { window: React.SetStateAction<ScaledSize>; }) => {
      setScreenSize(result.window);
    };

    // Prenumerera på skärmstorleksändringar och städa upp
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  if (error) {
    return <View style={styles.errorContainer}><Text>Error: {error}</Text></View>;
  }

  return (
    <ScrollView style={[styles.container, { padding: screenSize.width * 0.05 }]}>
      {categories.length > 0 ? (
        <MainPageComponent videos={videos} categories={categories} />
      ) : (
        <Text style={styles.loadingText}>Loading videos...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
