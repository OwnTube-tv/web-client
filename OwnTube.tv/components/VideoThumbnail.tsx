import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getThumbnailDimensions } from "../utils";
import { useAppConfigContext } from "../contexts";
import { ROUTES, Video } from "../types";
import { Typography } from "./Typography";
import { useNavigation, useTheme } from "@react-navigation/native";
import { FC } from "react";
import { RootStackParams } from "../navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface VideoThumbnailProps {
  video: Video;
}

export const VideoThumbnail: FC<VideoThumbnailProps> = ({ video }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const { source } = useAppConfigContext();

  const imageUrl = video.thumbnailUrl || `${source}/default-thumbnail.jpg`;
  const { width, height } = getThumbnailDimensions();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.videoThumbnailContainer, { height, width }, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate(ROUTES.VIDEO)}
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
    borderTopLeftRadius: 10, // Rounded corners for the top of the image
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
