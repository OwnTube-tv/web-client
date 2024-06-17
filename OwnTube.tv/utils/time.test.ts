import { getHumanReadableDuration } from "./time";

describe("getHumanReadableDuration", () => {
  it("should output 40m30s for 2_430_000 ms input", () => {
    expect(getHumanReadableDuration(2_430_000)).toBe("40:30");
  });

  it("should output 1h34m25s for 5_665_000 ms input", () => {
    expect(getHumanReadableDuration(5_665_000)).toBe("01:34:25");
  });

  it("should handle undefined input", () => {
    // ts-ignore
    expect(getHumanReadableDuration(undefined)).not.toBe("NaN:NaN");
  });
});
