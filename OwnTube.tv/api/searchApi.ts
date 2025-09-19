import { Video, VideosSearchQuery } from "@peertube/peertube-types";
import { AxiosInstanceBasedApi } from "./axiosInstance";
import { handleAxiosErrorWithRetry } from "./errorHandler";
import { SEARCH_DEFAULTS } from "./sharedConstants";

/**
 * PeerTube Users API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Search
 */
export class SearchApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }

  /**
   * Search for videos
   */
  async searchVideos(baseURL: string, params: VideosSearchQuery): Promise<{ data: Video[]; total: number }> {
    try {
      const response = await this.instance.get("search/videos", {
        params: { ...SEARCH_DEFAULTS, ...params },
        baseURL: `https://${baseURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "video search");
    }
  }
}

export const SearchApiImpl = new SearchApi();
