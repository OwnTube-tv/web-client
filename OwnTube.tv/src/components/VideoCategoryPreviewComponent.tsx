import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import VideoThumbnailComponent from './VideoThumbnailComponent';
import { Video, CategoryLabel } from './VideoTypes';

interface VideoCategoryPreviewProps {
  category: CategoryLabel;
  videos: Video[];
}

const VideoCategoryPreviewComponent: React.FC<VideoCategoryPreviewProps> = ({ category, videos }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  // Funktioner för att hantera bläddring
  const scrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.videoCategoryPreviewContainer}>
      <Text style={styles.categoryTitle}>{category.label}</Text>
      <View style={styles.scrollContainer}>
        <TouchableOpacity onPress={scrollLeft} style={styles.scrollButton}>
          <Text style={styles.buttonText}>{'<'}</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          contentContainerStyle={styles.videoThumbnailsContainer}
          style={{ width: screenWidth - 0 }}>
          {videos.map((video) => (
            <VideoThumbnailComponent key={video.id} video={video} />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={scrollRight} style={styles.scrollButton}>
          <Text style={styles.buttonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoCategoryPreviewContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 80,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#FFF',
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoThumbnailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollButton: {
    padding: 60,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 40,
    color: '#333',
  },
});

export default VideoCategoryPreviewComponent;
