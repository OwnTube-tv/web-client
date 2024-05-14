import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getThumbnailDimensions } from "../utils";
import { useAppConfigContext } from "../contexts";
import type { Video } from "../types";

interface VideoThumbnailProps {
  video: Video;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video }) => {
  const { source } = useAppConfigContext();

  const imageUrl = video.thumbnailUrl || `${source}/default-thumbnail.jpg`;
  const { width, height } = getThumbnailDimensions();

  return (
    <TouchableOpacity
      style={[styles.videoThumbnailContainer, { height, width }]}
      onPress={() => console.log("Video Pressed", video.name)}
    >
      <Image source={{ uri: imageUrl }} style={styles.videoImage} />
      <View style={styles.textContainer}>
        <Text style={styles.videoTitle}>{video.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    alignItems: "center",
    // backgroundColor: theme.colors.darkGray,
    padding: 10,
  },
  videoImage: {
    borderTopLeftRadius: 10, // Rounded corners for the top of the image
    borderTopRightRadius: 10,
    height: "85%",
    resizeMode: "cover",
    width: "100%",
  },
  videoThumbnailContainer: {
    alignItems: "center",
    // backgroundColor: theme.colors.darkGray,
    borderRadius: 10,
    elevation: 4,
    flexDirection: "column",
    marginBottom: 20,
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  videoTitle: {
    // color: theme.colors.white,
    fontSize: 20,
  },
});
