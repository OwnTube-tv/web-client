import * as testData from "../testData.json";

interface Video {
  readonly id: number;
  readonly name: string;
  readonly category: { id: number | null; label: string };
  readonly thumbnailPath: string;
  readonly description?: string | null;
}

interface Category {
  readonly id: number;
  readonly label: string;
}

const BaseThumbnailUrl = "https://peertube2.cpy.re";

class VideoService {
  private videos: Video[] = [];
  private categories: Category[] = [];

  constructor() {
    this.loadVideosFromJson();
  }

  public getVideoCategoryLabels(): string[] {
    return this.categories.map(({ id, label }) => label);
  }

  public completeThumbnailUrls(): Video[] {
    return this.videos.map((video) => ({
      ...video,
      thumbnailUrl: `${BaseThumbnailUrl}${video.thumbnailPath}`,
    }));
  }

  public getVideosForCategory(categoryLabel: string): Video[] {
    return this.videos.filter(
      (video) => video.category.label === categoryLabel
    );
  }

  public loadVideosFromJson(): void {
    const data = testData;
    this.videos = data.data;
    const uniqueCategories: Category[] = Array.from(
      new Set(this.videos.map((video) => video.category.label))
    ).map((label, index) => ({ id: index + 1, label }));
    this.categories = uniqueCategories;
  }
}

export default VideoService;
