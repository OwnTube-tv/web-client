
import React, { useState, useEffect } from 'react';
import { Video } from '../VideoTypes';
import VideoService from './videoServices';


interface Category {
  id: number;
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
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://peertube2.cpy.re/api/v1/videos');

        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.statusText}`);
        }

        const responseData = await response.json();
        const videos = responseData.data || [];
        const categories = videos.map((video: Video) => video.category);

        console.log('API Response:', responseData);
        console.log('Videos:', videos);
        console.log('Categories:', categories);

        setState({ videos, categories, error: null });
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
  const { videos, error } = useVideoService();
  
  const videoService = new VideoService();

  // Fetch videos
  videoService.fetchVideos()
    .then(() => {
      // Use VideoService methods in your React components
      const categoryLabels = videoService.getVideoCategoryLabels();
      console.log('Category Labels:', categoryLabels);
  
      const videosForCategory = videoService.getVideosForCategory(categoryLabels[0]);
      console.log('Videos for Category:', videosForCategory);
    })
    .catch((error) => {
      console.error('Error fetching videos:', error.message);
    });
  console.log('Videos in component:', videos); // Log the videos in the component
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Video List</h1>
      <ul>
        {videos.length > 0 ? (
          videos.map((video) => {
            // Log video details to console
            console.log('Video ID:', video.id);
            console.log('Video Name:', video.name);
            console.log('Category ID:', video.category.id);
            console.log('Category Label:', video.category.label);
            console.log('Thumbnail Path:', video.thumbnailPath);
  
            return (
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
                  <img src={"https://peertube2.cpy.re" + video.thumbnailPath} alt={video.name}/>
                </div>
                <div>
                </div>
              </li>
            );
          })
        ) : (
          <p>Video List Loading</p>
        )}
      </ul>
    </div>
  );
};

export default VideoDataService;
