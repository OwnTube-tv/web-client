import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import VideoThumbnailComponent from './VideoThumbnailComponent';
import useVideoService from '../components/Services/useVideoService';

// Definiera färgkonstanter
const COLOR_DARK = '#333';
const COLOR_LIGHT_GRAY = '#CCC';
const COLOR_GRAY = '#ddd';
const COLOR_WHITE = '#FFF';

const VideosByCategoryComponent: React.FC = () => {
  const { videos, categories, error } = useVideoService();
  const scrollRefs = useRef<Array<ScrollView | null>>([]);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(Dimensions.get('window').width);
    };

    Dimensions.addEventListener('change', updateWindowWidth);

    return () => {
    };
  }, []);

  if (error) {
    return <View style={styles.errorContainer}><Text>Error: {error}</Text></View>;
  }

  const scrollLeft = (index: number) => {
    scrollRefs.current[index]?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = (index: number) => {
    scrollRefs.current[index]?.scrollToEnd({ animated: true });
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.mainPageContainer}>
      {categories.map((categoryLabel, index) => (
        <View key={index} style={styles.videoCategoryPreviewContainer}>
          <Text style={styles.categoryTitle}>{categoryLabel}</Text>
          <View style={styles.horizontalScrollContainer}>
            <TouchableOpacity onPress={() => scrollLeft(index)} style={styles.scrollButton}>
              <Text style={styles.buttonText}>{'<'}</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={el => (scrollRefs.current[index] = el)}
              contentContainerStyle={{ ...styles.videoThumbnailsContainer, width: windowWidth }}
              style={styles.scrollViewStyle}> 
              {videos.filter(video => video.category.label === categoryLabel).map((video) => (
                <VideoThumbnailComponent key={video.id} video={video} />
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => scrollRight(index)} style={styles.scrollButton}>
              <Text style={styles.buttonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
          {index < categories.length - 1 && <View style={styles.categorySeparator} />}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: COLOR_DARK,
    fontSize: 15,
  },
  categorySeparator: {
    alignSelf: 'center',
    backgroundColor: COLOR_LIGHT_GRAY,
    height: 1,
    marginVertical: 20,
    width: '90%',
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
