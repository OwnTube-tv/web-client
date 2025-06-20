import { AxiosInstanceBasedApi } from "./axiosInstance";
import { handleAxiosErrorWithRetry } from "./errorHandler";
import { OAuthClientLocal } from "@peertube/peertube-types";
import { UserLoginResponse } from "./models";

/**
 * PeerTube Auth API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Session
 */
export class AuthApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }

  /**
   * Get login prerequisites for the instance
   *
   */
  async getLoginPrerequisites(baseURL: string): Promise<OAuthClientLocal> {
    try {
      const response = await this.instance.get("oauth-clients/local", {
        baseURL: `https://${baseURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "loginPrerequisites");
    }
  }

  /**
   * Log in to the instance
   *
   */
  async login(
    baseURL: string,
    data: { grant_type: string; refresh_token?: string; username?: string; password?: string } & OAuthClientLocal,
    otp?: string,
  ): Promise<UserLoginResponse> {
    try {
      const response = await this.instance.post("users/token", data, {
        baseURL: `https://${baseURL}/api/v1`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-peertube-otp": otp || undefined,
        },
      });
      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "login");
    }
  }
}

export const AuthApiImpl = new AuthApi();
