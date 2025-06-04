import { PeertubeInstance } from "./models";
import { AxiosInstanceBasedApi } from "./axiosInstance";
import { handleAxiosErrorWithRetry } from "./errorHandler";
import { ServerConfig } from "@peertube/peertube-types";

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

  /**
   * Get "Instance server config" info
   */
  async getInstanceConfig(instanceURL: string): Promise<ServerConfig> {
    try {
      const response = await this.instance.get<ServerConfig>("config", {
        baseURL: `https://${instanceURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "instance config");
    }
  }
}

export const InstanceInformationApiImpl = new InstanceInformationApi();
