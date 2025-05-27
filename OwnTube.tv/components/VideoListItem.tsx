import { VideoThumbnail } from "./VideoThumbnail";
import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { format } from "date-fns";
import { useBreakpoints, useHoverState, ViewHistoryEntry } from "../hooks";
import { useTranslation } from "react-i18next";
import { Link, useRouter } from "expo-router";
import { ROUTES } from "../types";
import { spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { forwardRef, useMemo, useState } from "react";
import { ChannelLink } from "./ChannelLink";
import { GetVideosVideo } from "../api/models";
import { Button } from "./shared";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";
import { FocusGuide } from "./helpers";
import { VideoItemFooter } from "./VideoItemFooter";

interface VideoListItemProps extends Partial<Pick<ViewHistoryEntry, "lastViewedAt" | "timestamp">> {
  video: GetVideosVideo;
  handleDeleteFromHistory?: () => void;
  backend?: string;
}

export const VideoListItem = forwardRef<View, VideoListItemProps>(
  ({ video, handleDeleteFromHistory, backend, timestamp, lastViewedAt }, ref) => {
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { isHovered, toggleHovered } = useHoverState();
    const { isDesktop } = useBreakpoints();
    const [focused, setFocused] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const videoHref = useMemo(() => {
      return {
        pathname: `/${ROUTES.VIDEO}`,
        params: { id: video.uuid, backend, timestamp },
      };
    }, [video, backend, timestamp]);

    const deleteBtn = useMemo(() => {
      if (!handleDeleteFromHistory) {
        return null;
      }

      return <Button onPress={handleDeleteFromHistory} icon="Trash" style={{ height: 48 }} />;
    }, [handleDeleteFromHistory, colors]);

    const focusGuideDimensions = useMemo(() => {
      return {
        width: containerWidth,
        height: (containerWidth / 16) * 9,
      };
    }, [containerWidth]);

    return (
      <View style={[styles.container, { gap: isDesktop ? spacing.xl : spacing.md }]}>
        <Link href={videoHref} style={styles.thumbLinkWrapper} asChild>
          <Pressable
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onHoverIn={toggleHovered}
            onHoverOut={toggleHovered}
            style={{
              height: focusGuideDimensions.height,
              width: "100%",
              borderRadius: 10,
            }}
            onPress={() => router.navigate(videoHref)}
            onLayout={({ nativeEvent }) => {
              setContainerWidth(nativeEvent.layout.width);
            }}
          >
            {focused && <FocusGuide height={focusGuideDimensions.height} width={focusGuideDimensions.width} />}
            <VideoThumbnail
              imageDimensions={focusGuideDimensions}
              video={video}
              backend={backend}
              key={video.uuid}
              timestamp={timestamp}
            />
          </Pressable>
        </Link>
        <View style={styles.infoContainer}>
          <TVFocusGuideHelper focusable={false} style={styles.textContainer}>
            <Link asChild href={videoHref}>
              <Pressable focusable={false} isTVSelectable={false} onHoverOut={toggleHovered} onHoverIn={toggleHovered}>
                <Typography
                  style={{ textDecorationLine: isHovered ? "underline" : undefined, maxWidth: "100%" }}
                  fontSize={isDesktop ? "sizeLg" : "sizeSm"}
                  fontWeight="SemiBold"
                  color={colors.theme900}
                  numberOfLines={4}
                >
                  {video.name}
                </Typography>
              </Pressable>
            </Link>
            <ChannelLink
              href={{
                pathname: ROUTES.CHANNEL,
                params: { backend: video.channel?.host, channel: video.channel?.name },
              }}
              sourceLink={video.channel?.url}
              text={video.channel?.displayName}
            />
            {lastViewedAt ? (
              <Typography
                fontWeight="Medium"
                fontSize={isDesktop ? "sizeSm" : "sizeXS"}
                color={colors.themeDesaturated500}
              >
                {t("lastWatched", { lastWatched: format(lastViewedAt, "yyyy-MM-dd HH:mm") })}
              </Typography>
            ) : (
              <VideoItemFooter video={video} />
            )}
          </TVFocusGuideHelper>
          {lastViewedAt && deleteBtn}
        </View>
      </View>
    );
  },
);

VideoListItem.displayName = "VideoListItem";

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
    width: "100%",
  },
  infoContainer: { flexDirection: "row", flex: 1, justifyContent: "space-between", maxWidth: "63%" },
  textContainer: {
    flex: 1,
    gap: spacing.sm,
    height: "100%",
  },
  thumbLinkWrapper: { maxWidth: "37%" },
});
