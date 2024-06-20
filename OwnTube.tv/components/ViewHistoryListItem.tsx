import { VideoThumbnail } from "./VideoThumbnail";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { getHumanReadableDuration } from "../utils";
import { format } from "date-fns";
import { ViewHistoryEntry } from "../hooks";

interface ViewHistoryListItemProps {
  video: ViewHistoryEntry;
}

export const ViewHistoryListItem = ({ video }: ViewHistoryListItemProps) => {
  return (
    <View style={styles.container}>
      <VideoThumbnail video={video} backend={video.backend} key={video.uuid} timestamp={video.timestamp} />
      <View>
        <Typography>Last playback timestamp: {getHumanReadableDuration(video.timestamp * 1000)}</Typography>
        <Typography>Video duration: {getHumanReadableDuration(video.duration * 1000)}</Typography>
        <Typography>Associated PeerTube backend: {video.backend}</Typography>
        {video.firstViewedAt && (
          <Typography>First watched: {format(new Date(video.firstViewedAt), "dd/M/yyyy p")}</Typography>
        )}
        {video.lastViewedAt && <Typography>Last watched: {format(video.lastViewedAt, "dd/M/yyyy p")}</Typography>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
});
