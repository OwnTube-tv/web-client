import axios, { AxiosInstance } from "axios";
import { useAuthSessionStore } from "../store";
import { parseISOToEpoch } from "../utils";
import { parseAuthSessionData } from "../utils/auth";
import { OAuthClientLocal, UserLogin } from "@peertube/peertube-types";
import { APP_IDENTIFIER } from "./constants";

export const axiosInstance = axios.create({
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "X-App-Identifier": APP_IDENTIFIER,
  },
});

const controller = new AbortController();

const REFRESH_LOCKS: Record<string, boolean> = {};

const refreshAccessToken = async (backend: string, refreshToken: string) => {
  const lock = REFRESH_LOCKS[backend];

  if (lock) {
    return null;
  }

  REFRESH_LOCKS[backend] = true;

  try {
    const { data: prerequisites } = await axios.get<OAuthClientLocal>(`https://${backend}/api/v1/oauth-clients/local`);
    if (!prerequisites) throw new Error("Missing OAuth client credentials");

    const { data: loginResponse } = await axios.post<
      UserLogin & { expires_in: number; refresh_token_expires_in: number }
    >(
      `https://${backend}/api/v1/users/token`,
      {
        ...prerequisites,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return loginResponse;
  } finally {
    delete REFRESH_LOCKS[backend];
  }
};

axiosInstance.interceptors.request.use(async (config) => {
  const backend = config.baseURL?.replace("/api/v1", "").replace("https://", "");

  const { session, updateSession } = useAuthSessionStore.getState();

  if (!backend || !session) return config;

  const {
    basePath,
    tokenType,
    accessToken,
    accessTokenIssuedAt,
    accessTokenExpiresIn,
    refreshToken,
    refreshTokenIssuedAt,
    refreshTokenExpiresIn,
    sessionExpired,
  } = session;

  const now = Math.floor(Date.now() / 1000);
  const accessIssued = parseISOToEpoch(accessTokenIssuedAt);
  const accessValidUntil = accessIssued + accessTokenExpiresIn - 10;
  const accessTokenValid = accessIssued <= now && now < accessValidUntil;

  const refreshIssued = parseISOToEpoch(refreshTokenIssuedAt);
  const refreshValidUntil = refreshIssued + refreshTokenExpiresIn - 10;
  const refreshTokenValid = refreshIssued <= now && now < refreshValidUntil;

  const shouldAttachAccessToken = Boolean(
    session &&
      session.backend === backend &&
      config.baseURL?.startsWith(`https://${backend}${basePath ?? ""}`) &&
      !sessionExpired &&
      accessTokenValid,
  );

  if (shouldAttachAccessToken) {
    config.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  const halfway = accessIssued + accessTokenExpiresIn * 0.5;
  if ((now > halfway && refreshToken && shouldAttachAccessToken) || (!accessTokenValid && refreshTokenValid)) {
    try {
      const refreshed = await refreshAccessToken(backend, refreshToken);
      if (refreshed) {
        const parsed = parseAuthSessionData(refreshed, backend);
        await updateSession(backend, parsed);
        config.headers.Authorization = `${parsed.tokenType} ${parsed.accessToken}`;
        return config;
      }
    } catch (err) {
      console.error("Refresh token attempt failed", err);
    }
  }

  if (!accessTokenValid && !refreshTokenValid) {
    await useAuthSessionStore.getState().updateSession(backend, { sessionExpired: true });
    controller.abort("Session expired, aborting request");
    return config;
  }

  return config;
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
