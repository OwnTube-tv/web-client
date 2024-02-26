import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Video } from './VideoTypes';

interface VideoThumbnailProps {
  video: Video;
}

const VideoThumbnailComponent: React.FC<VideoThumbnailProps> = ({ video }) => {

  const imageUrl = video.thumbnailPath.startsWith('http')
    ? video.thumbnailPath
    : `https://peertube2.cpy.re${video.thumbnailPath}`;

  return (
    <View style={styles.videoThumbnailContainer}>
      <Image source={{ uri: imageUrl }} style={styles.videoImage} />
      <Text style={styles.videoTitle}>{video.name}</Text>
      <Text style={styles.videoCategory}>{video.category.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  videoThumbnailContainer: {
    width: 200,
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#2C2C2C', 
    borderRadius: 8, 
    overflow: 'hidden', 
    marginBottom: 20, 
  },
  videoImage: {
    width: '100%', 
    height: 200, 
    borderRadius: 4, 
  },
  videoTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF', 
    marginTop: 8, 
  },
  videoCategory: {
    color: '#CCCCCC', 
    marginBottom: 8, 
  },
});

export default VideoThumbnailComponent;
