import { AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { VideoControlsOverlay } from "./VideoControlsOverlay";

interface VideoViewProps {
  videoID?: string;
}
const quality = 720;

export const VideoView = ({ videoID }: VideoViewProps) => {
  const videoRef = useRef<Video>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatusSuccess | null>(null);

  const toggleControls = () => {
    setIsControlsVisible((prev) => !prev);
  };

  const handlePlayPause = () => {
    videoRef.current?.[playbackStatus?.isPlaying ? "pauseAsync" : "playAsync"]();
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackStatus(status);
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

  const uri = useMemo(() => {
    const hls = `https://tube.extinctionrebellion.fr/static/streaming-playlists/hls/${videoID}/1663f4f5-bb3d-44ec-8a21-6195e6407ba8-master.m3u8`;
    const mp4 = `https://tube.extinctionrebellion.fr/download/videos/${videoID}-${quality}.mp4`;

    return Platform.OS === "web" ? mp4 : hls;
  }, [videoID, quality]);

  const handleJumpTo = (position: number) => {
    videoRef.current?.setPositionAsync(position);
  };

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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
