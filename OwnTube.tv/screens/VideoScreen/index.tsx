import VideoView from "../../components/VideoView";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useGetVideoQuery } from "../../api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader, FocusWrapper, FullScreenModal, ErrorTextWithRetry } from "../../components";
import { useViewHistory } from "../../hooks";
import { StatusBar } from "expo-status-bar";
import { Settings } from "../../components/VideoControlsOverlay/components/modals";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorSchemeContext } from "../../contexts";
import { useTranslation } from "react-i18next";
import useFullScreenVideoPlayback from "../../hooks/useFullScreenVideoPlayback";
import Share from "../../components/VideoControlsOverlay/components/modals/Share";
import VideoDetails from "../../components/VideoControlsOverlay/components/modals/VideoDetails";

export const VideoScreen = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { data, isFetching, isError, refetch } = useGetVideoQuery(params?.id);
  const { updateHistory } = useViewHistory();
  const { isFullscreen, toggleFullscreen } = useFullScreenVideoPlayback();
  const { top } = useSafeAreaInsets();
  const { scheme } = useColorSchemeContext();

  useEffect(() => {
    if (data && params?.backend) {
      const updateData = {
        ...data,
        previewPath: `https://${params.backend}${data.previewPath}`,
        backend: params.backend,
        lastViewedAt: new Date().getTime(),
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

  useFocusEffect(
    useCallback(() => {
      return () => {
        closeModal();
      };
    }, []),
  );

  if (isFetching) {
    return <Loader />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <ErrorTextWithRetry refetch={refetch} errorText={t("videoFailedToLoad")} />
      </View>
    );
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
      <View id="video-container" style={[{ paddingTop: Platform.isTV ? 0 : top }, styles.videoContainer]}>
        <VideoView
          videoData={data}
          isModalOpen={!!visibleModal}
          timestamp={params?.timestamp}
          handleSetTimeStamp={handleSetTimeStamp}
          testID={`${params.id}-video-view`}
          uri={uri}
          title={data?.name}
          channel={data?.channel}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          handleOpenDetails={() => setVisibleModal("details")}
          handleOpenSettings={() => {
            setVisibleModal("settings");
          }}
          handleShare={() => {
            setVisibleModal("share");
          }}
          viewUrl={data?.url}
        />
        <FullScreenModal onBackdropPress={closeModal} isVisible={visibleModal === "details"}>
          <VideoDetails
            onClose={closeModal}
            name={data?.name || ""}
            channelName={data?.channel?.displayName || ""}
            channelHandle={data?.channel?.name}
            description={data?.description || ""}
            datePublished={data?.originallyPublishedAt || data?.publishedAt || ""}
          />
        </FullScreenModal>
        <FullScreenModal onBackdropPress={closeModal} isVisible={visibleModal === "share"}>
          <Share onClose={closeModal} titleKey="shareVideo" />
        </FullScreenModal>
        <FullScreenModal onBackdropPress={closeModal} isVisible={visibleModal === "settings"}>
          <Settings onClose={closeModal} />
        </FullScreenModal>
      </View>
    </FocusWrapper>
  );
};

const styles = StyleSheet.create({
  errorContainer: { alignItems: "center", flex: 1, height: "100%", justifyContent: "center", width: "100%" },
  videoContainer: { minHeight: "100%", minWidth: "100%" },
});
