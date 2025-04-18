import VideoView from "../../components/VideoView";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useGetVideoCaptionsQuery, useGetVideoQuery } from "../../api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader, FocusWrapper, FullScreenModal, ErrorTextWithRetry, Button } from "../../components";
import { useViewHistory } from "../../hooks";
import { StatusBar } from "expo-status-bar";
import { Settings } from "../../components/VideoControlsOverlay/components/modals";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import useFullScreenVideoPlayback from "../../hooks/useFullScreenVideoPlayback";
import Share from "../../components/VideoControlsOverlay/components/modals/Share";
import VideoDetails from "../../components/VideoControlsOverlay/components/modals/VideoDetails";
import { colorSchemes, spacing } from "../../theme";

export const VideoScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { data, isFetching, isError, refetch } = useGetVideoQuery({ id: params?.id });
  const { data: captions } = useGetVideoCaptionsQuery(params?.id);
  const { updateHistory } = useViewHistory();
  const { isFullscreen, toggleFullscreen } = useFullScreenVideoPlayback();
  const { top } = useSafeAreaInsets();
  const [quality, setQuality] = useState("auto");

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

      const streamByQuality = hlsStream.files.find(({ resolution }) => String(resolution.id) === quality);

      if (!streamByQuality) return hlsStream.playlistUrl;

      // fallback to .replace() is for older instances without playlistUrl support
      return streamByQuality.playlistUrl || streamByQuality.fileUrl.replace(`-fragmented.mp4`, ".m3u8");
    }

    const webVideoFileByQuality = data.files?.find(({ resolution }) => String(resolution.id) === quality);

    if (!webVideoFileByQuality) return data.files?.filter(({ resolution }) => resolution.id <= 1080)[0]?.fileUrl;

    return webVideoFileByQuality?.fileUrl;
  }, [params, data, quality]);

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
        setQuality("auto");
      };
    }, []),
  );

  if (isFetching) {
    return (
      <View style={[{ paddingTop: top }, styles.flex1]}>
        {Platform.OS !== "web" && (
          <Button onPress={router.back} contrast="low" icon="Arrow-Left" style={styles.backButton} />
        )}
        <View style={styles.flex1}>
          <Loader />
        </View>
      </View>
    );
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
      <StatusBar hidden={isFullscreen} backgroundColor="black" style="light" />
      <View style={[{ height: Platform.isTV ? 0 : top }, styles.statusBarUnderlay]} />
      <View
        id="video-container"
        style={[styles.videoContainer, { paddingTop: Platform.isTV ? 0 : top, marginTop: Platform.isTV ? 0 : -top }]}
      >
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
          selectedQuality={quality}
          handleSetQuality={setQuality}
          captions={captions}
        />
        <FullScreenModal onBackdropPress={closeModal} isVisible={visibleModal === "details"}>
          <VideoDetails
            onClose={closeModal}
            name={data?.name || ""}
            channel={data?.channel}
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
  backButton: { alignSelf: "flex-start", height: 48, margin: spacing.sm, width: 48 },
  errorContainer: { alignItems: "center", flex: 1, height: "100%", justifyContent: "center", width: "100%" },
  flex1: { flex: 1 },
  statusBarUnderlay: { backgroundColor: colorSchemes.dark.colors.black100, width: "100%" },
  videoContainer: { minHeight: "100%", minWidth: "100%" },
});
