import { DimensionValue, Platform, Pressable, StyleSheet, View } from "react-native";
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
import { useMemo, useState } from "react";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";

interface VideoGridCardProps {
  video: GetVideosVideo;
  backend?: string;
}

export const VideoGridCard = ({ video, backend }: VideoGridCardProps) => {
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
    return [
      styles.linkWrapper,
      ...(Platform.isTV
        ? [
            {
              padding: focused ? 2 : 4,
              borderWidth: focused ? 2 : 0,
              borderColor: colors.theme950,
              height: "100%" as DimensionValue,
              width: "100%" as DimensionValue,
              borderRadius: 10,
            },
          ]
        : [{}]),
    ];
  }, [colors, focused]);

  const handleTvNavigateToVideo = () => {
    router.navigate(linkHref);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onFocus={Platform.isTV ? () => setFocused(true) : null}
        onBlur={Platform.isTV ? () => setFocused(false) : null}
        style={styles.pressableContainer}
        onPress={Platform.isTV ? handleTvNavigateToVideo : null}
        onHoverIn={toggleHovered}
        onHoverOut={toggleHovered}
      >
        <Link
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width);
          }}
          href={linkHref}
          asChild
          style={thumbnailLinkStyles}
        >
          <Pressable>
            <VideoThumbnail
              imageDimensions={{ width: containerWidth - 8, height: containerWidth * (9 / 16) - 8 }}
              video={video}
              timestamp={timestamp}
              backend={backend}
            />
          </Pressable>
        </Link>
        <TVFocusGuideHelper focusable={false} style={styles.textContainer}>
          <Link href={{ pathname: ROUTES.VIDEO, params: { id: video.uuid, backend } }}>
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
          href={{ pathname: `/${ROUTES.CHANNEL}`, params: { channel: video.channel?.name, backend } }}
          text={video.channel?.displayName}
        />
        <Typography fontSize="sizeXS" fontWeight="Medium" color={colors.themeDesaturated500}>
          {`${video.publishedAt ? formatDistanceToNow(video.publishedAt, { addSuffix: true, locale: LANGUAGE_OPTIONS.find(({ value }) => value === i18n.language)?.dateLocale }) : ""} • ${t("views", { count: video.views })}`}
        </Typography>
      </TVFocusGuideHelper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    gap: spacing.sm,
    height: "auto",
    maxWidth: "100%",
  },
  linkWrapper: { flex: 1 },
  pressableContainer: { gap: spacing.md },
  restInfoContainer: { gap: spacing.xs, paddingHorizontal: spacing.sm },
  textContainer: { gap: spacing.sm, paddingHorizontal: spacing.sm },
});
