import { AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { VideoControlsOverlay } from "../VideoControlsOverlay";
import { styles } from "./styles";
import { useAppConfigContext } from "../../contexts";

export interface VideoViewProps {
  uri: string;
  testID: string;
  handleSetTimeStamp: (timestamp: number) => void;
}

const VideoView = ({ uri, testID, handleSetTimeStamp }: VideoViewProps) => {
  const videoRef = useRef<Video>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatusSuccess | null>(null);
  const { setPlayerImplementation } = useAppConfigContext();

  const toggleControls = () => {
    setIsControlsVisible((prev) => !prev);
  };

  const handlePlayPause = () => {
    videoRef.current?.[playbackStatus?.isPlaying ? "pauseAsync" : "playAsync"]();
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackStatus(status);
      setPlayerImplementation(
        status.androidImplementation ? `Android ${status.androidImplementation}` : "iOS Native player",
      );
    } else if (status.error) {
      console.error(status.error);
    }
  };

  const handleRW = () => {
    videoRef.current?.setPositionAsync((playbackStatus?.positionMillis ?? 0) - 10_000);
  };

  const handleFF = () => {
    videoRef.current?.setPositionAsync((playbackStatus?.positionMillis ?? 0) + 10_000);
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

    const { positionMillis } = playbackStatus;
    const positionFormatted = positionMillis / 1000;

    if (positionFormatted % 10 === 0) {
      handleSetTimeStamp(positionFormatted);
    }
  }, [playbackStatus?.positionMillis]);

  return (
    <View style={styles.container}>
      <VideoControlsOverlay
        handlePlayPause={handlePlayPause}
        isPlaying={playbackStatus?.isPlaying}
        isVisible={isControlsVisible}
        onOverlayPress={toggleControls}
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
      >
        <Video
          testID={`${testID}-video-playback`}
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          ref={videoRef}
          source={{ uri }}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          videoStyle={{ position: "relative" }}
        />
      </VideoControlsOverlay>
    </View>
  );
};

export default VideoView;
