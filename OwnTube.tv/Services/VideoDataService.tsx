import React, { useState, useEffect } from 'react';
import VideoService from './videoServices'; // Import the CategoryLabel interface

interface Video {
  id: number;
  name: string;
  category: { id: number | null; label: string };
  thumbnailPath: string;
}

interface Category {
  id: number | null;
  label: string;
}

interface VideoServiceState {
  videos: Video[];
  categories: Category[];
  error: string | null;
}

const useVideoService = () => {
  const [state, setState] = useState<VideoServiceState>({ videos: [], categories: [], error: null });

  useEffect(() => {
    const videoService = new VideoService();

    const fetchVideos = async () => {
      try {
        await videoService.loadVideosFromJson(); // Use the new method to load videos from local JSON

        // Use VideoService methods to get data
        videoService.loadVideosFromJson();
        const categoryLabels = videoService.extractCategoryLabels();
        const videosWithThumbnails = videoService.completeThumbnailUrls();
        const videos = videoService.getVideosForCategory(categoryLabels[2]); // Replace with the desired category label
        setState({ videos: videosWithThumbnails, categories: categoryLabels, error: null });
      } catch (error: any) {
        console.error('Error fetching videos:', error.message);
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
      <h1>Video List</h1>
      <ul>
        {videos.length > 0 ? (
          videos.map((video) => (
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
                <img src={video.thumbnailPath} alt={video.name}/>
              </div>
            </li>
          ))
        ) : (
          <p>Video List Loading</p>
        )}
      </ul>

      {/* Display Category Labels */}
      <div>
        <h2>Category Labels</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <div>
                <strong>ID:</strong> {category.id}
              </div>
              <div>
                <strong>Label:</strong> {category.label}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoDataService;
