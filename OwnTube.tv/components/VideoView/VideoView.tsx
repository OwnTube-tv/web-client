import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Video as PeertubeVideoModel, VideoChannelSummary } from "@peertube/peertube-types";
import VideoControlsOverlay from "../VideoControlsOverlay";
import Toast from "react-native-toast-message";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { ROUTES } from "../../types";
import { RootStackParams } from "../../app/_layout";
import { Video, VideoRef } from "react-native-video";
import { SelectedTrackType } from "react-native-video/src/types/video";
import type { OnProgressData, OnVideoErrorData } from "react-native-video/src/specs/VideoNativeComponent";
import { OnLoadData } from "react-native-video/src/types/events";
import GoogleCast, {
  MediaHlsSegmentFormat,
  MediaHlsVideoSegmentFormat,
  useRemoteMediaClient,
} from "react-native-google-cast";
import { IcoMoonIcon } from "../IcoMoonIcon";
import { useTheme } from "@react-navigation/native";
import { styles } from "./styles";
import { usePostVideoViewMutation } from "../../api";

export interface VideoViewProps {
  uri: string;
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
  const isMobile = Device.deviceType !== DeviceType.DESKTOP;
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { colors } = useTheme();

  const googleCastClient = useRemoteMediaClient({ ignoreSessionUpdatesInBackground: Platform.OS === "ios" });
  const { mutate: postVideoView } = usePostVideoViewMutation();

  const handlePlayPause = () => {
    videoRef.current?.[isPlaying ? "pause" : "resume"]();
    googleCastClient?.[isPlaying ? "pause" : "play"]();
  };

  const isPlayingRef = useRef(false);

  const handleRW = (seconds: number) => {
    const updatedTime = currentTime - seconds;
    videoRef.current?.seek(updatedTime);
    googleCastClient?.seek({ position: currentTime - seconds, resumeState: isPlaying ? "play" : "pause" });
    postVideoView({ videoId: videoData?.uuid, currentTime: updatedTime, viewEvent: "seek" });
  };

  const handleFF = (seconds: number) => {
    const updatedTime = currentTime + seconds;
    videoRef.current?.seek(updatedTime);
    googleCastClient?.seek({ position: currentTime + seconds, resumeState: isPlaying ? "play" : "pause" });
    postVideoView({ videoId: videoData?.uuid, currentTime: updatedTime, viewEvent: "seek" });
  };

  const toggleMute = () => {
    googleCastClient?.setStreamMuted(!muted);
    setMuted((prev) => !prev);
  };

  const handleReplay = () => {
    videoRef.current?.seek(0);
    videoRef.current?.resume();
    setShouldReplay(false);
  };

  const handleJumpTo = (position: number) => {
    videoRef.current?.seek(position);
    googleCastClient?.seek({ position, resumeState: isPlaying ? "play" : "pause" });
    postVideoView({ videoId: videoData?.uuid, currentTime: position, viewEvent: "seek" });
  };

  const lastReportedTime = useRef<number>(0);

  useEffect(() => {
    if (!currentTime) return;

    handleSetTimeStamp(currentTime);

    const currentTimeInt = Math.trunc(currentTime);

    if (currentTimeInt % 5 === 0 && currentTimeInt !== lastReportedTime.current) {
      lastReportedTime.current = currentTimeInt;
      postVideoView({ videoId: videoData?.uuid, currentTime });
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

  const handlePlayerError = (error: OnVideoErrorData) => {
    Toast.show({ type: "info", text1: `Error: ${String(error.error.errorString)}`, props: { isError: true } });
  };

  const handleProgress = ({ currentTime, playableDuration }: OnProgressData) => {
    setCurrentTime(currentTime);
    setPlayableDuration(playableDuration);
  };

  const handleVideoLoaded = ({ duration }: OnLoadData) => {
    setDuration(duration);
  };

  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const videoSource = useMemo(() => {
    return {
      startPosition: Number(timestamp || 0) * 1000,
      metadata: {
        title: videoData?.name,
        subtitle: videoData?.truncatedDescription,
        artist: `${videoData?.channel?.displayName} (${videoData?.channel?.host})`,
        description: videoData?.description,
        imageUri: `https://${videoData?.channel?.host}${videoData?.thumbnailPath}`,
      },
    };
  }, [timestamp, videoData]);

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
    if (googleCastClient) {
      isCastActivated.current = true;
      setCastState("chromecast");
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

  return (
    <View collapsable={false} style={styles.container}>
      <VideoControlsOverlay
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
        channel={{ name: channel?.displayName, handle: channel?.name }}
        handleVolumeControl={handleVolumeControl}
        volume={volume}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        handleOpenDetails={handleOpenDetails}
        handleShare={handleShare}
        handleOpenSettings={handleOpenSettings}
        handleHideOverlay={hideOverlay}
        handleSetSpeed={setPlaybackSpeed}
        speed={playbackSpeed}
        selectedQuality={selectedQuality}
        handleSetQuality={handleSetQuality}
        castState={castState}
        isChromeCastAvailable
      >
        {googleCastClient ? (
          <IcoMoonIcon name="Chromecast" size={72} color={colors.white80} />
        ) : (
          <Video
            onEnd={() => setShouldReplay(true)}
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
            onExternalPlaybackChange={(e) => {
              setCastState(e.isExternalPlaybackActive ? "airPlay" : undefined);
            }}
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
