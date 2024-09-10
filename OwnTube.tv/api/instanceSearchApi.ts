import { PeertubeInstance } from "./models";
import { AxiosInstanceBasedApi } from "./axiosInstance";
import { handleAxiosErrorWithRetry } from "./errorHandler";

export class InstanceSearchApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }
  // Common query parameters for fetching a list of instances
  private readonly commonQueryParams = {
    start: 0,
    count: 1000,
    sort: "createdAt",
  };

  /**
   * Get up to 1000 instances
   */
  async searchInstances(): Promise<{ data: Array<PeertubeInstance> }> {
    try {
      const response = await this.instance.get("instances", {
        params: this.commonQueryParams,
        baseURL: "https://instances.joinpeertube.org/api/v1",
      });
      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "Sepia instances");
    }
  }
}

export const InstanceSearchServiceImpl = new InstanceSearchApi();
