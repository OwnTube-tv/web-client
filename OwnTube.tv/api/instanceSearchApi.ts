import axios, { AxiosInstance } from "axios";
import { PeertubeInstance } from "./models";
import i18n from "../i18n";

export class InstanceSearchApi {
  private instance!: AxiosInstance;
  constructor() {
    this.createAxiosInstance();
  }

  /**
   * Create the Axios instance with request/response interceptors
   */
  private createAxiosInstance(): void {
    this.instance = axios.create({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
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
      throw new Error(i18n.t("errors.failedToFetchInstances", { error: (error as Error).message }));
    }
  }
}

export const InstanceSearchServiceImpl = new InstanceSearchApi();
