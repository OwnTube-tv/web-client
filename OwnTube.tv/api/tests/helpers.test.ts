import { retry, getErrorTextKeys, combineCollectionQueryResults, filterScheduledLivestreams } from "../helpers";
import { Video } from "@peertube/peertube-types";

describe("retry", () => {
  it("returns true if error status is 429", () => {
    expect(retry(1, { status: 429, text: "error", message: "unexpected" })).toBe(true);
  });

  it("returns true if failureCount < 5 and status is not 429", () => {
    expect(retry(3, { status: 500, text: "error", message: "unexpected" })).toBe(true);
  });

  it("returns false if failureCount >= 5 and status is not 429", () => {
    expect(retry(5, { status: 500, text: "error", message: "unexpected" })).toBe(false);
  });
});

describe("getErrorTextKeys", () => {
  it("returns accessDenied for status 401", () => {
    expect(getErrorTextKeys({ status: 401, text: "error", message: "unexpected" })).toEqual({
      title: "accessDenied",
      description: "noPermissions",
    });
  });

  it("returns accessDenied for status 403", () => {
    expect(getErrorTextKeys({ status: 403, text: "error", message: "unexpected" })).toEqual({
      title: "accessDenied",
      description: "noPermissions",
    });
  });

  it("returns pageCouldNotBeLoaded for other status", () => {
    expect(getErrorTextKeys({ status: 500, text: "error", message: "unexpected" })).toEqual({
      title: "pageCouldNotBeLoaded",
      description: "failedToEstablishConnection",
    });
  });

  it("returns pageCouldNotBeLoaded for null error", () => {
    expect(getErrorTextKeys(null)).toEqual({
      title: "pageCouldNotBeLoaded",
      description: "failedToEstablishConnection",
    });
  });
});

describe("combineCollectionQueryResults", () => {
  const mockResult = (data: any, isLoading = false): any => ({
    data,
    isLoading,
  });

  it("filters data with isError or total > 0", () => {
    const results = [
      mockResult({ isError: true, total: 0 }),
      mockResult({ isError: false, total: 2 }),
      mockResult({ isError: false, total: 0 }),
    ];
    const combined = combineCollectionQueryResults(results);
    expect(combined.data.length).toBe(2);
  });

  it("isLoading is true if one or more result is loading", () => {
    const results = [
      mockResult({ isError: false, total: 1 }, true),
      mockResult({ isError: false, total: 2 }, false),
      mockResult({ isError: false, total: 0 }, false),
    ];
    const combined = combineCollectionQueryResults(results);
    expect(combined.isLoading).toBe(true);
  });

  it("isError is true if all results have isError", () => {
    const results = [mockResult({ isError: true, total: 0 }), mockResult({ isError: true, total: 0 })];
    const combined = combineCollectionQueryResults(results);
    expect(combined.isError).toBe(true);
  });

  it("isError is false if not all results have isError", () => {
    const results = [mockResult({ isError: true, total: 0 }), mockResult({ isError: false, total: 1 })];
    const combined = combineCollectionQueryResults(results);
    expect(combined.isError).toBe(false);
  });
});

describe("filterScheduledLivestreams", () => {
  const now = Date.now();

  const videoWithSchedule = (offsetMs: number, id: number) => ({
    id,
    liveSchedules: [{ startAt: new Date(now + offsetMs).toISOString() }],
  });

  const videoWithoutSchedule = () => ({
    id: 999,
    liveSchedules: [],
  });

  it("returns videos with schedules within threshold and those without schedules", () => {
    const videos = [
      videoWithSchedule(60 * 60 * 1000, 1),
      videoWithSchedule(25 * 60 * 60 * 1000, 2),
      videoWithoutSchedule(),
    ];
    const filtered = filterScheduledLivestreams(videos as Video[], 22 * 60 * 60);
    expect(filtered.map((video) => video.id)).toEqual([1, 999]);
  });

  it("returns videos within default 24h if threshold is undefined", () => {
    const videos = [videoWithSchedule(60 * 60 * 1000, 1), videoWithSchedule(25 * 60 * 60 * 1000, 2)];
    const filtered = filterScheduledLivestreams(videos as Video[]);
    expect(filtered).toEqual([videoWithSchedule(60 * 60 * 1000, 1)]);
  });

  it("returns videos with no liveSchedules", () => {
    const videos = [videoWithoutSchedule()];
    const filtered = filterScheduledLivestreams(videos as any);
    expect(filtered).toEqual([videoWithoutSchedule()]);
  });
});
