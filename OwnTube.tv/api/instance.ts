import axios, { AxiosInstance } from "axios";
import { PeertubeInstance } from "./models";
import i18n from "../i18n";

export class InstanceInformationApi {
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
      throw new Error(i18n.t("errors.failedToFetchInstanceInfo", { error: (error as Error).message }));
    }
  }
}

export const InstanceInformationApiImpl = new InstanceInformationApi();
