import { VideoThumbnail } from "./VideoThumbnail";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { getHumanReadableDuration } from "../utils";
import { format } from "date-fns";
import { ViewHistoryEntry } from "../hooks";
import { useTranslation } from "react-i18next";

interface ViewHistoryListItemProps {
  video: ViewHistoryEntry;
}

export const ViewHistoryListItem = ({ video }: ViewHistoryListItemProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <VideoThumbnail video={video} backend={video.backend} key={video.uuid} timestamp={video.timestamp} />
      <View>
        <Typography>
          {t("lastPlaybackTimeStamp", { timestamp: getHumanReadableDuration(video.timestamp * 1000) })}
        </Typography>
        <Typography>{t("videoDuration", { duration: getHumanReadableDuration(video.duration * 1000) })}</Typography>
        <Typography>{t("associatedPeertubeBackend", { backend: video.backend })}</Typography>
        {video.firstViewedAt && (
          <Typography>{t("firstWatched", { date: format(new Date(video.firstViewedAt), "dd/M/yyyy p") })}</Typography>
        )}
        {video.lastViewedAt && (
          <Typography>{t("lastWatched", { lastWatched: format(video.lastViewedAt, "dd/M/yyyy p") })}</Typography>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
});
