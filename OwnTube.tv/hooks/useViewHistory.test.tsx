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
      ["view_history/uuid1", JSON.stringify({ lastViewedAt: 123 })],
      ["view_history/uuid2", JSON.stringify({ lastViewedAt: 125 })],
    ]);

    const { result } = renderHook(() => useViewHistory({ enabled: true, maxItems: 2 }), { wrapper });

    await waitFor(() => expect(result.current.viewHistory).toEqual([{ lastViewedAt: 125 }, { lastViewedAt: 123 }]));
  });

  it("should add video to history + delete stale entries", async () => {
    (readFromAsyncStorage as jest.Mock)
      .mockResolvedValueOnce(["uuid1", "uuid2"])
      .mockResolvedValueOnce(["uuid1", "uuid2"])
      .mockResolvedValueOnce(null);

    const { result } = renderHook(() => useViewHistory({ enabled: true, maxItems: 2 }), { wrapper });

    await act(async () => {
      await result.current.updateHistory({ data: { uuid: "uuid3", name: "big bug buggy", lastViewedAt: 1234 } });
    });

    expect(writeToAsyncStorage).toHaveBeenCalledWith(STORAGE.VIEW_HISTORY, ["uuid3", "uuid1"]);

    expect(writeToAsyncStorage).toHaveBeenLastCalledWith("view_history/uuid3", {
      firstViewedAt: 1234,
      lastViewedAt: 1234,
      name: "big bug buggy",
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
        uuid: "uuid3",
      });

    const { result } = renderHook(() => useViewHistory(), { wrapper });

    await act(async () => {
      await result.current.updateHistory({ data: { uuid: "uuid3", timestamp: 12345 } });
    });

    expect(writeToAsyncStorage).toHaveBeenCalledWith("view_history/uuid3", {
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

    expect(deleteFromAsyncStorage).toHaveBeenNthCalledWith(1, [
      "view_history/uuid3",
      "view_history/uuid1",
      "view_history/uuid2",
    ]);
    expect(deleteFromAsyncStorage).toHaveBeenNthCalledWith(2, [STORAGE.VIEW_HISTORY]);
  });

  it("should remove history for a specified backend", async () => {
    (readFromAsyncStorage as jest.Mock)
      .mockResolvedValueOnce(["uuid1", "uuid2", "uuid3"])
      .mockResolvedValueOnce(["uuid1", "uuid2", "uuid3"])
      .mockResolvedValueOnce({ backend: "backend1" })
      .mockResolvedValueOnce({ backend: "backend2" })
      .mockResolvedValueOnce({ backend: "backend1" });

    const { result } = renderHook(() => useViewHistory({ enabled: true }), { wrapper });

    await act(async () => {
      await result.current.clearInstanceHistory("backend1");
    });

    expect(deleteFromAsyncStorage).toHaveBeenNthCalledWith(1, ["view_history/uuid1", "view_history/uuid3"]);
    expect(writeToAsyncStorage).toHaveBeenCalledWith(STORAGE.VIEW_HISTORY, ["uuid2"]);
  });
});
