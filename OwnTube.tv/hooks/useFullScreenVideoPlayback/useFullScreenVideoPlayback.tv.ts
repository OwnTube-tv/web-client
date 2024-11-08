import { useEffect, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";

const useFullScreenVideoPlayback = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      await NavigationBar.setVisibilityAsync("visible");
    } else {
      setIsFullscreen(true);
      await NavigationBar.setVisibilityAsync("hidden");
    }
  };

  useEffect(() => {
    return () => {
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
};

export default useFullScreenVideoPlayback;
