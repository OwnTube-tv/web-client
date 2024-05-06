import { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import VideoService from "../lib/videoServices";
import { Video } from "../types";

import themeContext from "../theme/themeContext";

export interface VideoServiceState {
  videos: Video[];
  categories: string[];
  error: string | null;
}
const useVideoService = () => {
  const [state, setState] = useState<VideoServiceState>({
    videos: [],
    categories: [],
    error: null,
  });

  useEffect(() => {
    const videoService = new VideoService();

    const fetchVideos = async () => {
      try {
        videoService.loadVideosFromJson();
        const categoryLabels = videoService.getVideoCategoryLabels();
        const videosWithThumbnails = videoService.completeThumbnailUrls();
        setState({
          videos: videosWithThumbnails,
          categories: categoryLabels,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching videos:", (error as Error).message);
        setState((prev) => ({ ...prev, error: (error as Error).message }));
      }
    };

    fetchVideos();
  }, []);
  return state;
};

const VideoDataService: React.FC = () => {
  const { videos, categories, error } = useVideoService();
  const theme = useContext(themeContext);
  const textColor = {
    color: theme.color,
  };
  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  return (
    <View>
      {/* Display Category Labels */}
      {categories.map((category) => (
        <View key={category}>
          <Text style={textColor}>Category: {category}</Text>
          <View>
            {videos
              .filter((video) => video.category.label === category)
              .map((video) => (
                <View key={video.id}>
                  <Text style={textColor}>ID: {video.id}</Text>
                  <Text style={textColor}>Name: {video.name}</Text>
                  <Text style={textColor}>Category ID: {video.category.id}</Text>
                  <Text style={textColor}>Category Label: {video.category.label}</Text>
                  <Image source={{ uri: video.thumbnailUrl }} style={styles.image} />
                </View>
              ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 180,
    width: 200,
  },
});
export default VideoDataService;
