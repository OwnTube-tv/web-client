/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-unused-styles */
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import VideoThumbnailComponent from './VideoThumbnailComponent';
import { Video, CategoryLabel } from './VideoTypes';  // Ensure this import path is correct

// Define color constants
const COLOR_DARK = '#333';
const COLOR_LIGHT_GRAY = '#CCC';
const COLOR_GRAY = '#ddd';
const COLOR_WHITE = '#FFF';

interface VideosByCategoryComponentProps {
  category: CategoryLabel;  
  videos: Video[];
}

const VideosByCategoryComponent: React.FC<VideosByCategoryComponentProps> = ({ category, videos }) => {
  const scrollRefs = useRef<Array<ScrollView | null>>([]);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });

    return () => subscription.remove();  // Proper cleanup on unmount
  }, []);

  return (
    <View style={styles.videoCategoryPreviewContainer}>
      <Text style={styles.categoryTitle}>{category.label}</Text>
      <View style={styles.horizontalScrollContainer}>
        <TouchableOpacity onPress={() => scrollRefs.current[0]?.scrollTo({ x: 0, animated: true })} style={styles.scrollButton}>
          <Text style={styles.buttonText}>{'<'}</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={ref => scrollRefs.current[0] = ref}
          contentContainerStyle={[styles.videoThumbnailsContainer, { width: windowWidth }]}
          style={styles.scrollViewStyle}>
          {videos.filter(video => video.category.label === category.label).map(video => (
            <VideoThumbnailComponent key={video.id} video={video} />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => scrollRefs.current[0]?.scrollToEnd({ animated: true })} style={styles.scrollButton}>
          <Text style={styles.buttonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: COLOR_DARK,
    fontSize: 15,
  },
  categoryTitle: {
    color: COLOR_WHITE,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  horizontalScrollContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  mainPageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    paddingTop: 20,
  },
  scrollButton: {
    backgroundColor: COLOR_GRAY,
    borderRadius: 10,
    padding: 10,
  },
  scrollContainer: {
    backgroundColor: COLOR_DARK,
    flex: 3,
  },
  scrollViewStyle: {
    flexGrow: 0,
  },
  videoCategoryPreviewContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '80%',
  },
  videoThumbnailsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default VideosByCategoryComponent;
