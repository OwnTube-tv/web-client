import { capitalize, getAvailableVidsString, formatFileSize } from "./common";

describe("capitalize", () => {
  it("capitalizes the first letter of a string", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("Hello")).toBe("Hello");
    expect(capitalize("h")).toBe("H");
  });

  it("returns an empty string if input is empty", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("getAvailableVidsString", () => {
  it("returns string with count when count is provided", () => {
    expect(getAvailableVidsString(5)).toBe(" (5)");
    expect(getAvailableVidsString(0)).toBe(" (0)");
  });

  it("returns string with '?' when count is undefined", () => {
    expect(getAvailableVidsString()).toBe(" (?)");
  });
});

describe("formatFileSize", () => {
  it("formats bytes to human-readable string", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1048576)).toBe("1 MB");
    expect(formatFileSize(1073741824)).toBe("1 GB");
    expect(formatFileSize(1099511627776)).toBe("1 TB");
    expect(formatFileSize(1125899906842624)).toBe("1 PB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });
});
