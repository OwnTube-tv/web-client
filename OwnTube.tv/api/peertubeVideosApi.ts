import axios, { AxiosInstance } from "axios";
import { VideosCommonQuery } from "@peertube/peertube-types";
import { VideoModel } from "@peertube/peertube-types/server/core/models/video/video";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";

// Subset of a video object from the PeerTube backend API, https://github.com/Chocobozzz/PeerTube/blob/develop/server/core/models/video/video.ts#L460
export type GetVideosVideo = Pick<VideoModel, "uuid" | "name" | "description"> & {
  thumbnailPath: string;
  category: { id: number | null; label: string };
};

/**
 * Get videos from the PeerTube backend `/api/v1/videos` API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Video/operation/getVideos
 */
export class PeertubeVideosApi {
  constructor(maxChunkSize: number = 100, debugLogging: boolean = false) {
    this.createAxiosInstance();
    this.maxChunkSize = maxChunkSize;
    this.debugLogging = debugLogging;
  }

  debugLogging: boolean = false;

  private _maxChunkSize!: number;
  set maxChunkSize(value: number) {
    if (!(value > 0 && value <= 100)) {
      throw new Error("The maximum number of videos to fetch in a single request is 100");
    }
    this._maxChunkSize = value;
  }
  get maxChunkSize(): number {
    return this._maxChunkSize;
  }

  // Common query parameters for fetching videos that are classified as "local", "non-live", and "Safe-For-Work"
  private readonly commonQueryParams: VideosCommonQuery = {
    start: 0,
    count: 15,
    sort: "createdAt",
    nsfw: "false",
    isLocal: true,
    isLive: false,
    skipCount: false,
  };

  // Our Axios instance, https://axios-http.com/docs/instance
  private instance!: AxiosInstance;

  /**
   * Create the Axios instance with app identifier and request/response interceptors
   */
  private createAxiosInstance(): void {
    this.instance = axios.create({
      withCredentials: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "User-Agent": "OwnTube.tv/1.0.0 (https://app.owntube.tv)",
      },
    });
  }

  /**
   * Get total number of "local", "non-live", and "Safe-For-Work" videos from the PeerTube instance
   *
   * @param [baseURL] - Selected instance url
   * @returns The total number of videos
   */
  async getTotalVideos(baseURL: string): Promise<number> {
    try {
      const response = await this.instance.get("videos", {
        params: { ...this.commonQueryParams, count: undefined },
        baseURL: `https://${baseURL}/api/v1`,
      });
      return response.data.total as number;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch total number of videos from PeerTube API: ${(error as Error).message}`);
    }
  }

  /**
   * Get "local", "non-live", and "Safe-For-Work" videos from the PeerTube instance
   *
   * @param [baseURL] - Selected instance url
   * @param [limit=15] - The maximum number of videos to fetch
   * @returns A list of videos, with a lot of additional details from the API removed
   */
  async getVideos(baseURL: string, limit: number = 15): Promise<GetVideosVideo[]> {
    let rawVideos: Required<GetVideosVideo>[] = [];
    if (limit <= this.maxChunkSize) {
      try {
        rawVideos = (
          await this.instance.get("videos", {
            params: { ...this.commonQueryParams, count: limit },
            baseURL: `https://${baseURL}/api/v1`,
          })
        ).data.data as Required<GetVideosVideo>[];
      } catch (error: unknown) {
        throw new Error(`Failed to fetch videos from PeerTube API: ${(error as Error).message}`);
      }
    } else {
      let rawTotal = -1;
      let offset = 0;
      while (rawVideos.length < limit) {
        let fetchCount = this.maxChunkSize;
        const maxTotalToBeExceeded = rawTotal !== -1 && offset + this.maxChunkSize > rawTotal;
        if (maxTotalToBeExceeded) {
          fetchCount = rawTotal - offset;
          if (this.debugLogging) {
            console.debug(
              `We would exceed the total available ${rawTotal} videos with chunk size ${this.maxChunkSize}, so fetching only ${fetchCount} videos to reach the total`,
            );
          }
        }
        const maxLimitToBeExceeded = rawVideos.length + fetchCount > limit;
        if (maxLimitToBeExceeded) {
          fetchCount = limit - offset;
          if (this.debugLogging) {
            console.debug(
              `We would exceed max limit of ${limit} videos, so fetching only ${fetchCount} additional videos to reach the limit`,
            );
          }
        }
        try {
          const response = await this.instance.get("videos", {
            params: { ...this.commonQueryParams, count: fetchCount, start: offset },
            baseURL: `https://${baseURL}/api/v1`,
          });
          rawTotal = response.data.total as number;
          if (rawTotal < limit) {
            limit = rawTotal;
          }
          rawVideos = rawVideos.concat(response.data.data as Required<GetVideosVideo>[]);
        } catch (error: unknown) {
          throw new Error(`Failed to fetch videos from PeerTube API: ${(error as Error).message}`);
        }
        offset += fetchCount;
      }
    }

    return rawVideos.map((video) => {
      return {
        uuid: video.uuid,
        name: video.name,
        category: video.category,
        description: video.description,
        thumbnailPath: video.thumbnailPath,
      };
    });
  }

  /**
   * Get data for a specified video
   *
   * @param [baseURL] - Selected instance url
   * @param [id] - Video uuid
   * @returns Video data
   */
  async getVideo(baseURL: string, id: string) {
    try {
      const response = await this.instance.get<Video>(`videos/${id}`, {
        baseURL: `https://${baseURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch videos from PeerTube API: ${(error as Error).message}`);
    }
  }
}

export const ApiServiceImpl = new PeertubeVideosApi();
