import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { VideoControlsOverlay } from "../VideoControlsOverlay";
import Player from "video.js/dist/types/player";
import { VideoViewProps } from "./VideoView";
import { styles } from "./styles";
import "./styles.web.css";
import videojs from "video.js";

declare const window: {
  videojs: typeof videojs;
} & Window;

const VideoView = ({ uri, testID, handleSetTimeStamp, timestamp }: VideoViewProps) => {
  const { videojs } = window;
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({
    didJustFinish: false,
    isMuted: false,
    isPlaying: false,
    position: 0,
    duration: 1,
    playableDuration: 0,
  });

  const updatePlaybackStatus = (updatedStatus: Partial<typeof playbackStatus>) => {
    setPlaybackStatus((prev) => ({ ...prev, ...updatedStatus }));
  };

  const toggleControls = () => {
    setIsControlsVisible((prev) => !prev);
  };

  const handlePlayPause = () => {
    if (playerRef.current?.paused()) {
      playerRef.current?.play();
    } else {
      playerRef.current?.pause();
    }
  };

  const handleRW = () => {
    playerRef.current?.currentTime(playbackStatus.position / 1000 - 10);
  };

  const handleFF = () => {
    playerRef.current?.currentTime(playbackStatus.position / 1000 + 10);
  };

  const toggleMute = () => {
    const newValue = !playerRef.current?.muted();
    playerRef.current?.muted(newValue);
    updatePlaybackStatus({ isMuted: newValue });
  };

  const handleReplay = () => {
    playerRef.current?.currentTime(0);
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

  return (
    <View style={styles.container}>
      <VideoControlsOverlay
        handlePlayPause={handlePlayPause}
        isPlaying={playbackStatus?.isPlaying}
        isVisible={isControlsVisible}
        onOverlayPress={toggleControls}
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
      >
        <div style={{ position: "relative" }} ref={videoRef} data-testid={`${testID}-video-playback`} />
      </VideoControlsOverlay>
    </View>
  );
};

export default VideoView;
