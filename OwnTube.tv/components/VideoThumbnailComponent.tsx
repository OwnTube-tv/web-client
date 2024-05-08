import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { theme } from "../colors";

interface Video {
  id: number;
  name: string;
  category: { id: number | null; label: string };
  thumbnailUrl?: string;
}

interface VideoThumbnailProps {
  video: Video;
}

const VideoThumbnailComponent: React.FC<VideoThumbnailProps> = ({ video }) => {
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth * 0.25;
  const imageHeight = imageWidth * 0.6;

  const imageUrl = video.thumbnailUrl || "https://peertube2.cpy.re/default-thumbnail.jpg";

  return (
    <TouchableOpacity
      style={[styles.videoThumbnailContainer, { width: imageWidth, height: imageHeight + 50 }]}
      onPress={() => console.log("Video Pressed", video.name)}
    >
      <Image source={{ uri: imageUrl }} style={styles.videoImage} />
      <View style={styles.textContainer}>
        <Text style={styles.videoTitle}>{video.name}</Text>
        <Text style={styles.videoCategory}>{video.category.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.darkGray,
    padding: 10,
  },
  videoCategory: {
    color: theme.colors.lightGray,
    fontSize: 12,
    marginTop: 5, // Adds space between the title and the category
  },
  videoImage: {
    borderTopLeftRadius: 10, // Rounded corners for the top of the image
    borderTopRightRadius: 10,
    width: "100%",
    height: "85%",
    resizeMode: "cover",
  },
  videoThumbnailContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.darkGray,
    borderRadius: 10,
    elevation: 4,
    flexDirection: "column",
    marginBottom: 20,
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  videoTitle: {
    color: theme.colors.white,
    fontSize: 20,
  },
});

export default VideoThumbnailComponent;
