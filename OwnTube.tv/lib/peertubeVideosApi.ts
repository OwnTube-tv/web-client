import axios, { AxiosInstance } from "axios";

// Subset of the backend API query parameters, https://github.com/Chocobozzz/PeerTube/blob/develop/packages/models/src/search/videos-common-query.model.ts#L41
interface GetVideosQueryParams {
  start?: number;
  count?: number;
  sort?: string;
  nsfw?: "true" | "false" | "both";
  isLive?: boolean;
  isLocal?: boolean;
  hasHLSFiles?: boolean;
  skipCount?: boolean;
}

// Subset of a video object from the PeerTube backend API, https://github.com/Chocobozzz/PeerTube/blob/develop/server/core/models/video/video.ts#L460
interface GetVideosVideo {
  id: number;
  name: string;
  category: { id: number | null; label: string };
  description: string | null;
  thumbnailPath: string;
}

/**
 * Get videos from the PeerTube backend `/api/v1/videos` API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Video/operation/getVideos
 */
export class PeertubeVideosApi {
  constructor(peertubeHost: string, maxChunkSize: number = 100, debugLogging: boolean = false) {
    this.createAxiosInstance(peertubeHost);
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
  private readonly commonQueryParams: GetVideosQueryParams = {
    start: 0,
    count: 15,
    sort: "createdAt",
    nsfw: "false",
    isLocal: true,
    isLive: false,
    hasHLSFiles: true,
    skipCount: false,
  };

  // Our Axios instance, https://axios-http.com/docs/instance
  private instance!: AxiosInstance;

  /**
   * Create the Axios instance with our base URL, app identifier, and request/response interceptors
   *
   * @param peertubeHost - The PeerTube instance host
   */
  private createAxiosInstance(peertubeHost: string): void {
    const baseURL = `https://${peertubeHost}/api/v1/`;
    this.instance = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "OwnTube.tv/1.0.0 (https://app.owntube.tv)",
      },
    });

    this.instance.interceptors.request.use((config) => {
      if (this.debugLogging) {
        console.debug(`Requesting '${baseURL}${config.url}' with '${JSON.stringify(config.params)}'`);
      }
      return config;
    });
    this.instance.interceptors.response.use((response) => {
      if (this.debugLogging) {
        console.debug(
          `Received response with status ${response.status} and data '${JSON.stringify(response.data).substring(0, 255)}...'`,
        );
      }
      return response;
    });
  }

  /**
   * Get total number of "local", "non-live", and "Safe-For-Work" videos from the PeerTube instance
   *
   * @returns The total number of videos
   */
  async getTotalVideos(): Promise<number> {
    try {
      const response = await this.instance.get("videos", { params: { ...this.commonQueryParams, count: 0 } });
      return response.data.total as number;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch total number of videos from PeerTube API: ${(error as Error).message}`);
    }
  }

  /**
   * Get "local", "non-live", and "Safe-For-Work" videos from the PeerTube instance
   *
   * @param [limit=15] - The maximum number of videos to fetch
   * @returns A list of videos, with a lot of additional details from the API removed
   */
  async getVideos(limit: number = 15): Promise<GetVideosVideo[]> {
    let rawVideos: Required<GetVideosVideo>[] = [];
    if (limit <= this.maxChunkSize) {
      try {
        rawVideos = (await this.instance.get("videos", { params: { ...this.commonQueryParams, count: limit } })).data
          .data as Required<GetVideosVideo>[];
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

    const videos = rawVideos.map((video) => {
      return {
        id: video.id,
        name: video.name,
        category: video.category,
        description: video.description,
        thumbnailPath: video.thumbnailPath,
      };
    });

    return videos;
  }
}
