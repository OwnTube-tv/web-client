import { Platform, StyleSheet, View } from "react-native";
import { spacing } from "../../theme";
import VideoGridCardLoader from "../loaders/VideoGridCardLoader";
import { VideoGridCard } from "../VideoGridCard";
import { VideoGridProps } from "./VideoGrid";

interface VideoGridContentProps extends Pick<VideoGridProps, "data" | "variant"> {
  isLoading?: boolean;
  backend?: string;
}

export const VideoGridContent = ({ isLoading, data = [], variant, backend }: VideoGridContentProps) => {
  return (
    <View
      style={Platform.select({
        web: { $$css: true, _: "grid-container" },
        default: {
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.xl,
          alignItems: "flex-start",
        },
      })}
    >
      {isLoading
        ? [...Array(4)].map((_, index) => {
            return (
              <View
                key={index}
                style={Platform.select({
                  web: styles.gridItemWeb,
                  default: styles.loaderGridItemNonWeb,
                })}
              >
                <VideoGridCardLoader />
              </View>
            );
          })
        : data.map((video) => {
            return (
              <View
                key={video.uuid}
                style={Platform.select({
                  web: styles.gridItemWeb,
                  default: styles.gridItemNonWeb,
                })}
              >
                <VideoGridCard
                  backend={variant === "history" && "backend" in video ? video.backend : backend}
                  video={video}
                />
              </View>
            );
          })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridItemNonWeb: {
    alignSelf: "flex-start",
    flex: 1,
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    minWidth: "100%",
    width: "100%",
  },
  gridItemWeb: { flex: 1 },
  loaderGridItemNonWeb: {
    aspectRatio: 1.145,
    flexDirection: "row",
    flex: 0,
    justifyContent: "flex-start",
    maxHeight: "100%",
    maxWidth: "100%",
    minWidth: "100%",
    width: "100%",
  },
});
