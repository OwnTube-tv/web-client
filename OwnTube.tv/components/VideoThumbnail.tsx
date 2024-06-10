import { View, Image, StyleSheet } from "react-native";
import { getThumbnailDimensions } from "../utils";
import { useColorSchemeContext } from "../contexts";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { GetVideosVideo } from "../api/peertubeVideosApi";
import { ROUTES } from "../types";

interface VideoThumbnailProps {
  video: GetVideosVideo;
}

const defaultImagePaths = {
  dark: require("./../assets/logoDark-400x400.png"),
  light: require("./../assets/Logo400x400.png"),
};

export const VideoThumbnail: FC<VideoThumbnailProps> = ({ video }) => {
  const { scheme } = useColorSchemeContext();
  const { backend } = useLocalSearchParams();

  const imageSource = video.thumbnailPath ? { uri: video.thumbnailPath } : defaultImagePaths[scheme ?? "dark"];
  const { width, height } = getThumbnailDimensions();
  const { colors } = useTheme();

  if (!backend) {
    return null;
  }

  return (
    <Link
      style={[styles.videoThumbnailContainer, { height, width }, { backgroundColor: colors.card }]}
      href={{ pathname: `/${ROUTES.VIDEO}`, params: { id: video.uuid, backend } }}
    >
      <Image source={imageSource} style={styles.videoImage} />
      <View style={styles.textContainer}>
        <Typography style={styles.videoTitle}>{video.name}</Typography>
      </View>
    </Link>
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
