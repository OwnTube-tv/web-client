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
  const imageHeight = imageWidth * 0.60; 

  const imageUrl = video.thumbnailUrl || "https://peertube2.cpy.re/default-thumbnail.jpg";

  return (
    <TouchableOpacity style={[styles.videoThumbnailContainer, { width: imageWidth, height: imageHeight + 50 }]} onPress={() => console.log("Video Pressed", video.name)}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.videoImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.videoTitle}>{video.name}</Text>
        <Text style={styles.videoCategory}>{video.category.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    padding: 10,
    backgroundColor: theme.colors.darkGray,
    alignItems: 'center', 
  },
  videoCategory: {
    fontSize: 12, 
    color: theme.colors.lightGray,
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
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.colors.darkGray,
    marginBottom: 20,
    borderRadius: 10,
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4,
  },
  videoTitle: {
    fontSize: 20,
    color: theme.colors.white,
  },
});

export default VideoThumbnailComponent;
