import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Platform, View } from "react-native";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Video as PeertubeVideoModel, VideoCaption, VideoChannelSummary } from "@peertube/peertube-types";
import VideoControlsOverlay from "../VideoControlsOverlay";
import Toast from "react-native-toast-message";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { ROUTES } from "../../types";
import { RootStackParams } from "../../app/_layout";
import { SelectedVideoTrackType, TextTracks, TextTrackType, Video, VideoRef } from "react-native-video";
import { SelectedTrackType } from "react-native-video/src/types/video";
import type {
  OnBandwidthUpdateData,
  OnProgressData,
  OnVideoErrorData,
} from "react-native-video/src/specs/VideoNativeComponent";
import { OnLoadData, OnTextTracksData } from "react-native-video/src/types/events";
import GoogleCast, {
  MediaHlsSegmentFormat,
  MediaHlsVideoSegmentFormat,
  useRemoteMediaClient,
} from "react-native-google-cast";
import { IcoMoonIcon } from "../IcoMoonIcon";
import { useTheme } from "@react-navigation/native";
import { styles } from "./styles";
import { usePostVideoViewMutation } from "../../api";
import { ISO639_1 } from "react-native-video/src/types/language";
import { useTranslation } from "react-i18next";
import { useAppConfigContext } from "../../contexts";
import { Typography } from "../Typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCustomDiagnosticsEvents } from "../../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents, CustomPostHogExceptions } from "../../diagnostics/constants";
import { getHumanReadableDuration } from "../../utils";
import { useWatchedDuration } from "../../hooks";

export interface VideoViewProps {
  uri?: string;
  testID: string;
  handleSetTimeStamp: (timestamp: number) => void;
  timestamp?: string;
  title?: string;
  channel?: VideoChannelSummary;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  handleOpenDetails: () => void;
  handleShare: () => void;
  handleOpenSettings: () => void;
  isModalOpen: boolean;
  viewUrl?: string;
  videoData?: PeertubeVideoModel;
  selectedQuality: string;
  handleSetQuality: (quality: string) => void;
  captions?: VideoCaption[];
  isWaitingForLive: boolean;
}

const VideoView = ({
  uri,
  testID,
  handleSetTimeStamp,
  timestamp,
  title,
  channel,
  toggleFullscreen,
  isFullscreen,
  handleOpenDetails,
  handleShare,
  handleOpenSettings,
  isModalOpen,
  viewUrl,
  videoData,
  selectedQuality,
  handleSetQuality,
  captions,
  isWaitingForLive,
}: VideoViewProps) => {
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playableDuration, setPlayableDuration] = useState(0);
  const [shouldReplay, setShouldReplay] = useState(false);
  const [castState, setCastState] = useState<"airPlay" | "chromecast">();
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const { i18n } = useTranslation();
  const [availableCCLangs, setAvailableCCLangs] = useState<string[]>([]);
  const [selectedCCLang, setSelectedCCLang] = useState("");
  const [memorizedCCLang, setMemorizedCCLang] = useState<string | null>(null);
  const [isCCShown, setIsCCShown] = useState(false);
  const isMobile = Device.deviceType !== DeviceType.DESKTOP;
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { captureDiagnosticsEvent, captureError } = useCustomDiagnosticsEvents();
  const { handleTimeUpdate } = useWatchedDuration(duration);
  const capturePlaybackEvent = (viewEvent: "watch" | "seek") => {
    captureDiagnosticsEvent(CustomPostHogEvents.VideoPlayback, {
      videoId: videoData?.uuid,
      currentTime,
      isFullscreen,
      externalPlaybackState: castState,
      captionsEnabled: isCCShown,
      captionsLanguage: selectedCCLang,
      viewEvent,
    });
  };

  const googleCastClient = Platform.isTV
    ? null
    : useRemoteMediaClient({ ignoreSessionUpdatesInBackground: Platform.OS === "ios" });
  const { mutate: postVideoView } = usePostVideoViewMutation();

  const handlePlayPause = async () => {
    videoRef.current?.[isPlaying ? "pause" : "resume"]();
    googleCastClient?.[isPlaying ? "pause" : "play"]();
    const currentTime = await videoRef.current?.getCurrentPosition();
    captureDiagnosticsEvent(CustomPostHogEvents[isPlaying ? "Pause" : "Play"], {
      currentTime: getHumanReadableDuration((currentTime || 0) * 1000),
    });
  };

  const isPlayingRef = useRef(false);

  const handleRW = (seconds: number) => {
    const updatedTime = currentTime - seconds;
    captureDiagnosticsEvent(CustomPostHogEvents.Scrubbing, {
      videoId: videoData?.uuid,
      currentTime: getHumanReadableDuration((currentTime || 0) * 1000),
      targetTime: getHumanReadableDuration((updatedTime || 0) * 1000),
      targetPercentage: Math.trunc((updatedTime / duration) * 100),
    });
    videoRef.current?.seek(updatedTime);
    googleCastClient?.seek({ position: currentTime - seconds, resumeState: isPlaying ? "play" : "pause" });
    postVideoView({ videoId: videoData?.uuid, currentTime: updatedTime, viewEvent: "seek" });
    capturePlaybackEvent("seek");
  };

  const handleFF = (seconds: number) => {
    const updatedTime = currentTime + seconds;
    captureDiagnosticsEvent(CustomPostHogEvents.Scrubbing, {
      videoId: videoData?.uuid,
      currentTime: getHumanReadableDuration((currentTime || 0) * 1000),
      targetTime: getHumanReadableDuration((updatedTime || 0) * 1000),
      targetPercentage: Math.trunc((updatedTime / duration) * 100),
    });
    videoRef.current?.seek(updatedTime);
    googleCastClient?.seek({ position: currentTime + seconds, resumeState: isPlaying ? "play" : "pause" });
    postVideoView({ videoId: videoData?.uuid, currentTime: updatedTime, viewEvent: "seek" });
    capturePlaybackEvent("seek");
  };

  const toggleMute = () => {
    googleCastClient?.setStreamMuted(!muted);
    setMuted((prev) => !prev);
    captureDiagnosticsEvent(muted ? CustomPostHogEvents.UnmuteAudio : CustomPostHogEvents.MuteAudio);
  };

  const handleReplay = () => {
    videoRef.current?.seek(0);
    videoRef.current?.resume();
    setShouldReplay(false);
  };

  const handleJumpTo = async (position: number) => {
    captureDiagnosticsEvent(CustomPostHogEvents.Scrubbing, {
      videoId: videoData?.uuid,
      currentTime: getHumanReadableDuration((currentTime || 0) * 1000),
      targetTime: getHumanReadableDuration((position || 0) * 1000),
      targetPercentage: Math.trunc((position / duration) * 100),
    });
    videoRef.current?.seek(position);
    googleCastClient?.seek({ position, resumeState: isPlaying ? "play" : "pause" });
    postVideoView({ videoId: videoData?.uuid, currentTime: position, viewEvent: "seek" });
    capturePlaybackEvent("seek");
  };

  const lastReportedTime = useRef<number>(0);

  useEffect(() => {
    if (!currentTime) return;

    handleSetTimeStamp(currentTime);

    const currentTimeInt = Math.trunc(currentTime);

    handleTimeUpdate(currentTimeInt);
    if (currentTimeInt % 5 === 0 && currentTimeInt !== lastReportedTime.current) {
      lastReportedTime.current = currentTimeInt;
      postVideoView({ videoId: videoData?.uuid, currentTime: currentTimeInt });
      capturePlaybackEvent("watch");
    }
  }, [currentTime]);

  const handleVolumeControl = (volume: number) => {
    videoRef.current?.setVolume(volume);
    setVolume(volume);
  };

  const modalOpenRef = useRef(false);
  useEffect(() => {
    modalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  const timeout = useRef<NodeJS.Timeout>();
  const handleOverlayPress = () => {
    setIsControlsVisible(true);

    if (Platform.isTV) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setIsControlsVisible(modalOpenRef.current || !isPlayingRef.current);
      }, 5000);
    }
  };

  const hideOverlay = () => {
    setIsControlsVisible(false);
  };

  const handlePlayerError = ({ error }: OnVideoErrorData) => {
    captureError(error, CustomPostHogExceptions.VideoPlayerError);
    Toast.show({ type: "info", text1: `Error: ${String(error.localizedDescription)}`, props: { isError: true } });
  };

  const handleProgress = ({ currentTime, playableDuration }: OnProgressData) => {
    setCurrentTime(currentTime);
    setPlayableDuration(playableDuration);
  };

  const [isLoadingData, setIsLoadingData] = useState(true);
  const toggleLoading = (state: boolean) => () => {
    setIsLoadingData(state);
  };

  const handleVideoLoaded = ({ duration }: OnLoadData) => {
    setDuration(duration);
    setIsLoadingData(false);
  };

  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const formattedCaptions = useMemo<TextTracks>(() => {
    return (captions || [])
      ?.filter(({ m3u8Url }) => !m3u8Url)
      .map(({ fileUrl, language }) => ({
        uri: fileUrl,
        title: language.label,
        language: language.id as ISO639_1,
        type: TextTrackType.VTT,
      }));
  }, [captions]);

  const videoSource = useMemo(() => {
    return {
      textTracks: formattedCaptions,
      startPosition: Number(timestamp || 0) * 1000,
      metadata: {
        title: videoData?.name,
        subtitle: videoData?.truncatedDescription,
        artist: `${videoData?.channel?.displayName} (${videoData?.channel?.host})`,
        description: videoData?.description,
        imageUri: `https://${videoData?.channel?.host}${videoData?.thumbnailPath}`,
      },
    };
  }, [timestamp, videoData, formattedCaptions]);

  const isInitialVideoLoadDone = useRef(false);

  useEffect(() => {
    if (uri) {
      videoRef.current?.setSource({
        ...videoSource,
        uri,
        startPosition: Number(!isInitialVideoLoadDone.current ? Number(timestamp || 0) : currentTime) * 1000,
      });
      isInitialVideoLoadDone.current = true;
    }
  }, [uri]);

  const isCastActivated = useRef(false);

  useEffect(() => {
    if (googleCastClient && uri) {
      isCastActivated.current = true;
      setCastState("chromecast");
      captureDiagnosticsEvent(CustomPostHogEvents.ChromecastStarted);
      googleCastClient.loadMedia({
        mediaInfo: {
          metadata: {
            type: "generic",
            ...videoSource.metadata,
          },
          contentUrl: uri,
          ...(Number(videoData?.streamingPlaylists?.length) > 0
            ? {
                contentType: "application/x-mpegurl",
                hlsSegmentFormat: MediaHlsSegmentFormat.AAC,
                hlsVideoSegmentFormat: MediaHlsVideoSegmentFormat.FMP4,
              }
            : {}),
        },
        playbackRate: playbackSpeed,
        startTime: Number(!isInitialVideoLoadDone.current ? Number(timestamp || 0) : currentTime),
      });
      googleCastClient?.onMediaProgressUpdated((progress) => {
        setCurrentTime(progress);
      });
      googleCastClient?.onMediaStatusUpdated((mediaStatus) => {
        setIsPlaying(mediaStatus?.playerState === "playing");
      });
    } else if (isCastActivated.current) {
      isCastActivated.current = false;
      setCastState(undefined);
      captureDiagnosticsEvent(CustomPostHogEvents.ChromecastStopped);
      videoRef.current?.setSource({
        ...videoSource,
        uri,
        startPosition: Number(currentTime) * 1000,
      });
      videoRef.current?.[isPlaying ? "resume" : "pause"]();
    }
  }, [googleCastClient]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        const sessionManager = GoogleCast?.getSessionManager();
        sessionManager?.endCurrentSession(true);
      };
    }, []),
  );

  const handleTextTracks = (e: OnTextTracksData) => {
    setAvailableCCLangs(
      e.textTracks.reduce((acc, cur) => {
        if (cur.language) {
          acc.push(cur.language);
        }

        return acc;
      }, [] as string[]),
    );
  };

  const isIosWithoutSideloadedSubs = Platform.OS === "ios" && !captions?.some(({ m3u8Url }) => m3u8Url);
  const isCCAvailable = useMemo(() => {
    return Number(captions?.length) > 0 && !isIosWithoutSideloadedSubs;
  }, [captions, availableCCLangs, i18n.language]);
  const { sessionCCLocale, updateSessionCCLocale } = useAppConfigContext();

  const handleSetCCLang = (lang: string) => {
    if (!lang) {
      setSelectedCCLang("");
      setIsCCShown(false);
      captureDiagnosticsEvent(CustomPostHogEvents.DisableCaptions);
      return;
    }
    captureDiagnosticsEvent(CustomPostHogEvents.EnableCaptions, { captionLanguage: lang });
    setMemorizedCCLang(lang);
    setSelectedCCLang(lang);
    updateSessionCCLocale(lang);
    setIsCCShown(true);
  };

  const handleToggleCC = () => {
    const autoSelectedLang =
      memorizedCCLang || (availableCCLangs.includes(i18n.language) ? i18n.language : availableCCLangs[0]);

    if (isCCShown) {
      handleSetCCLang("");
    } else {
      handleSetCCLang(autoSelectedLang);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isCCAvailable && sessionCCLocale && availableCCLangs.includes(sessionCCLocale)) {
        handleSetCCLang(sessionCCLocale);
      }
    }, [isCCAvailable, sessionCCLocale]),
  );

  const [hlsResolution, setHlsResolution] = useState<number | undefined>();
  const handleBandwidthUpdate = (event: OnBandwidthUpdateData) => {
    if (Platform.OS !== "android") {
      return;
    }

    setHlsResolution(event.height);
    captureDiagnosticsEvent(CustomPostHogEvents.BandwidthChanged, {
      bandwidth: event.bitrate,
      width: event.width,
      height: event.height,
    });
  };

  const handleSetSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    captureDiagnosticsEvent(CustomPostHogEvents.PlaybackSpeedChanged, { playbackSpeed: speed });
  };

  const allowQualityControls = Platform.OS !== "ios" || !videoData?.streamingPlaylists?.length;

  return (
    <View collapsable={false} style={styles.container}>
      <VideoControlsOverlay
        isLoading={isLoadingData}
        isLiveVideo={videoData?.isLive}
        videoLinkProps={{ backend, url: viewUrl }}
        handlePlayPause={handlePlayPause}
        isPlaying={isPlaying}
        isVisible={isControlsVisible}
        onOverlayPress={Platform.OS !== "web" ? handleOverlayPress : undefined}
        handleRW={handleRW}
        handleFF={handleFF}
        duration={duration}
        availableDuration={playableDuration}
        position={currentTime}
        toggleMute={toggleMute}
        isMute={muted}
        shouldReplay={shouldReplay}
        handleReplay={handleReplay}
        handleJumpTo={handleJumpTo}
        title={title}
        channel={channel}
        handleVolumeControl={handleVolumeControl}
        volume={volume}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        handleOpenDetails={handleOpenDetails}
        handleShare={handleShare}
        handleOpenSettings={handleOpenSettings}
        handleHideOverlay={hideOverlay}
        handleSetSpeed={handleSetSpeed}
        speed={playbackSpeed}
        selectedQuality={selectedQuality}
        handleSetQuality={allowQualityControls ? handleSetQuality : undefined}
        castState={castState}
        isChromeCastAvailable
        handleToggleCC={handleToggleCC}
        isCCAvailable={isCCAvailable}
        setSelectedCCLang={!isIosWithoutSideloadedSubs ? handleSetCCLang : undefined}
        selectedCCLang={selectedCCLang}
        isCCVisible={isCCShown}
        isWaitingForLive={isWaitingForLive}
        hlsAutoQuality={hlsResolution}
        isDownloadAvailable={videoData?.downloadEnabled}
        viewsCount={videoData?.views}
        publishedAt={videoData?.publishedAt}
      >
        {googleCastClient ? (
          <IcoMoonIcon name="Chromecast" size={72} color={colors.white80} />
        ) : isWaitingForLive ? (
          <View style={{ flex: 1, paddingTop: top, width: "100%" }}>
            <Image
              source={{ uri: `https://${backend}${videoData?.previewPath}` }}
              resizeMode="contain"
              style={styles.previewImage}
            />
            <View
              style={[
                styles.liveStreamAnnouncementContainer,
                {
                  backgroundColor: colors.black50,
                },
              ]}
            >
              <Typography
                color={colors.theme50}
                fontWeight="SemiBold"
                fontSize="sizeXL"
                style={{ textAlign: "center" }}
              >
                {t("liveStreamOffline")}
              </Typography>
            </View>
          </View>
        ) : (
          <Video
            reportBandwidth
            onBandwidthUpdate={handleBandwidthUpdate}
            onEnd={() => {
              setShouldReplay(true);
              captureDiagnosticsEvent(CustomPostHogEvents.VideoCompleted);
            }}
            onLoad={handleVideoLoaded}
            onProgress={handleProgress}
            showNotificationControls
            resizeMode="contain"
            ignoreSilentSwitch={"ignore"}
            playInBackground={!Platform.isTV}
            testID={`${testID}-video-playback`}
            ref={videoRef}
            rate={playbackSpeed}
            onPlaybackStateChanged={({ isPlaying: isPlayingState }) => {
              isPlayingRef.current = isPlayingState;
              setIsPlaying(isPlayingState);
              if (!isPlayingState && Platform.isTVOS) {
                handleOverlayPress();
              }
            }}
            style={styles.videoWrapper}
            onError={handlePlayerError}
            selectedAudioTrack={{
              type: SelectedTrackType.INDEX,
              value: 0,
            }}
            selectedVideoTrack={{ type: SelectedVideoTrackType.RESOLUTION, value: Number(selectedQuality) }}
            onExternalPlaybackChange={(e) => {
              setCastState(e.isExternalPlaybackActive ? "airPlay" : undefined);
              captureDiagnosticsEvent(
                e.isExternalPlaybackActive ? CustomPostHogEvents.AirPlayStarted : CustomPostHogEvents.AirPlayStopped,
              );
            }}
            onTextTracks={handleTextTracks}
            selectedTextTrack={
              selectedCCLang
                ? {
                    type: SelectedTrackType.LANGUAGE,
                    value: selectedCCLang,
                  }
                : undefined
            }
            onLoadStart={toggleLoading(true)}
            onBuffer={({ isBuffering }) => {
              setIsLoadingData(isBuffering);
            }}
            onReadyForDisplay={toggleLoading(false)}
          />
        )}
        {isMobile && !Platform.isTVOS && isControlsVisible && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.opacityOverlay} />
        )}
      </VideoControlsOverlay>
    </View>
  );
};

export default VideoView;
