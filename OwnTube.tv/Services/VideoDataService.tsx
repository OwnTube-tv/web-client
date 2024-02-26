import React, { useState, useEffect } from "react";
import VideoService from "./videoServices"; // Import the CategoryLabel interface

interface Video {
  id: number;
  name: string;
  category: { id: number | null; label: string };
  thumbnailPath: string;
  thumbnailUrl?: string;
}

interface VideoServiceState {
  videos: Video[];
  categories: string[];
  error: string | null;
}

const useVideoService = () => {
  const [state, setState] = useState<VideoServiceState>({
    videos: [],
    categories: [],
    error: null,
  });

  useEffect(() => {
    const videoService = new VideoService();

    const fetchVideos = async () => {
      try {
        // Use VideoService methods to get data
        videoService.loadVideosFromJson();
        const categoryLabels = videoService.getVideoCategoryLabels();
        const videosWithThumbnails = videoService.completeThumbnailUrls();
        setState({
          videos: videosWithThumbnails,
          categories: categoryLabels,
          error: null,
        });
      } catch (error: any) {
        console.error("Error fetching videos:", error.message);
        setState((prev) => ({ ...prev, error: error.message }));
      }
    };

    fetchVideos();
  }, []);
  return state;
};

const VideoDataService: React.FC = () => {
  const { videos, categories, error } = useVideoService();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Display Category Labels */}
      {categories.map((category) => (
        <div key={category}>
          <h2>Category: {category}</h2>
          <ul>
            {videos
              .filter((video) => video.category.label === category)
              .map((video) => (
                <li key={video.id}>
                  <div>
                    <strong>ID:</strong> {video.id}
                  </div>
                  <div>
                    <strong>Name:</strong> {video.name}
                  </div>
                  <div>
                    <strong>Category ID:</strong> {video.category.id}
                  </div>
                  <div>
                    <strong>Category Label:</strong> {video.category.label}
                  </div>
                  <div>
                    <img src={video.thumbnailUrl} alt={video.name} />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default VideoDataService;
