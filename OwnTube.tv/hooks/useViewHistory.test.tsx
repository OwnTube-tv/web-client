import { deleteFromAsyncStorage, multiGetFromAsyncStorage, readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useViewHistory } from "./useViewHistory";
import { createQueryClientWrapper } from "../utils/testing";

jest.mock("../utils/storage");

const wrapper = createQueryClientWrapper();

describe("useViewHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get view history sorted by last viewed date and limited by the specified number", async () => {
    (readFromAsyncStorage as jest.Mock).mockResolvedValueOnce(["uuid1", "uuid2"]);
    (multiGetFromAsyncStorage as jest.Mock).mockResolvedValueOnce([
      ["uuid1", JSON.stringify({ lastViewedAt: 123 })],
      ["uuid2", JSON.stringify({ lastViewedAt: 125 })],
      ["uuid3", JSON.stringify({ lastViewedAt: 109 })],
    ]);

    const { result } = renderHook(() => useViewHistory(2), { wrapper });

    await waitFor(() => expect(result.current.viewHistory).toEqual([{ lastViewedAt: 125 }, { lastViewedAt: 123 }]));
  });

  it("should add video to history + delete stale entries", async () => {
    (readFromAsyncStorage as jest.Mock)
      .mockResolvedValueOnce(["uuid1", "uuid2"])
      .mockResolvedValueOnce(["uuid1", "uuid2"])
      .mockResolvedValueOnce(null);

    const { result } = renderHook(() => useViewHistory(2), { wrapper });

    await act(async () => {
      await result.current.updateHistory({ data: { uuid: "uuid3", name: "big bug buggy", lastViewedAt: 1234 } });
    });

    expect(writeToAsyncStorage).toHaveBeenCalledWith(STORAGE.VIEW_HISTORY, ["uuid3", "uuid1"]);

    expect(writeToAsyncStorage).toHaveBeenLastCalledWith("uuid3", {
      firstViewedAt: 1234,
      lastViewedAt: 1234,
      name: "big bug buggy",
      timestamp: 0,
      uuid: "uuid3",
    });
  });

  it("should update a history entry", async () => {
    (readFromAsyncStorage as jest.Mock)
      .mockResolvedValueOnce(["uuid3", "uuid1", "uuid2"])
      .mockResolvedValueOnce(["uuid3", "uuid1", "uuid2"])
      .mockResolvedValueOnce({
        firstViewedAt: 1234,
        lastViewedAt: 1234,
        name: "big bug buggy",
        timestamp: 0,
        uuid: "uuid3",
      });

    const { result } = renderHook(() => useViewHistory(), { wrapper });

    await act(async () => {
      await result.current.updateHistory({ data: { uuid: "uuid3", timestamp: 12345 } });
    });

    expect(writeToAsyncStorage).toHaveBeenCalledWith("uuid3", {
      firstViewedAt: 1234,
      lastViewedAt: 1234,
      name: "big bug buggy",
      timestamp: 12345,
      uuid: "uuid3",
    });
  });

  it("should clear view history", async () => {
    (readFromAsyncStorage as jest.Mock).mockResolvedValue(["uuid3", "uuid1", "uuid2"]);

    const { result } = renderHook(() => useViewHistory(), { wrapper });

    await act(async () => {
      await result.current.clearHistory();
    });

    expect(deleteFromAsyncStorage).toHaveBeenNthCalledWith(1, ["uuid3", "uuid1", "uuid2"]);
    expect(deleteFromAsyncStorage).toHaveBeenNthCalledWith(2, [STORAGE.VIEW_HISTORY]);
  });
});
