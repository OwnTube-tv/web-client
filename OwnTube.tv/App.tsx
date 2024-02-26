import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions } from 'react-native';
import VideoService from './src/components/Services/videoServices'; 
import { Video } from './src/components/VideoTypes';
import MainPageComponent from './src/components/MainPageComponent';

const videoService = new VideoService();

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetVideos = async () => {
      try {
        await videoService.fetchVideos();
        // Här används den första kategorin som exempel
        const categories = videoService.getVideoCategoryLabels();
        if (categories.length > 0) {
          const categoryVideos = videoService.getVideosForCategory(categories[0]);
          setVideos(categoryVideos);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      }
    };

    fetchAndSetVideos();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (

    <View style={styles.container}>
      
      {/* Conditional rendering*/}
      {videos.length > 0 ? (
        <MainPageComponent videos={videos} />
      ) : (
        <Text>Loading videos...</Text>
      )}
      
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
  videoItem: {
    margin: 10,
    width: screenWidth / 2 - 20, // Halva skärmbredden minus marginalen
    alignItems: 'center',
  },
  videoImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 4,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  videoCategory: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: { // Lägg till denna stil för errorContainer
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoListContainer: { // Lägg till denna stil för videoListContainer
    paddingBottom: 20,
  },
});

export default App;
