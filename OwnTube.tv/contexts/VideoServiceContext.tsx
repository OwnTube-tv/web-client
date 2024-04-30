import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import VideoService from "../lib/videoServices";
import { SOURCES, Video } from "../types";
import { useAppConfigContext } from "./AppConfigContext";

interface IVideoServiceState {
  videos: Video[];
  categories: string[];
  error: string | null;
}

const VideoServiceContext = createContext<IVideoServiceState>({
  videos: [],
  categories: [],
  error: null,
});

export const VideoServiceContextProvider = ({ children }: PropsWithChildren) => {
  const { source, isSourceFetchedFromStorage } = useAppConfigContext();

  const [state, setState] = useState<IVideoServiceState>({
    videos: [],
    categories: [],
    error: null,
  });

  useEffect(() => {
    if (!isSourceFetchedFromStorage) {
      return;
    }

    const videoService = new VideoService();

    const fetchVideos = async () => {
      try {
        videoService.loadVideosFromJson();
        const categoryLabels = videoService.getVideoCategoryLabels();
        const videosWithThumbnails = videoService.completeThumbnailUrls(source as SOURCES);
        setState({
          videos: videosWithThumbnails,
          categories: categoryLabels,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching videos:", (error as Error).message);
        setState((prev) => ({ ...prev, error: (error as Error).message }));
      }
    };

    fetchVideos();
  }, [source, isSourceFetchedFromStorage]);

  return <VideoServiceContext.Provider value={state}>{children}</VideoServiceContext.Provider>;
};

export const useVideoServiceContext = () => useContext(VideoServiceContext);
