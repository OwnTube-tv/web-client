import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFromAsyncStorage, multiGetFromAsyncStorage, readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";
import type { DefaultError } from "@tanstack/query-core";
import { GetVideosVideo } from "../api/models";

export type ViewHistoryEntry = GetVideosVideo & {
  firstViewedAt?: number;
  lastViewedAt: number;
  backend: string;
  timestamp: number;
};
type UpdateHistoryMutationFnArg = { data: Partial<ViewHistoryEntry> & { uuid: string } };
type ViewHistoryBase = Record<string, ViewHistoryEntry>;

export const useViewHistory = (maxItems: number = 50) => {
  const queryClient = useQueryClient();

  const { data: viewHistory, isFetching } = useQuery<ViewHistoryBase, DefaultError, Array<ViewHistoryEntry>>({
    queryKey: ["viewHistory"],
    queryFn: async () => {
      const history: string[] | undefined = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);

      const entries = await multiGetFromAsyncStorage(history || []);

      return Object.fromEntries((entries || []).map(([key, value]) => [key, JSON.parse(value || "")]));
    },
    select: (data) =>
      Object.values(data)
        .sort((a: ViewHistoryEntry, b: ViewHistoryEntry) => b.lastViewedAt - a.lastViewedAt)
        .slice(0, maxItems),
  });

  const { mutateAsync: updateHistory } = useMutation({
    mutationFn: async ({ data }: UpdateHistoryMutationFnArg) => {
      const history: string[] = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);

      if (!history?.includes(data.uuid)) {
        const updatedHistory = [data.uuid, ...(history || [])];
        const staleEntries = updatedHistory.slice(maxItems);
        deleteFromAsyncStorage(staleEntries);

        await writeToAsyncStorage(STORAGE.VIEW_HISTORY, updatedHistory.slice(0, maxItems));
      }

      const videoToUpdate = await readFromAsyncStorage(data.uuid);

      const updatedVideoEntry = {
        ...(videoToUpdate || {}),
        ...data,
        firstViewedAt: videoToUpdate?.firstViewedAt || data.lastViewedAt,
        timestamp: data.timestamp ?? 0,
      };

      await writeToAsyncStorage(data.uuid, updatedVideoEntry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewHistory"] });
    },
  });

  const { mutateAsync: clearHistory } = useMutation({
    mutationFn: async () => {
      const history: string[] = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);

      await deleteFromAsyncStorage(history);
      await deleteFromAsyncStorage([STORAGE.VIEW_HISTORY]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewHistory"] });
    },
  });

  const getViewHistoryEntryByUuid = (uuid: string) => {
    const history = queryClient.getQueryData<ViewHistoryBase>(["viewHistory"]);

    return history?.[uuid];
  };

  return { viewHistory, isFetching, clearHistory, updateHistory, getViewHistoryEntryByUuid };
};
