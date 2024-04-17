import * as testData from "../testData.json";
import { Video, CategoryLabel }  from '../VideoTypes'

class VideoService {
  private videos: Video[] = [];
  private categories: CategoryLabel[] = [];
  private readonly baseThumbnailUrl = "https://peertube2.cpy.re";

  constructor() {
    this.loadVideosFromJson();
  }

  public getVideoCategoryLabels(): string[] {
    return this.categories.map(({ label }) => label);
  }

  public completeThumbnailUrls(): Video[] {
    return this.videos.map((video) => ({
      ...video,
      thumbnailUrl: `${this.baseThumbnailUrl}${video.thumbnailPath}`,
    }));
  }

  public getVideosForCategory(categoryLabel: string): Video[] {
    return this.videos.filter((video) => video.category.label === categoryLabel);
  }

  public loadVideosFromJson(): void {
    const data = testData;
    this.videos = data.data;
    const uniqueCategories: CategoryLabel[] = Array.from(new Set(this.videos.map((video) => video.category.label))).map(
      (label, index) => ({ id: index + 1, label }),
    );
    this.categories = uniqueCategories;
  }
}

export default VideoService;
