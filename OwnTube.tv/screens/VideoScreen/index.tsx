import VideoView from "../../components/VideoView";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useGetVideoQuery } from "../../api";
import { useEffect, useMemo } from "react";
import { Loader, FocusWrapper } from "../../components";
import { useViewHistory, useFullScreenVideoPlayback } from "../../hooks";
import { StatusBar } from "expo-status-bar";
import { useColorSchemeContext } from "../../contexts";

export const VideoScreen = () => {
  const params = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();

  const { data, isFetching } = useGetVideoQuery(params?.id);
  const { updateHistory } = useViewHistory();
  const { isFullscreen, toggleFullscreen } = useFullScreenVideoPlayback();
  const { scheme } = useColorSchemeContext();

  useEffect(() => {
    if (data && params?.backend) {
      const updateData = {
        uuid: data.uuid,
        name: data.name,
        thumbnailPath: `https://${params.backend}${data.thumbnailPath}`,
        backend: params.backend,
        lastViewedAt: new Date().getTime(),
        category: data.category,
        description: data.description,
        duration: data.duration,
      };

      updateHistory({ data: updateData });
    }
  }, [data, params?.backend]);

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

  const handleSetTimeStamp = (timestamp: number) => {
    if (!params?.id) {
      return;
    }

    updateHistory({ data: { uuid: params.id, timestamp, lastViewedAt: new Date().getTime() } });
  };

  if (isFetching) {
    return <Loader />;
  }

  if (!uri) {
    return null;
  }

  return (
    <FocusWrapper>
      <StatusBar hidden={isFullscreen} style={scheme === "dark" ? "light" : "dark"} />
      <VideoView
        timestamp={params?.timestamp}
        handleSetTimeStamp={handleSetTimeStamp}
        testID={`${params.id}-video-view`}
        uri={uri}
        title={data?.name}
        channelName={data?.channel?.displayName}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </FocusWrapper>
  );
};
