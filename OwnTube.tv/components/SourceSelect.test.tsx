import { render, screen } from "@testing-library/react-native";
import { SourceSelect } from "./SourceSelect";

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  useGetInstancesQuery: () => ({
    data: [
      { id: "withLocalVids", totalLocalVideos: 100 },
      { id: "withoutLocalVids", totalLocalVideos: 0 },
    ],
  }),
}));

jest.mock("./ComboBoxInput", () => ({
  ComboBoxInput: "ComboBoxInput",
}));

describe("SourceSelect", () => {
  it("should filter out 0-video instances", () => {
    render(<SourceSelect />);
    expect(screen.getByTestId("custom-instance-select").props.data.length).toBe(1);
  });
});
