import axios, { AxiosInstance } from "axios";
import build_info from "../build-info.json";

export const axiosInstance = axios.create({
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "X-App-Identifier": `OwnTube-tv/web-client@${build_info.GITHUB_SHA_SHORT} (https://github.com/${build_info.GITHUB_ACTOR})`,
  },
});

export abstract class AxiosInstanceBasedApi {
  protected constructor(debugLogging: boolean = false) {
    this.attachToAxiosInstance();
    this.debugLogging = debugLogging;
  }

  debugLogging: boolean = false;
  // Our Axios instance, https://axios-http.com/docs/instance
  instance!: AxiosInstance;

  /**
   * Attach to the Axios instance with app identifier and request/response interceptors
   */
  private attachToAxiosInstance(): void {
    this.instance = axiosInstance;
  }
}
