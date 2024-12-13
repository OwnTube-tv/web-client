import { VideoGridProps } from "./VideoGrid";
import { StyleSheet, View } from "react-native";
import { VideoListItem } from "../VideoListItem";
import { spacing } from "../../theme";
import { Loader } from "../Loader";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface VideoListContentHandle {
  focusLastItem: () => void;
}

interface VideoListContentProps extends Pick<VideoGridProps, "data" | "variant"> {
  isLoading?: boolean;
  backend?: string;
}

export const VideoListContent = forwardRef<VideoListContentHandle, VideoListContentProps>(
  ({ isLoading, data = [], variant, backend }, ref) => {
    const lastItemRef = useRef<View>(null);
    useImperativeHandle(ref, () => ({
      focusLastItem: () => {
        lastItemRef.current?.requestTVFocus?.();
      },
    }));

    if (isLoading) {
      return <Loader />;
    }

    return (
      <View style={styles.container}>
        {data.map((video, index) => (
          <VideoListItem
            ref={index === data.length - 1 ? lastItemRef : undefined}
            key={video.uuid}
            video={video}
            backend={variant === "history" && "backend" in video ? video.backend : backend}
          />
        ))}
      </View>
    );
  },
);

VideoListContent.displayName = "VideoListContent";

const styles = StyleSheet.create({
  container: { gap: spacing.xl, maxWidth: 900 },
});
