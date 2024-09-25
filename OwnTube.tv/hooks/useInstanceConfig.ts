import { useAppConfigContext } from "../contexts";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

export const useInstanceConfig = () => {
  const { featuredInstances } = useAppConfigContext();
  const { backend } = useLocalSearchParams<{ backend: string }>();
  const { backend: globalBackendParam } = useGlobalSearchParams<{ backend: string }>();

  return { currentInstanceConfig: featuredInstances?.find(({ url }) => [backend, globalBackendParam].includes(url)) };
};
