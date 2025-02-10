import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { spacing } from "../../theme";
import { VideoGridCardLoader } from "../loaders";
import { VideoGridCard } from "../VideoGridCard";
import { VideoGridProps } from "./VideoGrid";
import { TVActionCard, TVActionCardProps } from "../TVActionCard";

export interface VideoGridContentHandle {
  focusLastItem: () => void;
}

interface VideoGridContentProps extends Pick<VideoGridProps, "data" | "variant"> {
  isLoading?: boolean;
  backend?: string;
  tvActionCardProps: Omit<TVActionCardProps, "width"> & { isHidden?: boolean };
}

const MINIMUM_COLUMN_WIDTH = 277;

export const VideoGridContent = forwardRef<VideoGridContentHandle, VideoGridContentProps>(
  ({ isLoading, data = [], variant, backend, tvActionCardProps }, ref) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const lastItemRef = useRef<View>(null);
    const columnWidth = useMemo(() => {
      const numCols = Math.floor(containerWidth / MINIMUM_COLUMN_WIDTH) || 1;
      return (containerWidth - (numCols - 1) * spacing.xl) / numCols;
    }, [containerWidth]);

    useImperativeHandle(ref, () => ({
      focusLastItem: () => {
        lastItemRef.current?.requestTVFocus?.();
      },
    }));

    const isTVActionCardVisible = Platform.isTV && !isLoading && !tvActionCardProps.isHidden;

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
          ? [...Array(4)].map((_, index) => (
              <View
                key={index}
                style={Platform.select<ViewStyle>({
                  web: styles.loaderGridItemWeb,
                  native: { ...styles.loaderGridItemNonWeb, width: columnWidth },
                })}
              >
                <VideoGridCardLoader />
              </View>
            ))
          : data.map((video, index) => {
              const isLastItem = index === data.length - 1;
              return (
                <View
                  key={video.uuid}
                  style={Platform.select<ViewStyle>({
                    web: styles.gridItemWeb,
                    default: { ...styles.gridItemNonWeb, width: columnWidth },
                  })}
                >
                  <VideoGridCard
                    ref={isLastItem ? lastItemRef : undefined}
                    backend={variant === "history" && "backend" in video ? video.backend : backend}
                    video={video}
                  />
                </View>
              );
            })}
        {isTVActionCardVisible && <TVActionCard width={columnWidth} {...tvActionCardProps} />}
      </View>
    );
  },
);

VideoGridContent.displayName = "VideoGridContent";

const styles = StyleSheet.create({
  gridItemNonWeb: {
    alignSelf: "flex-start",
    height: "auto",
  },
  gridItemWeb: { flex: 1, width: "auto" },
  loaderGridItemNonWeb: {
    aspectRatio: 1.145,
    flexDirection: "row",
    flex: 0,
    justifyContent: "flex-start",
    maxHeight: "100%",
    maxWidth: "100%",
    width: "100%",
  },
  loaderGridItemWeb: { height: "100%", minHeight: 314 },
});
