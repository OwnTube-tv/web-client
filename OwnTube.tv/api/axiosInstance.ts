import axios, { AxiosInstance } from "axios";

export abstract class AxiosInstanceBasedApi {
  protected constructor(debugLogging: boolean = false) {
    this.createAxiosInstance();
    this.debugLogging = debugLogging;
  }

  debugLogging: boolean = false;
  // Our Axios instance, https://axios-http.com/docs/instance
  instance!: AxiosInstance;

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
}
