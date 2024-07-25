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
  timestamp?: string;
  title?: string;
}

const VideoView = ({ uri, testID, handleSetTimeStamp, timestamp, title }: VideoViewProps) => {
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
    if (status?.isLoaded) {
      setPlaybackStatus(status);

      if (status.androidImplementation) {
        setPlayerImplementation(`Android ${status.androidImplementation}`);
      }
    } else if (status?.error) {
      console.error(status.error);
    }
  };

  const handleRW = (seconds: number) => {
    videoRef.current?.setPositionAsync((playbackStatus?.positionMillis ?? 0) - seconds * 1000);
  };

  const handleFF = (seconds: number) => {
    videoRef.current?.setPositionAsync((playbackStatus?.positionMillis ?? 0) + seconds * 1000);
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

  useEffect(() => {
    videoRef.current?.setPositionAsync(Number(timestamp) * 1000);
  }, [timestamp]);

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
        title={title}
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
      </VideoControlsOverlay>
    </View>
  );
};

export default VideoView;
