import { VideoView } from "../../components";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";

export const VideoScreen = () => {
  const params = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();

  if (!params?.id) {
    return null;
  }

  return <VideoView videoID={params.id} />;
};
