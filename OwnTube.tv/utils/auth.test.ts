import { parseAuthSessionData } from "./auth";
import { UserLogin } from "@peertube/peertube-types";

// Mock the instance config store
jest.mock("../store", () => ({
  useInstanceConfigStore: {
    getState: jest.fn(() => ({
      getConfigByBackend: jest.fn(() => null),
    })),
  },
}));

describe("parseAuthSessionData", () => {
  const mockLoginResponse: UserLogin & { expires_in: number; refresh_token_expires_in: number } = {
    access_token: "test-access-token",
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: "test-refresh-token",
    refresh_token_expires_in: 1209600,
  };

  const backend = "peertube.example.com";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set sessionCreatedAt when isRefresh is not provided (initial login)", () => {
    const result = parseAuthSessionData(mockLoginResponse, backend);

    expect(result.sessionCreatedAt).toBeDefined();
    expect(result.sessionCreatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it("should set sessionCreatedAt when isRefresh is false (initial login)", () => {
    const result = parseAuthSessionData(mockLoginResponse, backend, false);

    expect(result.sessionCreatedAt).toBeDefined();
    expect(result.sessionCreatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it("should NOT set sessionCreatedAt when isRefresh is true (token refresh)", () => {
    const result = parseAuthSessionData(mockLoginResponse, backend, true);

    expect(result.sessionCreatedAt).toBeUndefined();
  });

  it("should always set sessionUpdatedAt regardless of isRefresh", () => {
    const resultInitial = parseAuthSessionData(mockLoginResponse, backend, false);
    const resultRefresh = parseAuthSessionData(mockLoginResponse, backend, true);

    expect(resultInitial.sessionUpdatedAt).toBeDefined();
    expect(resultRefresh.sessionUpdatedAt).toBeDefined();
  });

  it("should always set token fields regardless of isRefresh", () => {
    const result = parseAuthSessionData(mockLoginResponse, backend, true);

    expect(result.accessToken).toBe("test-access-token");
    expect(result.tokenType).toBe("Bearer");
    expect(result.accessTokenExpiresIn).toBe(3600);
    expect(result.refreshToken).toBe("test-refresh-token");
    expect(result.refreshTokenExpiresIn).toBe(1209600);
    expect(result.accessTokenIssuedAt).toBeDefined();
    expect(result.refreshTokenIssuedAt).toBeDefined();
  });

  it("should set backend and basePath fields", () => {
    const result = parseAuthSessionData(mockLoginResponse, backend, true);

    expect(result.backend).toBe(backend);
    expect(result.basePath).toBe("/api/v1");
    expect(result.twoFactorEnabled).toBe(false);
    expect(result.sessionExpired).toBe(false);
  });
});
