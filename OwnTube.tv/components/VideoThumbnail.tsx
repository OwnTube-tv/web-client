import { View, Image, StyleSheet } from "react-native";
import { getThumbnailDimensions } from "../utils";
import { useColorSchemeContext } from "../contexts";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { Link } from "expo-router";
import { ROUTES } from "../types";
import { ViewHistoryEntry } from "../hooks";
import { GetVideosVideo } from "../api/models";

interface VideoThumbnailProps {
  video: GetVideosVideo & Partial<ViewHistoryEntry>;
  backend?: string;
  timestamp?: number;
}

const defaultImagePaths = {
  dark: require("./../assets/logoDark-400x400.png"),
  light: require("./../assets/Logo400x400.png"),
};

export const VideoThumbnail: FC<VideoThumbnailProps> = ({ video, backend, timestamp }) => {
  const { scheme } = useColorSchemeContext();

  const imageSource = video.thumbnailPath ? { uri: video.thumbnailPath } : defaultImagePaths[scheme ?? "dark"];
  const { width, height } = getThumbnailDimensions();
  const { colors } = useTheme();

  const percentageWatched = timestamp ? (timestamp / video.duration) * 100 : 0;

  if (!backend) {
    return null;
  }

  return (
    <Link
      style={[styles.videoThumbnailContainer, { height, width }, { backgroundColor: colors.card }]}
      href={{ pathname: `/${ROUTES.VIDEO}`, params: { id: video.uuid, backend, timestamp } }}
    >
      <Image source={imageSource} style={styles.videoImage} />
      <View style={styles.textContainer}>
        {!!percentageWatched && percentageWatched > 0 && (
          <View style={styles.progressContainer}>
            <View style={{ backgroundColor: colors.primary, width: `${percentageWatched}%`, height: "100%" }} />
          </View>
        )}
        <Typography style={styles.videoTitle}>{video.name}</Typography>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flex: 1,
    height: 4,
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  textContainer: {
    alignItems: "center",
    padding: 10,
    width: "100%",
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
