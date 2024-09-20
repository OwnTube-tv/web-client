import { VideoGridProps } from "./VideoGrid";
import { StyleSheet, View } from "react-native";
import { VideoListItem } from "../VideoListItem";
import { spacing } from "../../theme";
import { Loader } from "../Loader";

interface VideoListContentProps extends Pick<VideoGridProps, "data" | "variant"> {
  isLoading?: boolean;
  backend?: string;
}

export const VideoListContent = ({ isLoading, data = [], variant, backend }: VideoListContentProps) => {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {data.map((video) => (
        <VideoListItem
          key={video.uuid}
          video={video}
          backend={variant === "history" && "backend" in video ? video.backend : backend}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.xl, maxWidth: 900 },
});
