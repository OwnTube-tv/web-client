import { VideosByCategory } from "./VideosByCategory";
import { Channel, GetVideosVideo } from "../api/models";
import { View } from "react-native";
import { Typography } from "./Typography";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { ChannelAvatar } from "./ChannelAvatar";

interface Props {
  channel: Channel;
  data: Record<string, GetVideosVideo[]>;
}

export const VideoChannel = ({ channel, data }: Props) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <ChannelAvatar imageUri={`https://${backend}${channel.avatar?.path}`} />
        <Typography>{channel.displayName}</Typography>
      </View>
      {Object.entries(data || {}).map(([category, videos]) => (
        <VideosByCategory key={category} title={category} videos={videos} />
      ))}
    </View>
  );
};
