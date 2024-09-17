import { VideoThumbnail } from "./VideoThumbnail";
import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { format, formatDistanceToNow } from "date-fns";
import { useBreakpoints, useHoverState, ViewHistoryEntry } from "../hooks";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { ROUTES } from "../types";
import { spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { ChannelLink } from "./ChannelLink";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { LANGUAGE_OPTIONS } from "../i18n";

interface ViewHistoryListItemProps {
  video: ViewHistoryEntry;
  handleDeleteFromHistory: () => void;
}

export const ViewHistoryListItem = ({ video, handleDeleteFromHistory }: ViewHistoryListItemProps) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const { isDesktop } = useBreakpoints();
  const videoHref = useMemo(() => {
    return {
      pathname: `/${ROUTES.VIDEO}`,
      params: { id: video.uuid, backend: video.backend, timestamp: video.timestamp },
    };
  }, [video]);

  const deleteBtn = useMemo(() => {
    return (
      <Pressable onPress={handleDeleteFromHistory} style={{ padding: 6 }}>
        <IcoMoonIcon color={colors.theme950} name="Trash" size={24} />
      </Pressable>
    );
  }, [handleDeleteFromHistory, colors]);

  return (
    <View style={[styles.container, { gap: isDesktop ? spacing.xl : spacing.md }]}>
      <Link href={videoHref} style={styles.thumbLinkWrapper}>
        <VideoThumbnail
          imageDimensions={{ width: isDesktop ? 328 : 128, height: isDesktop ? 102 : 72 }}
          video={video}
          backend={video.backend}
          key={video.uuid}
          timestamp={video.timestamp}
        />
      </Link>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          {video.lastViewedAt && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Typography
                fontWeight="Medium"
                fontSize={isDesktop ? "sizeSm" : "sizeXS"}
                color={colors.themeDesaturated500}
                style={{ maxWidth: isDesktop ? null : 150 }}
              >
                {t("lastWatched", { lastWatched: format(video.lastViewedAt, "yyyy-MM-dd HH:mm") })}
              </Typography>
              {!isDesktop && deleteBtn}
            </View>
          )}
          <Link asChild href={videoHref}>
            <Pressable onHoverOut={toggleHovered} onHoverIn={toggleHovered}>
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
            href={{ pathname: ROUTES.CHANNEL, params: { backend: video.backend, channel: video.channel?.name } }}
            text={video.channel?.displayName}
          />
          <Typography fontSize="sizeXS" fontWeight="Medium" color={colors.themeDesaturated500}>
            {`${video.publishedAt ? formatDistanceToNow(video.publishedAt, { addSuffix: true, locale: LANGUAGE_OPTIONS.find(({ value }) => value === i18n.language)?.dateLocale }) : ""} • ${t("views", { count: video.views })}`}
          </Typography>
        </View>
        {isDesktop && deleteBtn}
      </View>
    </View>
  );
};

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
