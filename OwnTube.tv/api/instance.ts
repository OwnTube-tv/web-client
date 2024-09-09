import { PeertubeInstance } from "./models";
import { AxiosInstanceBasedApi } from "./axiosInstance";
import { handleAxiosErrorWithRetry } from "./errorHandler";

export class InstanceInformationApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }

  /**
   * Get "About instance" info
   */
  async getInstanceInfo(instanceURL: string): Promise<{ instance: PeertubeInstance }> {
    try {
      const response = await this.instance.get("config/about", {
        baseURL: `https://${instanceURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "instance info");
    }
  }
}

export const InstanceInformationApiImpl = new InstanceInformationApi();
