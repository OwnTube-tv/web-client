import { renderHook, waitFor } from "@testing-library/react-native";
import { useGetVideoQuery, useGetVideosQuery } from "../queries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { SOURCES } from "../../types";
import { getLocalData } from "../helpers";
import { ApiServiceImpl } from "../peertubeVideosApi";
import { useLocalSearchParams } from "expo-router";

const wrapper = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

jest.mock("../helpers", () => ({
  getLocalData: jest.fn(() => ({ data: { foo: "bar" } })),
}));
jest.mock("../peertubeVideosApi", () => ({
  ApiServiceImpl: {
    getVideos: jest.fn(() => [
      { uuid: "123", thumbnailPath: "/123f-3fe-3" },
      { uuid: "1235", thumbnailPath: "/123f-3fe-3yt3" },
    ]),
    getVideo: jest.fn(() => ({
      uuid: "123",
      description: "desc",
    })),
  },
}));
jest.mock("expo-router");

describe("useGetVideosQuery", () => {
  afterEach(() => {
    (getLocalData as jest.Mock).mockReset();
  });

  it("should fetch test data if selected", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ backend: SOURCES.TEST_DATA });
    renderHook(() => useGetVideosQuery({ enabled: true }), { wrapper });
    await waitFor(() => expect(getLocalData).toHaveBeenCalledWith("videos"));
  });

  it("should add thumbnail paths to live data", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ backend: "abc.xyz" });
    const { result } = renderHook(() => useGetVideosQuery({ enabled: true }), { wrapper });
    await waitFor(() => expect(getLocalData).not.toHaveBeenCalled());
    await waitFor(() => expect(ApiServiceImpl.getVideos).toHaveBeenCalledWith("abc.xyz"));
    await waitFor(() =>
      expect(result.current.data).toStrictEqual([
        { thumbnailPath: "https://abc.xyz/123f-3fe-3", uuid: "123" },
        { thumbnailPath: "https://abc.xyz/123f-3fe-3yt3", uuid: "1235" },
      ]),
    );
  });
});

describe("useGetVideoQuery", () => {
  afterEach(() => {
    (getLocalData as jest.Mock).mockReset();
  });

  it("should fetch test data if selected", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ backend: SOURCES.TEST_DATA });
    renderHook(() => useGetVideoQuery("123"), { wrapper });
    await waitFor(() => expect(getLocalData).toHaveBeenCalledWith("video"));
  });

  it("should fetch live data", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ backend: "abc.xyz" });
    const { result } = renderHook(() => useGetVideoQuery("123"), { wrapper });
    await waitFor(() => expect(getLocalData).not.toHaveBeenCalled());
    await waitFor(() => expect(ApiServiceImpl.getVideo).toHaveBeenCalledWith("abc.xyz", "123"));
    await waitFor(() => expect(result.current.data).toStrictEqual({ description: "desc", uuid: "123" }));
  });
});
