import { AuthSession } from "../store";
import { UserLogin } from "@peertube/peertube-types";

export const parseAuthSessionData = (
  loginResponse: UserLogin & { expires_in: number; refresh_token_expires_in: number },
  backend: string,
  email?: string,
): Partial<AuthSession> => {
  return {
    backend,
    basePath: "/api/v1",
    email,
    twoFactorEnabled: false,
    sessionCreatedAt: new Date().toISOString(),
    sessionUpdatedAt: new Date().toISOString(),
    sessionExpired: false,
    tokenType: loginResponse.token_type,
    accessToken: loginResponse.access_token,
    accessTokenIssuedAt: new Date().toISOString(),
    accessTokenExpiresIn: loginResponse.expires_in,
    refreshToken: loginResponse.refresh_token,
    refreshTokenIssuedAt: new Date().toISOString(),
    refreshTokenExpiresIn: loginResponse.refresh_token_expires_in,
  };
};
