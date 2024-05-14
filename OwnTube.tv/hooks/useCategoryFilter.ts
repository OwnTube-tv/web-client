import { useMemo } from "react";
import { useVideoServiceContext } from "../contexts";
import type { VideoCategory } from "../types";

export const useCategoryFilter = () => {
  const { videos, categories } = useVideoServiceContext();

  const videosByCategory: VideoCategory[] = useMemo(
    () =>
      categories.map((category, index) => ({
        id: index,
        label: category,
        videos: videos.filter((video) => video.category.label === category),
      })),
    [videos, categories],
  );

  const isEmpty = !categories.length || !videos.length;

  return { videosByCategory, isEmpty };
};
