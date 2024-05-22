import { AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { VideoControlsOverlay } from "./VideoControlsOverlay";

const hlsUri =
  "https://tube.extinctionrebellion.fr/static/streaming-playlists/hls/8803fdd3-4ac9-49d0-8dcf-ff1586e9e458/1663f4f5-bb3d-44ec-8a21-6195e6407ba8-master.m3u8";

const mp4Uri = "https://tube.extinctionrebellion.fr/download/videos/8803fdd3-4ac9-49d0-8dcf-ff1586e9e458-720.mp4";

export const VideoView = () => {
  const videoRef = useRef<Video>(null);
  const isWeb = Platform.OS === "web";
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

  const { percentageAvailable, percentagePosition } = useMemo(() => {
    const { durationMillis = 1, positionMillis = 1, playableDurationMillis = 1 } = playbackStatus || {};

    if (!playbackStatus) {
      return { percentageAvailable: 0, percentagePosition: 0 };
    }

    return {
      percentageAvailable: (playableDurationMillis / playableDurationMillis) * 100,
      percentagePosition: (positionMillis / durationMillis) * 100,
    };
  }, [playbackStatus]);

  const handleReplay = () => {
    videoRef.current?.playFromPositionAsync(0);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <VideoControlsOverlay
        handlePlayPause={handlePlayPause}
        isPlaying={playbackStatus?.isPlaying}
        isVisible={isControlsVisible}
        onOverlayPress={toggleControls}
        handleRW={handleRW}
        handleFF={handleFF}
        percentagePosition={percentagePosition}
        percentageAvailable={percentageAvailable}
        toggleMute={toggleMute}
        isMute={playbackStatus?.isMuted}
        shouldReplay={playbackStatus?.didJustFinish}
        handleReplay={handleReplay}
      >
        <Video
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          ref={videoRef}
          source={{ uri: isWeb ? mp4Uri : hlsUri }}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          videoStyle={{ position: "relative" }}
        />
      </VideoControlsOverlay>
    </View>
  );
};
