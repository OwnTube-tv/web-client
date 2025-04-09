import { Platform, Pressable, StyleSheet, View } from "react-native";
import { VideoThumbnail } from "./VideoThumbnail";
import { GetVideosVideo } from "../api/models";
import { Link, useRouter } from "expo-router";
import { ROUTES } from "../types";
import { Typography } from "./Typography";
import { spacing } from "../theme";
import { useBreakpoints, useHoverState, useViewHistory } from "../hooks";
import { useTheme } from "@react-navigation/native";
import { ChannelLink } from "./ChannelLink";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS } from "../i18n";
import { forwardRef, useMemo, useState } from "react";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";
import { FocusGuide } from "./helpers";

interface VideoGridCardProps {
  video: GetVideosVideo;
  backend?: string;
}

export const VideoGridCard = forwardRef<View, VideoGridCardProps>(({ video, backend }, ref) => {
  const { isDesktop } = useBreakpoints();
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const { t, i18n } = useTranslation();
  const { getViewHistoryEntryByUuid } = useViewHistory({ enabled: false });
  const { timestamp } = getViewHistoryEntryByUuid(video.uuid) || {};
  const [containerWidth, setContainerWidth] = useState(0);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const linkHref = useMemo(() => {
    return { pathname: `/${ROUTES.VIDEO}`, params: { id: video.uuid, backend, timestamp } };
  }, [video, backend, timestamp]);

  const thumbnailLinkStyles = useMemo(() => {
    return [styles.linkWrapper, ...(Platform.isTV ? [styles.linkWrapperTV] : [{}])];
  }, []);

  const handleTvNavigateToVideo = () => {
    router.navigate(linkHref);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onFocus={Platform.isTV ? () => setFocused(true) : null}
        onBlur={Platform.isTV ? () => setFocused(false) : null}
        style={styles.pressableContainer}
        onPress={Platform.isTV || Platform.OS === "web" ? handleTvNavigateToVideo : null}
        onHoverIn={toggleHovered}
        onHoverOut={toggleHovered}
        ref={ref}
      >
        <Link
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width);
          }}
          href={linkHref}
          asChild
          style={thumbnailLinkStyles}
        >
          <Pressable tabIndex={-1} onHoverIn={toggleHovered} onHoverOut={toggleHovered}>
            {focused && <FocusGuide height={containerWidth * (9 / 16)} width={containerWidth} />}
            <VideoThumbnail
              imageDimensions={{ width: containerWidth, height: containerWidth * (9 / 16) }}
              video={video}
              timestamp={timestamp}
              backend={backend}
            />
          </Pressable>
        </Link>
        <TVFocusGuideHelper focusable={false} style={styles.textContainer}>
          {/* @ts-expect-error tabIndex is passed to anchor tag but is not officially supported by Expo Router */}
          <Link tabIndex={-1} href={{ pathname: ROUTES.VIDEO, params: { id: video.uuid, backend } }}>
            <Typography
              fontWeight="Medium"
              color={colors.theme900}
              fontSize={isDesktop ? "sizeMd" : "sizeSm"}
              numberOfLines={4}
              style={{ textDecorationLine: isHovered ? "underline" : undefined }}
            >
              {video.name}
            </Typography>
          </Link>
        </TVFocusGuideHelper>
      </Pressable>
      <TVFocusGuideHelper focusable={false} style={styles.restInfoContainer}>
        <ChannelLink
          href={{
            pathname: `/${ROUTES.CHANNEL}`,
            params: { channel: video.channel?.name, backend: video.channel?.host },
          }}
          text={video.channel?.displayName}
          sourceLink={video.channel?.url}
        />
        <Typography fontSize="sizeXS" fontWeight="Medium" color={colors.themeDesaturated500}>
          {`${video.publishedAt ? formatDistanceToNow(video.publishedAt, { addSuffix: true, locale: LANGUAGE_OPTIONS.find(({ value }) => value === i18n.language)?.dateLocale }) : ""} • ${t("views", { count: video.views })}`}
        </Typography>
      </TVFocusGuideHelper>
    </View>
  );
});

VideoGridCard.displayName = "VideoGridCard";

const styles = StyleSheet.create({
  container: {
    flex: 0,
    gap: spacing.sm,
    height: "auto",
    maxWidth: "100%",
  },
  linkWrapper: { flex: 1 },
  linkWrapperTV: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
  pressableContainer: { gap: spacing.md },
  restInfoContainer: { gap: spacing.xs, paddingHorizontal: spacing.sm },
  textContainer: { gap: spacing.sm, paddingHorizontal: spacing.sm },
});
