import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { InstanceConfig } from "../instanceConfigs";

export const useInstanceConfig = (featuredInstances: InstanceConfig[]) => {
  const { backend } = useLocalSearchParams<{ backend: string }>();
  const { backend: globalBackendParam } = useGlobalSearchParams<{ backend: string }>();

  return {
    currentInstanceConfig: featuredInstances?.find(({ hostname }) => [backend, globalBackendParam].includes(hostname)),
  };
};
