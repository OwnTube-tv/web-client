import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

interface Video {
  id: number;
  name: string;
  category: { id: number | null; label: string };
  thumbnailUrl?: string;
}

interface VideoThumbnailProps {
  video: Video;
}

const COLOR_DARK_GRAY = "#2C2C2C";
const COLOR_WHITE = "#FFFFFF";
const COLOR_LIGHT_GRAY = "#CCCCCC";

const VideoThumbnailComponent: React.FC<VideoThumbnailProps> = ({ video }) => {
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth * 0.25;
  const imageHeight = imageWidth * (9 / 16);

  const imageUrl = video.thumbnailUrl || "https://peertube2.cpy.re/default-thumbnail.jpg";

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
  textContainer: {
    padding: 10,
  },
  videoCategory: {
    color: COLOR_LIGHT_GRAY,
    fontSize: 10,
  },
  videoImage: {
    borderRadius: 2,
    width: "80%",
  },
  videoThumbnailContainer: {
    alignItems: "center",
    backgroundColor: COLOR_DARK_GRAY,
    borderRadius: 3,
    marginBottom: 18,
    overflow: "hidden",
    width: "80%",
  },
  videoTitle: {
    color: COLOR_WHITE,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default VideoThumbnailComponent;
