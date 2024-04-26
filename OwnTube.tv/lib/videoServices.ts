import * as testData from "../testData.json";
import { Video, Category } from "../types";
import axios from 'axios'

class VideoService {
  private videos: Video[] = [];
  private categories: Category[] = [];
  private readonly baseThumbnailUrl = "https://peertube2.cpy.re";

  constructor() {
    this.loadVideosFromJson();
    this.loadVideosFromApi();
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
    const uniqueCategories: Category[] = Array.from(new Set(this.videos.map((video) => video.category.label))).map(
      (label, index) => ({ id: index + 1, label }),
    );
    this.categories = uniqueCategories;
  }

  private async loadVideosFromApi(): Promise<void> {
    try {
      const response = await axios.get("https://peertube.example.com/api/v1/videos");
      this.videos = response.data;

    } catch (error) {
      console.error("Error fetching videos from PeerTube API:", error);

    }
  }
}

export default VideoService;
