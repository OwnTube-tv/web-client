import { VideoThumbnail } from "./VideoThumbnail";
import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { format, formatDistanceToNow } from "date-fns";
import { useBreakpoints, useHoverState, ViewHistoryEntry } from "../hooks";
import { useTranslation } from "react-i18next";
import { Link, useRouter } from "expo-router";
import { ROUTES } from "../types";
import { spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { forwardRef, useMemo } from "react";
import { ChannelLink } from "./ChannelLink";
import { LANGUAGE_OPTIONS } from "../i18n";
import { GetVideosVideo } from "../api/models";
import { Button } from "./shared";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";

interface VideoListItemProps extends Partial<Pick<ViewHistoryEntry, "lastViewedAt" | "timestamp">> {
  video: GetVideosVideo;
  handleDeleteFromHistory?: () => void;
  backend?: string;
}

export const VideoListItem = forwardRef<View, VideoListItemProps>(
  ({ video, handleDeleteFromHistory, backend, timestamp, lastViewedAt }, ref) => {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const { isHovered, toggleHovered } = useHoverState();
    const { isDesktop } = useBreakpoints();
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

    return (
      <View style={[styles.container, { gap: isDesktop ? spacing.xl : spacing.md }]}>
        <Link href={videoHref} style={styles.thumbLinkWrapper}>
          <Pressable
            ref={ref}
            style={({ focused }) => ({
              padding: focused ? 2 : 4,
              borderWidth: focused ? 2 : 0,
              borderColor: colors.theme950,
              height: "100%",
              width: "100%",
              borderRadius: 10,
            })}
            onPress={() => router.navigate(videoHref)}
          >
            <VideoThumbnail
              imageDimensions={{ width: isDesktop ? 328 : 128, height: isDesktop ? 102 : 72 }}
              video={video}
              backend={backend}
              key={video.uuid}
              timestamp={timestamp}
            />
          </Pressable>
        </Link>
        <View style={styles.infoContainer}>
          <TVFocusGuideHelper focusable={false} style={styles.textContainer}>
            {lastViewedAt && (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Typography
                  fontWeight="Medium"
                  fontSize={isDesktop ? "sizeSm" : "sizeXS"}
                  color={colors.themeDesaturated500}
                  style={{ maxWidth: isDesktop ? null : 150 }}
                >
                  {t("lastWatched", { lastWatched: format(lastViewedAt, "yyyy-MM-dd HH:mm") })}
                </Typography>
                {!isDesktop && deleteBtn}
              </View>
            )}
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
              href={{ pathname: ROUTES.CHANNEL, params: { backend: backend, channel: video.channel?.name } }}
              text={video.channel?.displayName}
            />
            <Typography fontSize="sizeXS" fontWeight="Medium" color={colors.themeDesaturated500}>
              {`${video.publishedAt ? formatDistanceToNow(video.publishedAt, { addSuffix: true, locale: LANGUAGE_OPTIONS.find(({ value }) => value === i18n.language)?.dateLocale }) : ""} • ${t("views", { count: video.views })}`}
            </Typography>
          </TVFocusGuideHelper>
          {isDesktop && deleteBtn}
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
  infoContainer: { flexDirection: "row", flex: 1, justifyContent: "space-between" },
  textContainer: {
    flex: 1,
    gap: spacing.sm,
    height: "100%",
  },
  thumbLinkWrapper: { maxWidth: 328, width: "37%" },
});
