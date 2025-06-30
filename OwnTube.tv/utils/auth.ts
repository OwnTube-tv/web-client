import { AuthSession, useInstanceConfigStore } from "../store";
import { UserLogin } from "@peertube/peertube-types";

export const parseAuthSessionData = (
  loginResponse: UserLogin & { expires_in: number; refresh_token_expires_in: number },
  backend: string,
): Partial<AuthSession> => {
  const { getConfigByBackend } = useInstanceConfigStore.getState();
  const instanceConfig = getConfigByBackend(backend);

  const res = {
    backend,
    basePath: "/api/v1",
    twoFactorEnabled: false,
    sessionCreatedAt: new Date().toISOString(),
    sessionUpdatedAt: new Date().toISOString(),
    sessionExpired: false,
    tokenType: loginResponse.token_type,
    accessToken: loginResponse.access_token,
    accessTokenIssuedAt: new Date().toISOString(),
    accessTokenExpiresIn:
      instanceConfig?.customizations?.loginAccessTokenExpirationOverride ?? loginResponse.expires_in,
    refreshToken: loginResponse.refresh_token,
    refreshTokenIssuedAt: new Date().toISOString(),
    refreshTokenExpiresIn:
      instanceConfig?.customizations?.loginRefreshTokenExpirationOverride ?? loginResponse.refresh_token_expires_in,
  };

  return res;
};
