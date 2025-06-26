import { VideoScreen } from ".";
import { render, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("expo-router");
jest.mock("../../api/queries", () => ({
  useGetVideoQuery: jest.fn(() => ({
    data: {
      name: "fastest car",
      previewPath: "/thumb.jpg",
      uuid: "123",
      category: "cars",
      description: "a description",
      duration: 200,
      files: [
        { resolution: { id: 2160 } },
        { resolution: { id: 1080 }, fileUrl: "http://abc.xyz/static/web-videos/123-1080.mp4" },
        { resolution: { id: 240 } },
      ],
    },
  })),
  useGetVideoCaptionsQuery: jest.fn(() => ({ data: {} })),
  useGetVideoFullInfoCollectionQuery: jest.fn(() => []),
  useGetVideoCaptionsCollectionQuery: jest.fn(() => []),
  useGetSubscriptionByChannelQuery: jest.fn(() => ({
    data: { qualifiedChannelName: true },
  })),
}));
const mockUpdHistory = jest.fn();
jest.mock("../../hooks", () => ({
  ...jest.requireActual("../../hooks"),
  useViewHistory: jest.fn(() => ({ updateHistory: mockUpdHistory })),
  useInstanceConfig: jest.fn(() => ({ currentInstanceConfig: { hideVideoSiteLink: false } })),
}));
(useLocalSearchParams as jest.Mock).mockReturnValue({ id: 123, backend: "example.com" });
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useTheme: jest.fn(() => ({
    colors: {
      dark: {},
      light: {},
    },
  })),
  useIsFocused: jest.fn(() => true),
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => mockSafeAreaContext),
}));
jest.mock("react-native-video", () => ({
  Video: "Video",
}));
jest.mock("../../components/VideoView", () => "VideoView");

describe("VideoScreen", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2020-12-12T12:12:40Z"));
  });

  it("should form a correct video uri and choose highest available quality no more than 1080", () => {
    render(<VideoScreen />);
    expect(screen.getByTestId("123-video-view").props.uri).toBe("http://abc.xyz/static/web-videos/123-1080.mp4");
  });

  it("should not render video if there is no id", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValueOnce({ id: null });
    render(<VideoScreen />);
    expect(screen.queryByTestId("123-video-view-video-playback")).toBeNull();
  });

  it("should send an update event to history on initial video load", () => {
    render(<VideoScreen />);
    expect(mockUpdHistory).toHaveBeenCalledWith({
      data: {
        backend: "example.com",
        category: "cars",
        description: "a description",
        duration: 200,
        lastViewedAt: 1607775160000,
        name: "fastest car",
        previewPath: "https://example.com/thumb.jpg",
        uuid: "123",
        files: [
          { resolution: { id: 2160 } },
          { resolution: { id: 1080 }, fileUrl: "http://abc.xyz/static/web-videos/123-1080.mp4" },
          { resolution: { id: 240 } },
        ],
      },
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
