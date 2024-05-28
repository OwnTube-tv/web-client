import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getThumbnailDimensions } from "../utils";
import { useAppConfigContext } from "../contexts";
import { ROUTES, Video } from "../types";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { useRouter } from "expo-router";

interface VideoThumbnailProps {
  video: Video;
}

export const VideoThumbnail: FC<VideoThumbnailProps> = ({ video }) => {
  const { source } = useAppConfigContext();
  const router = useRouter();

  const imageUrl = video.thumbnailUrl || `${source}/default-thumbnail.jpg`;
  const { width, height } = getThumbnailDimensions();
  const { colors } = useTheme();

  const goToVideo = () => {
    router.navigate({
      pathname: `/${ROUTES.VIDEO}`,
      params: { id: "8803fdd3-4ac9-49d0-8dcf-ff1586e9e458" },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.videoThumbnailContainer, { height, width }, { backgroundColor: colors.card }]}
      onPress={goToVideo}
    >
      <Image source={{ uri: imageUrl }} style={styles.videoImage} />
      <View style={styles.textContainer}>
        <Typography style={styles.videoTitle}>{video.name}</Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    alignItems: "center",
    padding: 10,
  },
  videoImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: "85%",
    resizeMode: "cover",
    width: "100%",
  },
  videoThumbnailContainer: {
    alignItems: "center",
    borderRadius: 10,
    elevation: 4,
    flexDirection: "column",
    marginBottom: 20,
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  videoTitle: {
    fontSize: 20,
  },
});
