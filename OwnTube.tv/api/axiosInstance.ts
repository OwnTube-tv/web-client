import axios, { AxiosInstance } from "axios";
import build_info from "../build-info.json";

export abstract class AxiosInstanceBasedApi {
  protected constructor(debugLogging: boolean = false) {
    this.createAxiosInstance();
    this.debugLogging = debugLogging;
  }

  debugLogging: boolean = false;
  // Our Axios instance, https://axios-http.com/docs/instance
  instance!: AxiosInstance;

  private getAppIdentifier(): string {
    return `OwnTube-tv/web-client@${build_info.GITHUB_SHA_SHORT} (https://github.com/${build_info.GITHUB_ACTOR})`;
  }

  /**
   * Create the Axios instance with app identifier and request/response interceptors
   */
  private createAxiosInstance(): void {
    this.instance = axios.create({
      withCredentials: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "X-App-Identifier": this.getAppIdentifier(),
      },
    });
  }
}
