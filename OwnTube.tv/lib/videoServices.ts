import * as testData from "../testData.json";
import type { Video, Category, SOURCES } from "../types";
import { PeertubeVideosApi } from "./peertubeVideosApi";

type DataSource = 'testData.json' | string;

type VideosByHost = {
  [key: string]: Video[]
}

type CategoriesByHost = {
  [key: string]: Category[];
}

type VideosLoadedByHost = {
  [key: string]: Promise<Video[]>
}

class VideoService {
  private currentDataSource: DataSource;
  private videos: VideosByHost;
  private categories: CategoriesByHost;
  private videosLoaded: VideosLoadedByHost;

  constructor(initialDataSource: DataSource) {
    this.currentDataSource = initialDataSource;
    this.videos = {};
    this.categories = {};
    this.videosLoaded = {};
  }

  public setDataSource(dataSource: DataSource) {
    this.currentDataSource = dataSource;
  }

  private async getVideosFromJson(thumbnailHost: string): Promise<Video[]> {
    const data = testData;
    const dataSourceVideos = data.data;
    const videosWithThumbnailUrls = dataSourceVideos.map((video) => ({
      ...video,
      thumbnailUrl: `https://${thumbnailHost}${video.thumbnailPath}`,
    }));
    return videosWithThumbnailUrls;
  }

  private async getVideosFromApi(peertubeHost: string): Promise<Video[]> {
    const peertubeVideosApi = new PeertubeVideosApi(peertubeHost);
    const dataSourceVideos = await peertubeVideosApi.getVideos();
    const videosWithThumbnailUrls = dataSourceVideos.map((video) => ({
      ...video,
      thumbnailUrl: `https://${peertubeHost}${video.thumbnailPath}`,
    }));
    return videosWithThumbnailUrls;
  }

  private getVideosFromDataSource(dataSource: DataSource): Promise<Video[]> {
    if (dataSource === 'testData.json') {
      return this.getVideosFromJson('peertube2.cpy.re');
    } else {
      return this.getVideosFromApi(dataSource);
    }
  }

  private getUniqueCategories(videos: Video[]): Category[] {
    const uniqueCategories: Category[] = Array.from(new Set(videos.map((video) => video.category.label))).map(
      (label, index) => ({ id: index + 1, label }),
    );
    return uniqueCategories;
  }

  private async awaitVideosAndCategoriesFromDataSource(dataSource: DataSource): Promise<void> {
    if (Object.keys(this.videos).includes(dataSource)) {
      return;
    }

    if (!Object.keys(this.videosLoaded).includes(dataSource)) {
      this.videosLoaded[dataSource] = this.getVideosFromDataSource(dataSource);
    }

    const videos = await this.videosLoaded[dataSource];
    if (!videos.length) {
      throw new Error(`No videos in ${JSON.stringify(videos)}`);
    }

    this.videos[dataSource] = videos;
    this.categories[dataSource] = this.getUniqueCategories(videos);
  }

  public async getVideoCategoryLabels(): Promise<string[]> {
    await this.awaitVideosAndCategoriesFromDataSource(this.currentDataSource);
    return this.categories[this.currentDataSource].map(({ label }) => label);
  }

  public async getVideosForCategory(categoryLabel: string): Promise<Video[]> {
    await this.awaitVideosAndCategoriesFromDataSource(this.currentDataSource);
    return this.videos[this.currentDataSource].filter((video) => video.category.label === categoryLabel);
  }
}

export default VideoService;
