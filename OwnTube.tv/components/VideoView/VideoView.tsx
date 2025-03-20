import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { styles } from "./styles";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { VideoChannelSummary } from "@peertube/peertube-types";
import VideoControlsOverlay from "../VideoControlsOverlay";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";
import { ROUTES } from "../../types";
import { RootStackParams } from "../../app/_layout";
import { Video, VideoRef } from "react-native-video";
import { SelectedTrackType } from "react-native-video/src/types/video";
import type { OnProgressData, OnVideoErrorData } from "react-native-video/src/specs/VideoNativeComponent";
import { OnLoadData } from "react-native-video/src/types/events";
import { Video as PeertubeVideoModel } from "@peertube/peertube-types";

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

  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const isMobile = Device.deviceType !== DeviceType.DESKTOP;
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();

  const handlePlayPause = () => {
    videoRef.current?.[isPlaying ? "pause" : "resume"]();
  };

  const isPlayingRef = useRef(false);

  const handleRW = (seconds: number) => {
    videoRef.current?.seek(currentTime - seconds);
  };

  const handleFF = (seconds: number) => {
    videoRef.current?.seek(currentTime + seconds);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const handleReplay = () => {
    videoRef.current?.seek(0);
    videoRef.current?.resume();
    setShouldReplay(false);
  };

  const handleJumpTo = (position: number) => {
    videoRef.current?.seek(position);
  };

  useEffect(() => {
    if (!currentTime) return;

    handleSetTimeStamp(currentTime);
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
        startPosition: Number(!isInitialVideoLoadDone.current ? Number(timestamp) : currentTime) * 1000,
      });
      isInitialVideoLoadDone.current = true;
    }
  }, [uri]);

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
      >
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
        />
        {isMobile && !Platform.isTVOS && isControlsVisible && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.opacityOverlay} />
        )}
      </VideoControlsOverlay>
    </View>
  );
};

export default VideoView;
