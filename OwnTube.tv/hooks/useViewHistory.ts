import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFromAsyncStorage, multiGetFromAsyncStorage, readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";
import type { DefaultError } from "@tanstack/query-core";
import { GetVideosVideo } from "../api/models";
import { Platform } from "react-native";

export type ViewHistoryEntry = GetVideosVideo & {
  firstViewedAt?: number;
  lastViewedAt: number;
  backend: string;
  timestamp: number;
};
type UpdateHistoryMutationFnArg = { data: Partial<ViewHistoryEntry> & { uuid: string } };
type ViewHistoryBase = Record<string, ViewHistoryEntry>;

const MAX_HISTORY_ITEMS_DEFAULT = 50;
const MAX_HISTORY_ITEMS_TVOS = 40;

export const useViewHistory = (queryArg?: { enabled?: boolean; maxItems?: number; backendToFilter?: string }) => {
  const queryClient = useQueryClient();
  const {
    enabled = true,
    maxItems = Platform.isTVOS ? MAX_HISTORY_ITEMS_TVOS : MAX_HISTORY_ITEMS_DEFAULT,
    backendToFilter,
  } = queryArg || {};

  const { data: viewHistory, isFetching } = useQuery<ViewHistoryBase, DefaultError, Array<ViewHistoryEntry>>({
    queryKey: ["viewHistory"],
    queryFn: async () => {
      const history: string[] | undefined = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);

      const keys = (history || []).map((uuid) => `view_history/${uuid}`);

      const entries = await multiGetFromAsyncStorage(keys);

      const result: ViewHistoryBase = {};

      entries?.forEach(([key, value]) => {
        if (value) {
          const uuid = key.replace("view_history/", "");
          result[uuid] = JSON.parse(value);
        }
      });

      return result;
    },
    staleTime: 0,
    select: (data) =>
      Object.values(data)
        .filter(({ backend }) => (backendToFilter ? backend === backendToFilter : true))
        .sort((a: ViewHistoryEntry, b: ViewHistoryEntry) => b.lastViewedAt - a.lastViewedAt)
        .slice(0, maxItems),
    enabled,
  });

  const { mutateAsync: updateHistory } = useMutation({
    mutationFn: async ({ data }: UpdateHistoryMutationFnArg) => {
      const history: string[] = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);

      if (!history?.includes(data.uuid)) {
        const updatedHistory = [data.uuid, ...(history || [])];
        const staleEntries = updatedHistory.slice(maxItems);
        await deleteFromAsyncStorage(staleEntries.map((uuid) => `view_history/${uuid}`));

        await writeToAsyncStorage(STORAGE.VIEW_HISTORY, updatedHistory.slice(0, maxItems));
      }

      const videoKey = `view_history/${data.uuid}`;
      const videoToUpdate = await readFromAsyncStorage(videoKey);

      const updatedVideoEntry = {
        ...(videoToUpdate || {}),
        ...data,
        firstViewedAt: videoToUpdate?.firstViewedAt || data.lastViewedAt,
      };
      if (data.timestamp !== null && data.timestamp !== undefined) {
        updatedVideoEntry.timestamp = data.timestamp;
      }

      await writeToAsyncStorage(videoKey, updatedVideoEntry);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["viewHistory"] });
    },
  });

  const { mutateAsync: clearHistory } = useMutation({
    mutationFn: async () => {
      const history: string[] = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);

      await deleteFromAsyncStorage(history.map((uuid) => `view_history/${uuid}`));

      await deleteFromAsyncStorage([STORAGE.VIEW_HISTORY]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewHistory"] });
    },
  });

  const { mutateAsync: clearInstanceHistory } = useMutation({
    mutationFn: async (backend: string) => {
      const history: string[] = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);
      const toDelete: string[] = [];
      const toKeep: string[] = [];

      for (const uuid of history) {
        const entry: ViewHistoryEntry = await readFromAsyncStorage(`view_history/${uuid}`);

        if (entry?.backend === backend) {
          toDelete.push(uuid);
        } else {
          toKeep.push(uuid);
        }
      }

      await deleteFromAsyncStorage(toDelete.map((uuid) => `view_history/${uuid}`));

      await writeToAsyncStorage(STORAGE.VIEW_HISTORY, toKeep);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewHistory"] });
    },
  });

  const getViewHistoryEntryByUuid = (uuid: string) => {
    const history = queryClient.getQueryData<ViewHistoryBase>(["viewHistory"]);

    return history?.[uuid];
  };

  const deleteVideoFromHistory = async (uuid: string) => {
    const history: string[] = await readFromAsyncStorage(STORAGE.VIEW_HISTORY);

    await writeToAsyncStorage(
      STORAGE.VIEW_HISTORY,
      history.filter((entry) => entry !== uuid),
    );

    await deleteFromAsyncStorage([`view_history/${uuid}`]);
    await queryClient.invalidateQueries({ queryKey: ["viewHistory"] });
  };

  return {
    viewHistory,
    isFetching,
    clearHistory,
    updateHistory,
    getViewHistoryEntryByUuid,
    deleteVideoFromHistory,
    clearInstanceHistory,
  };
};
