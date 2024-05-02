import * as testData from "../testData.json";
import type { Video, Category, SOURCES } from "../types";
import { PeertubeVideosApi } from "./peertubeVideosApi";

class VideoService {
  private videos: Video[] = [];
  private videosLoaded: Promise<void>;
  private categories: Category[] = [];

  constructor(useTestData: boolean = false) {
    if (useTestData) {
      this.videosLoaded = this.loadVideosFromJson();
    } else {
      this.videosLoaded = this.loadVideosFromApi();
    }
  }

  public async getVideoCategoryLabels(): Promise<string[]> {
    await this.videosLoaded;
    return this.categories.map(({ label }) => label);
  }

  public async completeThumbnailUrls(sourceUrl: SOURCES): Promise<Video[]> {
    await this.videosLoaded;
    return this.videos.map((video) => ({
      ...video,
      thumbnailUrl: `${sourceUrl}${video.thumbnailPath}`,
    }));
  }

  public async getVideosForCategory(categoryLabel: string): Promise<Video[]> {
    await this.videosLoaded;
    return this.videos.filter((video) => video.category.label === categoryLabel);
  }

  private extractCategories(videos: Video[]) {
    const uniqueCategories: Category[] = Array.from(new Set(videos.map((video) => video.category.label))).map(
      (label, index) => ({ id: index + 1, label }),
    );
    this.categories = uniqueCategories;
  }

  private async loadVideosFromJson(): Promise<void> {
    const data = testData;
    this.videos = data.data;
    this.extractCategories(this.videos);
  }

  private async loadVideosFromApi(): Promise<void> {
    const api = new PeertubeVideosApi("peertube2.cpy.re");
    this.videos = await api.getVideos();
    this.extractCategories(this.videos);
  }
}

export default VideoService;
