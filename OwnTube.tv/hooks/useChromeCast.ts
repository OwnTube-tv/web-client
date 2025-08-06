import { Video } from "@peertube/peertube-types";
import { useEffect, useRef, useState } from "react";
import Player from "video.js/dist/types/player";
import { PlaybackStatus } from "../components/VideoView/VideoView.web";
import { CustomPostHogEvents, CustomPostHogExceptions } from "../diagnostics/constants";
import { useCustomDiagnosticsEvents } from "../diagnostics/useCustomDiagnosticEvents";
import { getHumanReadableDuration } from "../utils";

interface UseChromeCastProps {
  uri?: string;
  videoData?: Video;
  playerRef: React.RefObject<Player>;
  updatePlaybackStatus: (status: Partial<PlaybackStatus>) => void;
  isPlayingRef: React.MutableRefObject<boolean>;
}

export const useChromeCast = ({
  uri,
  videoData,
  playerRef,
  updatePlaybackStatus,
  isPlayingRef,
}: UseChromeCastProps) => {
  const [isChromecastConnected, setIsChromecastConnected] = useState(false);
  const [isChromeCastAvailable, setIsChromeCastAvailable] = useState(false);
  const isChromecastConnectedRef = useRef(false);
  const { captureDiagnosticsEvent, captureError } = useCustomDiagnosticsEvents();

  const handleLoadGoogleCastMedia = () => {
    const castSession = window.cast?.framework?.CastContext.getInstance().getCurrentSession();
    if (!castSession || isChromecastConnectedRef.current || !window.chrome.cast || !uri) return;

    const mediaType = Number(videoData?.streamingPlaylists?.length) > 0 ? "application/x-mpegurl" : "video/mp4";
    const mediaInfo = new window.chrome.cast.media.MediaInfo(uri, mediaType);
    const request = new window.chrome.cast.media.LoadRequest({
      ...mediaInfo,
      ...(Number(videoData?.streamingPlaylists?.length) > 0
        ? {
            hlsSegmentFormat: "aac",
            hlsVideoSegmentFormat: "fmp4",
          }
        : {}),
    });
    request.currentTime = playerRef.current?.currentTime() || 0;
    request.playbackRate = playerRef.current?.playbackRate() || 1;
    const isPaused = Boolean(playerRef.current?.paused());
    request.autoplay = !isPaused;

    castSession
      .loadMedia(request)
      .then(() => {
        isChromecastConnectedRef.current = true;
        captureDiagnosticsEvent(CustomPostHogEvents.ChromecastStarted);
      })
      .catch((error: Error) => {
        console.error("Error loading media:", error);
        captureError(error, CustomPostHogExceptions.ChromecastError);
      });

    playerRef.current?.pause();
    updatePlaybackStatus({ isPlaying: !isPaused });
  };

  const handlePlayPause = () => {
    if (isChromecastConnectedRef.current) {
      const castSession = window.cast?.framework?.CastContext.getInstance().getCurrentSession();
      if (castSession && chrome.cast) {
        const player = castSession.getMediaSession();
        if (player?.playerState === "PAUSED") {
          player.play(
            new chrome.cast.media.PlayRequest(),
            () => {},
            (error) => {
              console.error("Error playing media:", error);
              captureError(error, CustomPostHogExceptions.ChromecastError);
            },
          );
        } else {
          player?.pause(
            new chrome.cast.media.PauseRequest(),
            () => {},
            (error) => {
              console.error("Error pausing media:", error);
              captureError(error, CustomPostHogExceptions.ChromecastError);
            },
          );
        }
      }
      return true;
    }
    return false;
  };

  const handleSeek = (position: number) => {
    if (isChromecastConnectedRef.current) {
      const castSession = window.cast?.framework?.CastContext.getInstance().getCurrentSession();
      if (castSession && chrome.cast) {
        const player = castSession.getMediaSession();
        const seekRequest = new chrome.cast.media.SeekRequest();
        seekRequest.currentTime = position;
        player?.seek(
          seekRequest,
          () => {},
          (error) => {
            console.error("Error seeking media:", error);
            captureError(error, CustomPostHogExceptions.ChromecastError);
          },
        );
      }
    }
  };

  const handleVolume = (volume: number) => {
    if (isChromecastConnectedRef.current) {
      const castSession = window.cast?.framework?.CastContext.getInstance().getCurrentSession();
      if (castSession) {
        castSession.setVolume(volume);
      }
    }
  };

  const handleMute = (muted: boolean) => {
    if (isChromecastConnectedRef.current) {
      const castSession = window.cast?.framework?.CastContext.getInstance().getCurrentSession();
      if (castSession) {
        castSession.setMute(muted);
      }
    }
  };

  useEffect(() => {
    if (!window.cast) return;

    const player = new window.cast.framework.RemotePlayer();
    const remotePlayerController = new window.cast.framework.RemotePlayerController(player);

    remotePlayerController.addEventListener(
      window.cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
      ({ value }) => {
        if (typeof value === "number" && isChromecastConnectedRef.current) {
          updatePlaybackStatus({
            position: Math.floor(value),
            didJustFinish: Math.floor(value) === playerRef.current?.duration(),
          });
          playerRef.current?.tech().setCurrentTime(value);
        }
      },
    );
    remotePlayerController.addEventListener(
      window.cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
      ({ value }) => {
        if (typeof value === "number") {
          updatePlaybackStatus({
            volume: value,
          });
        }
      },
    );
    remotePlayerController.addEventListener(
      window.cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
      ({ value }) => {
        updatePlaybackStatus({
          isPlaying: !value,
        });
        if (value) {
          captureDiagnosticsEvent(CustomPostHogEvents.Pause, {
            currentTime: getHumanReadableDuration((playerRef.current?.currentTime() || 0) * 1000),
          });
        } else {
          captureDiagnosticsEvent(CustomPostHogEvents.Play, {
            currentTime: getHumanReadableDuration((playerRef.current?.currentTime() || 0) * 1000),
          });
        }
      },
    );
  }, []);

  useEffect(() => {
    const checkCastAvailability = () => {
      if (window.chrome && window.cast && window.cast.framework) {
        initializeCastApi();
      } else {
        window["__onGCastApiAvailable"] = (isAvailable) => {
          if (isAvailable) {
            initializeCastApi();
          }
        };
      }
    };

    checkCastAvailability();
  }, []);

  const initializeCastApi = () => {
    const castContext = window.cast.framework.CastContext.getInstance();

    setIsChromeCastAvailable(true);

    castContext.setOptions({
      receiverApplicationId: window.chrome.cast?.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: window.chrome.cast?.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    castContext.addEventListener(window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (event) => {
      if (event.sessionState === window.cast.framework.SessionState.SESSION_STARTED) {
        handleLoadGoogleCastMedia();
        isChromecastConnectedRef.current = true;
        setIsChromecastConnected(true);
      } else if (event.sessionState === window.cast.framework.SessionState.SESSION_ENDED) {
        isChromecastConnectedRef.current = false;
        setIsChromecastConnected(false);
        if (isPlayingRef.current) {
          playerRef.current?.play();
        }
        captureDiagnosticsEvent(CustomPostHogEvents.ChromecastStopped);
        updatePlaybackStatus({ volume: playerRef.current?.volume() || 1 });
      }
      if (event.errorCode) {
        captureError(new Error(`Chromecast error: ${event.errorCode}`), CustomPostHogExceptions.ChromecastError);
      }
    });
  };

  const handleCreateSession = () => {
    const context = window.cast.framework.CastContext.getInstance();
    context
      .requestSession()
      .then(handleLoadGoogleCastMedia)
      .catch((error) => {
        console.error("Error creating Chromecast session:", error);
        captureError(error, CustomPostHogExceptions.ChromecastError);
      });
  };

  return {
    isChromecastConnected,
    isChromeCastAvailable,
    handlePlayPause,
    handleSeek,
    handleVolume,
    handleMute,
    handleCreateSession,
    isChromecastConnectedRef,
  };
};
