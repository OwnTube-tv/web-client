import { getHumanReadableDuration, removeSecondsFromISODate } from "./time";

describe("getHumanReadableDuration", () => {
  it("should output 0h40m30s for 2_430_000 ms input", () => {
    expect(getHumanReadableDuration(2_430_000)).toBe("0:40:30");
  });

  it("should output 1h34m25s for 5_665_000 ms input", () => {
    expect(getHumanReadableDuration(5_665_000)).toBe("1:34:25");
  });

  it("should handle undefined input", () => {
    // ts-ignore
    expect(getHumanReadableDuration(undefined)).not.toBe("NaN:NaN");
  });
});

describe("removeSecondsFromISODate", () => {
  it("should remove seconds from an ISO formatted date", () => {
    expect(removeSecondsFromISODate("1970-01-01T00:00:00Z")).toBe("1970-01-01T00:00Z");
  });
});
