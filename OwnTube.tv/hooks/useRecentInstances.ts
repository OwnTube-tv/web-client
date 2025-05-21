import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";

export const useRecentInstances = () => {
  const queryClient = useQueryClient();
  const { data: recentInstances } = useQuery({
    queryKey: ["recentInstances"],
    queryFn: async () => {
      const instances: string[] | undefined = await readFromAsyncStorage(STORAGE.RECENT_INSTANCES);

      return instances || [];
    },
    select: (data) => {
      return data.slice(0, 50);
    },
    staleTime: 0,
  });

  const { mutateAsync: updateRecentInstances } = useMutation({
    mutationFn: async (data: string[]) => {
      await writeToAsyncStorage(STORAGE.RECENT_INSTANCES, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recentInstances"],
      });
    },
  });

  const addRecentInstance = async (instance: string) => {
    const currentInstances = queryClient.getQueryData<string[]>(["recentInstances"]);

    await updateRecentInstances(Array.from(new Set([instance, ...(currentInstances || [])])));
  };

  const clearRecentInstances = async () => {
    await updateRecentInstances([]);
  };

  return { recentInstances, addRecentInstance, clearRecentInstances };
};
