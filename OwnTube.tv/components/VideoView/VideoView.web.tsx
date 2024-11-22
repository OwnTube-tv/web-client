import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Player from "video.js/dist/types/player";
import { VideoViewProps } from "./VideoView";
import { styles } from "./styles";
import "./styles.web.css";
import videojs from "video.js";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import VideoControlsOverlay from "../VideoControlsOverlay";

declare const window: {
  videojs: typeof videojs;
} & Window;

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
}: VideoViewProps) => {
  const { videojs } = window;
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState({
    didJustFinish: false,
    isMuted: false,
    isPlaying: false,
    position: 0,
    duration: 1,
    playableDuration: 0,
    volume: 1,
  });
  const isMobile = Device.deviceType !== DeviceType.DESKTOP;
  const [isControlsVisible, setIsControlsVisible] = useState(false);

  const updatePlaybackStatus = (updatedStatus: Partial<typeof playbackStatus>) => {
    setPlaybackStatus((prev) => ({ ...prev, ...updatedStatus }));
  };

  const handlePlayPause = () => {
    if (playerRef.current?.paused()) {
      playerRef.current?.play();
    } else {
      playerRef.current?.pause();
    }
  };

  const handleRW = (seconds: number) => {
    playerRef.current?.currentTime(playbackStatus.position / 1000 - seconds);
  };

  const handleFF = (seconds: number) => {
    playerRef.current?.currentTime(playbackStatus.position / 1000 + seconds);
  };

  const toggleMute = () => {
    const newValue = !playerRef.current?.muted();
    playerRef.current?.muted(newValue);
    updatePlaybackStatus({ isMuted: newValue });
  };

  const handleReplay = () => {
    playerRef.current?.currentTime(0);
    playerRef.current?.play();
  };

  const handleJumpTo = (position: number) => {
    playerRef.current?.tech().setCurrentTime(position / 1000);
  };

  const options = {
    autoplay: true,
    controls: false,
    playsinline: true,
    html5: {
      vhs: {
        overrideNative: true,
      },
    },
    sources: [
      {
        src: uri,
      },
    ],
    children: ["MediaLoader"],
  };

  const onReady = (player: Player) => {
    playerRef.current = player;

    player.on("loadedmetadata", () => {
      updatePlaybackStatus({
        duration: Math.floor(playerRef.current?.duration() ?? 0) * 1000,
        playableDuration: playerRef.current?.bufferedEnd(),
      });
    });

    player.on("play", () => {
      updatePlaybackStatus({ isPlaying: true, didJustFinish: false });
    });

    player.on("pause", () => {
      updatePlaybackStatus({ isPlaying: false });
    });

    player.on("timeupdate", () => {
      updatePlaybackStatus({
        position: Math.floor(playerRef.current?.currentTime() ?? 0) * 1000,
        didJustFinish: false,
      });
    });

    player.on("ended", () => {
      updatePlaybackStatus({ didJustFinish: true });
    });

    player.on("volumechange", () => {
      const vol = playerRef.current?.volume?.() ?? 1;

      updatePlaybackStatus({ volume: vol });
    });
  };

  useEffect(() => {
    if (!videojs) return;

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;

      player.options(options);
    }
  }, [options, videojs]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (timestamp) {
      playerRef.current?.currentTime(Number(timestamp));
    }
  }, [timestamp]);

  useEffect(() => {
    const { position } = playbackStatus;
    const positionFormatted = position / 1000;

    handleSetTimeStamp(positionFormatted);
  }, [playbackStatus.position]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handlePlayPause();
      }
      if (e.code === "ArrowRight") {
        handleFF(30);
      }
      if (e.code === "ArrowLeft") {
        handleRW(15);
      }
      if (e.code === "KeyM") {
        toggleMute();
      }
      if (e.code === "KeyF") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleFF, handleRW, handlePlayPause, toggleMute]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleAction = () => {
      setIsControlsVisible(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    };

    window?.addEventListener("mousemove", handleAction);
    window?.addEventListener("mousedown", handleAction);

    return () => {
      window?.removeEventListener("mousemove", handleAction);
      window?.removeEventListener("mousedown", handleAction);
      clearTimeout(timeout);
    };
  }, []);

  const handleVolumeControl = (volume: number) => {
    const formattedVolume = (volume < 0 ? 0 : volume) * 0.01;

    if (formattedVolume === 0) {
      playerRef.current?.muted(true);
      updatePlaybackStatus({ isMuted: true });
      return;
    }

    playerRef.current?.volume(formattedVolume);
    playerRef.current?.muted(false);
    updatePlaybackStatus({ isMuted: false });
  };

  const handleOverlayPress = () => {
    if (!isMobile) {
      handlePlayPause();
    }
  };

  return (
    <View style={styles.container}>
      <VideoControlsOverlay
        handlePlayPause={handlePlayPause}
        isPlaying={playbackStatus?.isPlaying}
        isVisible={isControlsVisible}
        onOverlayPress={handleOverlayPress}
        handleRW={handleRW}
        handleFF={handleFF}
        duration={playbackStatus?.duration}
        availableDuration={playbackStatus?.playableDuration}
        position={playbackStatus?.position}
        toggleMute={toggleMute}
        isMute={playbackStatus?.isMuted}
        shouldReplay={playbackStatus?.didJustFinish}
        handleReplay={handleReplay}
        handleJumpTo={handleJumpTo}
        title={title}
        channel={{ name: channel?.displayName, handle: channel?.name }}
        handleVolumeControl={handleVolumeControl}
        volume={playbackStatus.isMuted ? 0 : playbackStatus.volume * 100}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        handleOpenDetails={handleOpenDetails}
        handleShare={handleShare}
        handleOpenSettings={handleOpenSettings}
      >
        <div style={{ position: "fixed", cursor: "pointer" }} ref={videoRef} data-testid={`${testID}-video-playback`} />
        {isMobile && isControlsVisible && <View style={styles.opacityOverlay} />}
      </VideoControlsOverlay>
    </View>
  );
};

export default VideoView;
