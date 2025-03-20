import { renderHook, waitFor } from "@testing-library/react-native";
import { SOURCES } from "../../types";
import { getLocalData } from "../helpers";
import { ApiServiceImpl } from "../peertubeVideosApi";
import { useLocalSearchParams } from "expo-router";
import { createQueryClientWrapper } from "../../utils/testing";
import { useGetVideoQuery, useGetVideosQuery } from "./videos";

const wrapper = createQueryClientWrapper();

jest.mock("../helpers", () => ({
  getLocalData: jest.fn(() => ({ data: { foo: "bar" } })),
}));
jest.mock("../peertubeVideosApi", () => ({
  ApiServiceImpl: {
    getVideos: jest.fn(() => ({
      data: [
        { uuid: "123", previewPath: "/123f-3fe-3" },
        { uuid: "1235", previewPath: "/123f-3fe-3yt3" },
      ],
      total: 50,
    })),
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
});

describe("useGetVideoQuery", () => {
  afterEach(() => {
    (getLocalData as jest.Mock).mockReset();
  });

  it("should fetch test data if selected", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ backend: SOURCES.TEST_DATA });
    renderHook(() => useGetVideoQuery({ id: "123" }), { wrapper });
    await waitFor(() => expect(getLocalData).toHaveBeenCalledWith("video"));
  });

  it("should fetch live data", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ backend: "abc.xyz" });
    const { result } = renderHook(() => useGetVideoQuery({ id: "123" }), { wrapper });
    await waitFor(() => expect(getLocalData).not.toHaveBeenCalled());
    await waitFor(() => expect(ApiServiceImpl.getVideo).toHaveBeenCalledWith("abc.xyz", "123"));
    await waitFor(() => expect(result.current.data).toStrictEqual({ description: "desc", uuid: "123" }));
  });
});
