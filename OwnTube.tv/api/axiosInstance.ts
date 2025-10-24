import axios, { AxiosInstance } from "axios";
import { useAuthSessionStore } from "../store";
import { parseISOToEpoch } from "../utils";
import { parseAuthSessionData } from "../utils/auth";
import { OAuthClientLocal, UserLogin } from "@peertube/peertube-types";
import { postHogInstance } from "../diagnostics";
import { CustomPostHogEvents, CustomPostHogExceptions } from "../diagnostics/constants";
import { APP_IDENTIFIER } from "./sharedConstants";

// Refresh tokens at a specified percentage of their lifetime to maximize login persistence
// for intermittent users (users who visit every few weeks)
const TOKEN_REFRESH_LIFETIME_PERCENTAGE = 0.5;

export const axiosInstance = axios.create({
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "X-App-Identifier": APP_IDENTIFIER,
  },
});

const controller = new AbortController();

const REFRESH_LOCKS: Record<string, boolean> = {};

/**
 * Refreshes an access token using a refresh token.
 *
 * Uses a backend-specific lock to prevent concurrent refresh attempts.
 * Typical use case: Proactively refresh tokens before they expire to keep
 * intermittent users logged in (users who visit every few weeks).
 *
 * @param backend - The backend server hostname
 * @param refreshToken - The refresh token to use
 * @returns The new login response with fresh tokens, or null if locked
 */
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
  } catch (error) {
    postHogInstance.captureException(error, { errorType: CustomPostHogExceptions.TokenError });
  } finally {
    delete REFRESH_LOCKS[backend];
  }
};

axiosInstance.interceptors.request.use(async (config) => {
  const backend = config.baseURL?.replace("/api/v1", "").replace("https://", "");

  const { session, updateSession } = useAuthSessionStore.getState();

  if (!backend) return config;

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
  } = session || {};

  const now = Math.floor(Date.now() / 1000);

  // Normalize issuedAt timestamps and expiresIn values to safe numbers.
  const accessIssued = accessTokenIssuedAt ? parseISOToEpoch(accessTokenIssuedAt) : 0;
  const accessExpiresInNum = Number(accessTokenExpiresIn ?? 0);
  const accessValidUntil = accessIssued && accessExpiresInNum ? accessIssued + accessExpiresInNum - 10 : 0;
  const accessTokenValid = accessIssued > 0 && accessExpiresInNum > 0 && accessIssued <= now && now < accessValidUntil;

  const refreshIssued = refreshTokenIssuedAt ? parseISOToEpoch(refreshTokenIssuedAt) : 0;
  const refreshExpiresInNum = Number(refreshTokenExpiresIn ?? 0);
  const refreshValidUntil = refreshIssued && refreshExpiresInNum ? refreshIssued + refreshExpiresInNum - 10 : 0;
  const refreshTokenValid =
    refreshIssued > 0 && refreshExpiresInNum > 0 && refreshIssued <= now && now < refreshValidUntil;

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

  // Proactively refresh tokens at a specified percentage of their lifetime to maximize login
  // persistence for intermittent users. For a typical 2-week token lifetime,
  // this refreshes after ~1 week if set to 50%, ensuring the refresh token itself gets
  // renewed before it expires.
  const proactiveRefreshThreshold =
    accessIssued && accessExpiresInNum ? accessIssued + accessExpiresInNum * TOKEN_REFRESH_LIFETIME_PERCENTAGE : 0;
  if (
    (now > proactiveRefreshThreshold && refreshToken && shouldAttachAccessToken) ||
    (!accessTokenValid && refreshTokenValid)
  ) {
    try {
      if (!refreshToken) throw new Error("Missing refresh token");
      const refreshed = await refreshAccessToken(backend, refreshToken);
      if (refreshed) {
        const parsed = parseAuthSessionData(refreshed, backend);
        await updateSession(backend, parsed);
        config.headers.Authorization = `${parsed.tokenType} ${parsed.accessToken}`;
        return config;
      }
    } catch (err) {
      console.error("Refresh token attempt failed", err);
      postHogInstance.captureException(err, { errorType: CustomPostHogExceptions.TokenError });
    }
  }

  if (!accessTokenValid && !refreshTokenValid && session) {
    await useAuthSessionStore.getState().updateSession(backend, { sessionExpired: true });
    controller.abort("Session expired, aborting request");
    postHogInstance.capture(CustomPostHogEvents.SessionExpired);
    return config;
  }

  return config;
});

// Capture 401 and prompt the user to login again
axiosInstance.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    try {
      const status = error?.response?.status;
      if (status === 401) {
        const config = error?.config || {};
        const backend = config.baseURL?.replace("/api/v1", "").replace("https://", "");

        if (typeof backend === "string" && backend.length > 0) {
          console.info("Session expired, aborting request");
          const existingSession = useAuthSessionStore.getState().session;

          if (existingSession && existingSession.backend === backend) {
            await useAuthSessionStore.getState().updateSession(backend, { sessionExpired: true });
          }
        }

        postHogInstance.capture(CustomPostHogEvents.SessionExpired);
      }
    } catch (e) {
      console.error("Stale token handling frontend error:", e);
    }

    return Promise.reject(error);
  },
);

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
