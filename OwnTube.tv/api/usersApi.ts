import { AxiosInstanceBasedApi } from "./axiosInstance";
import { handleAxiosErrorWithRetry } from "./errorHandler";
import { User } from "@peertube/peertube-types";

/**
 * PeerTube Users API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Users
 */
export class UsersApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }

  /**
   * Get *my* user info
   *
   */
  async getMyUserInfo(baseURL: string): Promise<User> {
    try {
      const response = await this.instance.get("users/me", {
        baseURL: `https://${baseURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "my user info");
    }
  }

  /**
   * Get *my* subscription data on the specified channel
   */
  async getSubscriptionByChannel(baseURL: string, channelHandle: string): Promise<Record<string, boolean>> {
    try {
      const response = await this.instance.get("users/me/subscriptions/exist", {
        baseURL: `https://${baseURL}/api/v1`,
        params: { uris: channelHandle },
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "my channel subscription");
    }
  }
}

export const UsersApiImpl = new UsersApi();
