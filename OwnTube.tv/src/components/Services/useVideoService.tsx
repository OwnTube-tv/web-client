import { useState, useEffect } from 'react';
import VideoService from './videoServices';
import { Video } from '../VideoTypes';

interface VideoServiceState {
  videos: Video[];
  categories: string[];
  error: string | null;
  isLoading: boolean;
}

const useVideoService = (): VideoServiceState => {
  const [state, setState] = useState<VideoServiceState>({
    videos: [],
    categories: [],
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const videoService = new VideoService();

    try {
      videoService.loadVideosFromJson();
      const videosWithThumbnails = videoService.completeThumbnailUrls();
      const categoryLabels = videoService.getVideoCategoryLabels();

      setState({
        videos: videosWithThumbnails,
        categories: categoryLabels,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : String(error),
        isLoading: false,
      }));
    }
  }, []);

  return state;
};

export default useVideoService;
