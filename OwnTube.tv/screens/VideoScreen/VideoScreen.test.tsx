import { VideoScreen } from ".";
import { render, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";

jest.mock("../../api/queries", () => ({
  useGetVideoQuery: jest.fn(() => ({
    data: {
      uuid: "123",
      files: [
        { resolution: { id: 2160 } },
        { resolution: { id: 1080 }, fileUrl: "http://abc.xyz/static/web-videos/123-1080.mp4" },
        { resolution: { id: 240 } },
      ],
    },
  })),
}));
jest.mock("expo-router");

describe("VideoScreen", () => {
  it("should form a correct video uri and choose highest available quality no more than 1080", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValueOnce({ id: 123 });
    render(<VideoScreen />);
    expect(screen.getByTestId("123-video-view-video-playback").props.source.uri).toBe(
      "http://abc.xyz/static/web-videos/123-1080.mp4",
    );
  });

  it("should not render video if there is no id", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValueOnce({ id: null });
    render(<VideoScreen />);
    expect(screen.queryByTestId("123-video-view-video-playback")).toBeNull();
  });
});
