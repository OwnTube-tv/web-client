import * as testData from "../testData.json";
import type { Video, Category, SOURCES } from "../types";

class VideoService {
  private videos: Video[] = [];
  private categories: Category[] = [];

  public getVideoCategoryLabels(): string[] {
    return this.categories.map(({ label }) => label);
  }

  public completeThumbnailUrls(sourceUrl: SOURCES): Video[] {
    return this.videos.map((video) => ({
      ...video,
      thumbnailUrl: `${sourceUrl}${video.thumbnailPath}`,
    }));
  }

  public getVideosForCategory(categoryLabel: string): Video[] {
    return this.videos.filter((video) => video.category.label === categoryLabel);
  }

  public loadVideosFromJson(): void {
    const data = testData;
    this.videos = data.data;
    const uniqueCategories: Category[] = Array.from(new Set(this.videos.map((video) => video.category.label))).map(
      (label, index) => ({ id: index + 1, label }),
    );
    this.categories = uniqueCategories;
  }
}

export default VideoService;
