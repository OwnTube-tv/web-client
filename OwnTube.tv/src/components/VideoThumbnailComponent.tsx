import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Video } from './VideoTypes';

interface VideoThumbnailProps {
  video: Video;
}

const VideoThumbnailComponent: React.FC<VideoThumbnailProps> = ({ video }) => {
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.25; 
  const imageHeight = imageWidth * (9 / 16); 

  const imageUrl = video.thumbnailPath.startsWith('http') ? video.thumbnailPath : `https://peertube2.cpy.re${video.thumbnailPath}`;

  return (
    <View style={[styles.videoThumbnailContainer, { width: imageWidth }]}>
      <Image source={{ uri: imageUrl }} style={[styles.videoImage, { width: imageWidth, height: imageHeight }]} />
      <View style={styles.textContainer}>
        <Text style={styles.videoTitle}>{video.name}</Text>
        <Text style={styles.videoCategory}>{video.category.label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoThumbnailContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoImage: {
    borderRadius: 4,
  },
  textContainer: {
    padding: 10, 
  },
  videoTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 50, 
    marginBottom: 5, 
  },
  videoCategory: {
    color: '#CCCCCC',
    fontSize: 14, 
  },
});

export default VideoThumbnailComponent;
