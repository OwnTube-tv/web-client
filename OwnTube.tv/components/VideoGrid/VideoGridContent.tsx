import { Platform, StyleSheet, View } from "react-native";
import { spacing } from "../../theme";
import VideoGridCardLoader from "../loaders/VideoGridCardLoader";
import { VideoGridCard } from "../VideoGridCard";
import { VideoGridProps } from "./VideoGrid";
import { useMemo, useState } from "react";

interface VideoGridContentProps extends Pick<VideoGridProps, "data" | "variant"> {
  isLoading?: boolean;
  backend?: string;
}

const MINIMUM_COLUMN_WIDTH = 277;

export const VideoGridContent = ({ isLoading, data = [], variant, backend }: VideoGridContentProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const columnWidth = useMemo(() => {
    const numCols = Math.floor(containerWidth / MINIMUM_COLUMN_WIDTH) || 1;
    return (containerWidth - (numCols - 1) * spacing.xl) / numCols;
  }, [containerWidth]);

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
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
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
                // @ts-expect-error wrong typings on Platform.select and style prop
                style={Platform.select({
                  web: styles.gridItemWeb,
                  default: { ...styles.gridItemNonWeb, width: columnWidth },
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
    height: "auto",
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
