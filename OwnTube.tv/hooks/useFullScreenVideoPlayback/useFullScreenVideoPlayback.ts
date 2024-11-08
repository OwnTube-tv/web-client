import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { OrientationLock } from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";

const useFullScreenVideoPlayback = () => {
  const isWeb = Platform.OS === "web";
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (isWeb) {
      const player = document?.getElementById("video-container");
      const video = document?.getElementsByClassName("vjs-tech")[0];

      if (!document.fullscreenElement) {
        if (player?.requestFullscreen) {
          player.requestFullscreen().catch((err) => {
            alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
          });
        } else if (video?.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } else {
        document?.exitFullscreen?.();
      }
    } else {
      if (isFullscreen) {
        setIsFullscreen(false);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT).catch(console.error);
        await NavigationBar.setVisibilityAsync("visible");
      } else {
        setIsFullscreen(true);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(console.error);
        await NavigationBar.setVisibilityAsync("hidden");
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChangeWeb = () => {
      setIsFullscreen(!!document?.fullscreenElement);
    };

    if (isWeb) {
      window?.addEventListener("fullscreenchange", handleFullscreenChangeWeb);
    }

    return () => {
      if (isWeb) {
        window?.removeEventListener("fullscreenchange", handleFullscreenChangeWeb);
        return;
      }

      ScreenOrientation.lockAsync(OrientationLock.DEFAULT);
      NavigationBar.setVisibilityAsync("visible");
    };
  }, [isWeb]);

  return { isFullscreen, toggleFullscreen };
};

export default useFullScreenVideoPlayback;
