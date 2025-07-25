import { useCallback, useEffect, useRef, useState } from "react";
import { View, Image } from "react-native";
import Player from "video.js/dist/types/player";
import { VideoViewProps } from "./VideoView";
import { styles } from "./styles";
import "./styles.web.css";
import videojs from "video.js";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import VideoControlsOverlay from "../VideoControlsOverlay";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES, STORAGE } from "../../types";
import { usePostVideoViewMutation } from "../../api";
import { IcoMoonIcon } from "../IcoMoonIcon";
import { useTheme } from "@react-navigation/native";
import { useChromeCast, useViewHistory } from "../../hooks";
import { useTranslation } from "react-i18next";
import { useAppConfigContext } from "../../contexts";
import { Typography } from "..";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface PlaybackStatus {
  didJustFinish: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  position: number;
  duration: number;
  playableDuration: number;
  volume: number;
  rate: number;
  isMetadataLoaded?: boolean;
}

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
  viewUrl,
  selectedQuality,
  handleSetQuality,
  videoData,
  captions,
  isWaitingForLive,
}: VideoViewProps) => {
  const { videojs } = window;
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const isPlayingRef = useRef(false);
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { mutate: postVideoView } = usePostVideoViewMutation();
  const lastReportedTime = useRef<number>(0);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>({
    didJustFinish: false,
    isMuted: false,
    isPlaying: false,
    position: 0,
    duration: 1,
    playableDuration: 0,
    volume: 1,
    rate: 1,
    isMetadataLoaded: false,
  });
  const { i18n, t } = useTranslation();
  const isMobile = Device.deviceType !== DeviceType.DESKTOP;
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isAirPlayAvailable, setIsAirPlayAvailable] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [availableCCLangs, setAvailableCCLangs] = useState<string[]>([]);
  const [selectedCCLang, setSelectedCCLang] = useState("");
  const [memorizedCCLang, setMemorizedCCLang] = useState<string | null>(null);
  const { top } = useSafeAreaInsets();
  const { getViewHistoryEntryByUuid } = useViewHistory();

  const { colors } = useTheme();

  const updatePlaybackStatus = (updatedStatus: Partial<typeof playbackStatus>) => {
    setPlaybackStatus((prev) => {
      const newState = { ...prev, ...updatedStatus };
      isPlayingRef.current = newState.isPlaying;
      return newState;
    });
  };

  const {
    isChromecastConnected,
    isChromeCastAvailable,
    handleCreateSession,
    handlePlayPause: handleChromeCastPlayPause,
    handleSeek: handleChromeCastSeek,
    handleVolume: handleChromeCastVolume,
    handleMute: handleChromeCastMute,
    isChromecastConnectedRef,
  } = useChromeCast({
    uri,
    videoData,
    playerRef,
    updatePlaybackStatus,
    isPlayingRef,
  });

  const handlePlayPause = () => {
    const handledByChromeCast = handleChromeCastPlayPause();
    if (handledByChromeCast) return;

    if (playerRef.current?.paused()) {
      playerRef.current?.play();
    } else {
      playerRef.current?.pause();
    }
  };

  const handleRW = (seconds: number) => {
    const updatedTime = playbackStatus.position - seconds;
    playerRef.current?.currentTime(updatedTime);
    postVideoView({ videoId: videoData?.uuid, currentTime: updatedTime, viewEvent: "seek" });
    handleChromeCastSeek(playbackStatus.position - seconds);
  };

  const handleFF = (seconds: number) => {
    const updatedTime = playbackStatus.position + seconds;
    handleChromeCastSeek(updatedTime);
    playerRef.current?.currentTime(updatedTime);
    postVideoView({ videoId: videoData?.uuid, currentTime: updatedTime, viewEvent: "seek" });
  };

  const toggleMute = () => {
    const newValue = !playerRef.current?.muted();
    playerRef.current?.muted(newValue);
    updatePlaybackStatus({ isMuted: newValue });
    handleChromeCastMute(newValue);
  };

  const handleReplay = () => {
    playerRef.current?.currentTime(0);
    playerRef.current?.play();
  };

  const handleJumpTo = (position: number) => {
    handleChromeCastSeek(position);
    playerRef.current?.tech().setCurrentTime(position);
    postVideoView({ videoId: videoData?.uuid, currentTime: position, viewEvent: "seek" });
  };

  const options = {
    autoplay: true,
    controls: true,
    playsinline: true,
    preload: false,
    crossorigin: "anonymous",
    html5: {
      nativeTextTracks: true,
      vhs: {
        overrideNative: !videojs.browser.IS_ANY_SAFARI,
      },
    },
    sources: [
      {
        src: uri,
      },
    ],
    children: ["MediaLoader", "NativeTextTrackDisplay"],
  };

  const handleAirPlayAvailabilityChange = function (event: Event) {
    setIsAirPlayAvailable(event.availability === "available");
  };

  const [hlsResolution, setHlsResolution] = useState<number | undefined>();
  const hlsResolutionRef = useRef<number | null>(null);

  const onReady = (player: Player) => {
    playerRef.current = player;
    const video = document.getElementsByTagName("video")[0];

    if (window.WebKitPlaybackTargetAvailabilityEvent && video) {
      video.addEventListener("webkitplaybacktargetavailabilitychanged", handleAirPlayAvailabilityChange);
    }

    player.on("loadstart", () => {
      setIsLoadingData(true);
    });

    player.on("waiting", () => {
      setIsLoadingData(true);
    });

    player.on("loadeddata", () => {
      setIsLoadingData(false);
    });

    player.on("canplay", () => {
      setIsLoadingData(false);
    });

    player.on("canplaythrough", () => {
      setIsLoadingData(false);
    });

    player.on("ready", () => {
      setIsLoadingData(false);
    });

    player.on("loadedmetadata", () => {
      updatePlaybackStatus({
        duration: Math.floor(playerRef.current?.duration() ?? 0),
        playableDuration: playerRef.current?.bufferedEnd(),
        isMetadataLoaded: true,
      });

      let segmentMetadataTrack: TextTrack | null = null;
      const tracks = player.textTracks();

      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].label === "segment-metadata") {
          segmentMetadataTrack = tracks[i];
        }
      }

      if (segmentMetadataTrack) {
        segmentMetadataTrack.mode = "hidden";

        segmentMetadataTrack.addEventListener("cuechange", () => {
          const currentRes = segmentMetadataTrack?.activeCues?.[0]?.value?.resolution?.height;

          if (currentRes && hlsResolutionRef.current !== currentRes) {
            hlsResolutionRef.current = currentRes;
            setHlsResolution(currentRes);
          }
        });
      }
    });

    player.on("play", () => {
      if (!isChromecastConnectedRef.current) {
        updatePlaybackStatus({ isPlaying: true, didJustFinish: false });
      }
    });

    player.on("pause", () => {
      if (!isChromecastConnectedRef.current) {
        updatePlaybackStatus({ isPlaying: false });
      }
    });

    player.on("timeupdate", () => {
      updatePlaybackStatus({
        position: Math.floor(playerRef.current?.currentTime() ?? 0),
        didJustFinish: false,
        playableDuration: playerRef.current?.bufferedEnd(),
      });
    });

    player.on("ended", () => {
      updatePlaybackStatus({ didJustFinish: true });
    });

    player.on("volumechange", () => {
      const vol = playerRef.current?.volume?.() ?? 1;
      updatePlaybackStatus({ volume: vol });
    });

    player.on("ratechange", () => {
      const rate = playerRef.current?.playbackRate();
      updatePlaybackStatus({ rate });
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
      const video = document.getElementsByTagName("video")[0];
      video?.removeEventListener("webkitplaybacktargetavailabilitychanged", handleAirPlayAvailabilityChange);
    };
  }, []);

  useEffect(() => {
    const { position } = playbackStatus;

    if (isInitialVideoLoadDone.current) {
      handleSetTimeStamp(position);
    }

    const currentTimeInt = Math.trunc(position);

    if (currentTimeInt % 5 === 0 && currentTimeInt !== lastReportedTime.current) {
      lastReportedTime.current = currentTimeInt;
      postVideoView({ videoId: videoData?.uuid, currentTime: currentTimeInt });
    }
  }, [playbackStatus.position]);

  const handleSelectQuality = (quality: string) => {
    handleSetQuality(quality);

    const vhs = playerRef.current?.tech().vhs;

    if (vhs) {
      vhs.representations().forEach(function (rep) {
        if (rep.height === Number(quality)) {
          rep.enabled(true);
        } else {
          rep.enabled(false);
        }
      });
    }
  };

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

  const isInitialVideoLoadDone = useRef(false);

  useFocusEffect(
    useCallback(() => {
      const position = playerRef.current?.currentTime();
      const viewHistoryEntry = getViewHistoryEntryByUuid(videoData?.uuid || "");

      if (playerRef.current?.paused() && isInitialVideoLoadDone.current) {
        playerRef.current?.autoplay(false);
      }

      playerRef.current?.src(uri);
      playerRef.current?.currentTime(
        !isInitialVideoLoadDone.current
          ? Number(viewHistoryEntry?.timestamp || timestamp || 0)
          : Math.floor(position || 0),
      );
      isInitialVideoLoadDone.current = true;

      return () => {
        playerRef.current?.autoplay(true);
      };
    }, [uri]),
  );

  useEffect(() => {
    if (captions && captions.length > 0 && playbackStatus.isMetadataLoaded) {
      captions.forEach((caption) => {
        if (!caption.m3u8Url) {
          playerRef.current?.addRemoteTextTrack(
            {
              kind: "captions",
              src: caption.fileUrl,
              srclang: caption.language.id,
              label: caption.language.label,
            },
            false,
          );
        }
      });

      setAvailableCCLangs((captions || []).map(({ language }) => language.id));
    }
  }, [captions, playbackStatus.isMetadataLoaded]);

  const handleVolumeControl = (volume: number) => {
    const formattedVolume = (volume < 0 ? 0 : volume) * 0.01;
    handleChromeCastVolume(formattedVolume);

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

  const handleSetSpeed = (speed: number) => {
    playerRef.current?.playbackRate(speed);
  };
  const [isCCShown, setIsCCShown] = useState(false);
  const isCCAvailable = Number(captions?.length) > 0;
  const { updateSessionCCLocale } = useAppConfigContext();

  const handleSetCCLang = (lang: string) => {
    const textTracks = playerRef.current?.textTracks() || {};
    const currentLangTrack =
      textTracks[textTracks.tracks_.findIndex((track: TextTrack) => track.language === selectedCCLang)];

    if (!lang) {
      currentLangTrack.mode = "disabled";
      setSelectedCCLang("");
      updateSessionCCLocale(lang);
      setIsCCShown(false);
      return;
    }
    setMemorizedCCLang(lang);

    const trackToShow = textTracks[textTracks.tracks_.findIndex((track: TextTrack) => track.language === lang)];

    if (currentLangTrack) {
      currentLangTrack.mode = "disabled";
    }

    if (trackToShow) {
      trackToShow.mode = "showing";
    }
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
      const locale = sessionStorage.getItem(STORAGE.CC_LOCALE);

      if (isCCAvailable && locale && availableCCLangs.includes(locale)) {
        setTimeout(() => {
          handleSetCCLang(locale);
        }, 500);
      }
    }, [isCCAvailable, availableCCLangs]),
  );

  const allowQualityControls = !videojs.browser.IS_ANY_SAFARI || !videoData?.streamingPlaylists?.length;

  return (
    <View style={styles.container}>
      <VideoControlsOverlay
        isLoading={isLoadingData}
        isWaitingForLive={isWaitingForLive}
        isLiveVideo={videoData?.isLive}
        videoLinkProps={{ backend, url: viewUrl }}
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
        channel={channel}
        handleVolumeControl={handleVolumeControl}
        volume={playbackStatus.isMuted ? 0 : playbackStatus.volume * 100}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        handleOpenDetails={handleOpenDetails}
        handleShare={handleShare}
        handleOpenSettings={handleOpenSettings}
        handleSetSpeed={handleSetSpeed}
        speed={playbackStatus.rate}
        selectedQuality={selectedQuality}
        handleSetQuality={allowQualityControls ? handleSelectQuality : undefined}
        isWebAirPlayAvailable={isAirPlayAvailable}
        isChromeCastAvailable={isChromeCastAvailable}
        handleLoadGoogleCastMedia={handleCreateSession}
        handleToggleCC={handleToggleCC}
        isCCAvailable={isCCAvailable}
        selectedCCLang={selectedCCLang}
        setSelectedCCLang={handleSetCCLang}
        isCCVisible={isCCShown}
        hlsAutoQuality={hlsResolution}
        isDownloadAvailable={videoData?.downloadEnabled}
      >
        {isChromecastConnected && (
          <View style={styles.chromecastOverlay}>
            <IcoMoonIcon color={colors.white80} name="Chromecast" size={72} />
          </View>
        )}
        {isWaitingForLive ? (
          <View style={{ flex: 1, paddingTop: top, width: "100%" }}>
            <Image
              source={{ uri: `https://${backend}${videoData?.previewPath}` }}
              resizeMode="contain"
              style={styles.liveStreamPoster}
            />
            <View
              style={[
                styles.liveStreamOfflineOverlay,
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
          <div
            style={{ cursor: "pointer", position: "fixed" }}
            ref={videoRef}
            data-testid={`${testID}-video-playback`}
          />
        )}
        {isMobile && isControlsVisible && <View style={styles.opacityOverlay} />}
      </VideoControlsOverlay>
    </View>
  );
};

export default VideoView;
