import VideoView from "../../components/VideoView";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useGetVideoQuery } from "../../api";
import { useEffect, useMemo, useState } from "react";
import { Loader, FocusWrapper, FullScreenModal } from "../../components";
import { useViewHistory, useFullScreenVideoPlayback } from "../../hooks";
import { StatusBar } from "expo-status-bar";
import { Share, VideoDetails } from "../../components/VideoControlsOverlay/components/modals";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorSchemeContext } from "../../contexts";

export const VideoScreen = () => {
  const params = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { data, isFetching } = useGetVideoQuery(params?.id);
  const { updateHistory } = useViewHistory();
  const { isFullscreen, toggleFullscreen } = useFullScreenVideoPlayback();
  const { top } = useSafeAreaInsets();
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

  const [visibleModal, setVisibleModal] = useState<"details" | "share" | "settings" | null>(null);
  const closeModal = () => {
    setVisibleModal(null);
  };

  if (isFetching) {
    return <Loader />;
  }

  if (!uri) {
    return null;
  }

  return (
    <FocusWrapper>
      <StatusBar
        hidden={isFullscreen}
        backgroundColor="black"
        style={Platform.OS === "android" ? "light" : scheme === "dark" ? "light" : "dark"}
      />
      <View id="video-container" style={{ flex: 1, marginTop: top }}>
        <VideoView
          timestamp={params?.timestamp}
          handleSetTimeStamp={handleSetTimeStamp}
          testID={`${params.id}-video-view`}
          uri={uri}
          title={data?.name}
          channelName={data?.channel?.displayName}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          handleOpenDetails={() => setVisibleModal("details")}
          handleOpenSettings={() => {
            setVisibleModal("settings");
          }}
          handleShare={() => {
            setVisibleModal("share");
          }}
        />
        <FullScreenModal onBackdropPress={closeModal} isVisible={visibleModal === "details"}>
          <VideoDetails
            onClose={closeModal}
            name={data?.name || ""}
            channelName={data?.channel?.displayName || ""}
            description={data?.description || ""}
            datePublished={data?.originallyPublishedAt || data?.publishedAt || ""}
          />
        </FullScreenModal>
        <FullScreenModal onBackdropPress={closeModal} isVisible={visibleModal === "share"}>
          <Share onClose={closeModal} />
        </FullScreenModal>
      </View>
    </FocusWrapper>
  );
};
