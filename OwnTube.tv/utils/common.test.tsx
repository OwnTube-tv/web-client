import { capitalize } from "./common";

describe("capitalize", () => {
  it("should capitalize a string", () => {
    expect(capitalize("testing")).toBe("Testing");
  });
});
