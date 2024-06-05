import VideoView from "../../components/VideoView";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useGetVideoQuery } from "../../api";
import { useMemo } from "react";
import { Loader } from "../../components";

export const VideoScreen = () => {
  const params = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();

  const { data, isFetching } = useGetVideoQuery(params?.id);

  const uri = useMemo(() => {
    if (!params?.id || !data) {
      return;
    }

    if (data?.streamingPlaylists?.length) {
      const hlsStream = data.streamingPlaylists[0];

      return hlsStream.playlistUrl;
    }

    const files = data.files?.filter(({ resolution }) => resolution.id <= 1080);

    // temporarily choose the highest quality
    return files?.[0].fileUrl;
  }, [params, data]);

  if (isFetching) {
    return <Loader />;
  }

  if (!uri) {
    return null;
  }

  return <VideoView testID={`${params.id}-video-view`} uri={uri} />;
};
