import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import VideoThumbnailComponent from './VideoThumbnailComponent';
import { Video } from './VideoTypes';


interface VideoCategoryPreviewProps {
  videos: Video[];
}


const VideoCategoryPreviewComponent: React.FC<VideoCategoryPreviewProps> = ({ videos }) => {
  return (
    <View style={styles.videoCategoryPreviewContainer}>
      <Text style={styles.categoryTitle}>Category Preview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.videoThumbnailsContainer}>
        {videos.map((video, index) => (
          <VideoThumbnailComponent key={index} video={video} />
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  videoCategoryPreviewContainer: {
    width: '100%',
    paddingVertical: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoThumbnailsContainer: {
    flexDirection: 'row',
  },
});


export default VideoCategoryPreviewComponent;