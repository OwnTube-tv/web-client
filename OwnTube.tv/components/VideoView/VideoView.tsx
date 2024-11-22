import { AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { styles } from "./styles";
import { useAppConfigContext } from "../../contexts";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { VideoChannelSummary } from "@peertube/peertube-types";
import VideoControlsOverlay from "../VideoControlsOverlay";

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
}: VideoViewProps) => {
  const videoRef = useRef<Video>(null);
  const [playbackStatus, setPlaybackStatus] = useState<(AVPlaybackStatusSuccess & { positionSeconds: number }) | null>(
    null,
  );
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const { setPlayerImplementation } = useAppConfigContext();
  const isMobile = Device.deviceType !== DeviceType.DESKTOP;

  const handlePlayPause = () => {
    videoRef.current?.[playbackStatus?.isPlaying ? "pauseAsync" : "playAsync"]();
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status?.isLoaded) {
      setPlaybackStatus({ ...status, positionSeconds: Math.floor(status.positionMillis / 1000) });

      if (status.androidImplementation) {
        setPlayerImplementation(`Android ${status.androidImplementation}`);
      }
    } else if (status?.error) {
      console.error(status.error);
    }
  };

  const handleRW = async (seconds: number) => {
    await videoRef.current?.setPositionAsync((playbackStatus?.positionMillis ?? 0) - seconds * 1000);
  };

  const handleFF = async (seconds: number) => {
    await videoRef.current?.setPositionAsync((playbackStatus?.positionMillis ?? 0) + seconds * 1000);
  };

  const toggleMute = () => {
    videoRef.current?.setIsMutedAsync(!playbackStatus?.isMuted);
  };

  const handleReplay = () => {
    videoRef.current?.playFromPositionAsync(0);
  };

  const handleJumpTo = (position: number) => {
    videoRef.current?.setPositionAsync(position);
  };

  useEffect(() => {
    if (!playbackStatus) return;

    const { positionSeconds } = playbackStatus;

    handleSetTimeStamp(positionSeconds);
  }, [playbackStatus?.positionMillis]);

  useEffect(() => {
    videoRef.current?.setPositionAsync(Number(timestamp) * 1000);
  }, [timestamp]);

  const handleVolumeControl = (volume: number) => {
    videoRef.current?.setVolumeAsync(volume);
  };

  const modalOpenRef = useRef(false);
  useEffect(() => {
    modalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  const timeout = useRef<NodeJS.Timeout>();
  const handleOverlayPress = () => {
    setIsControlsVisible(true);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setIsControlsVisible(modalOpenRef.current);
    }, 3000);
  };

  const tap = Gesture.Tap()
    .onFinalize(() => {
      if (!Platform.isTV) {
        handleOverlayPress();
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={tap}>
      <View collapsable={false} style={styles.container}>
        <VideoControlsOverlay
          handlePlayPause={handlePlayPause}
          isPlaying={playbackStatus?.isPlaying}
          isVisible={isControlsVisible}
          onOverlayPress={Platform.isTV ? handleOverlayPress : undefined}
          handleRW={handleRW}
          handleFF={handleFF}
          duration={playbackStatus?.durationMillis}
          availableDuration={playbackStatus?.playableDurationMillis}
          position={playbackStatus?.positionMillis}
          toggleMute={toggleMute}
          isMute={playbackStatus?.isMuted}
          shouldReplay={playbackStatus?.didJustFinish}
          handleReplay={handleReplay}
          handleJumpTo={handleJumpTo}
          title={title}
          channel={{ name: channel?.displayName, handle: channel?.name }}
          handleVolumeControl={handleVolumeControl}
          volume={playbackStatus?.volume ?? 0}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          handleOpenDetails={handleOpenDetails}
          handleShare={handleShare}
          handleOpenSettings={handleOpenSettings}
        >
          <Video
            testID={`${testID}-video-playback`}
            shouldPlay
            resizeMode={ResizeMode.CONTAIN}
            ref={videoRef}
            source={{ uri }}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            style={styles.videoWrapper}
          />
          {isMobile && !Platform.isTVOS && isControlsVisible && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.opacityOverlay} />
          )}
        </VideoControlsOverlay>
      </View>
    </GestureDetector>
  );
};

export default VideoView;
