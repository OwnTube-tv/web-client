import { create } from "zustand";
import { InstanceConfig } from "../instanceConfigs";

export const useInstanceConfigStore = create<{
  currentInstanceConfig?: InstanceConfig;
  instanceConfigList: InstanceConfig[];
  setCurrentInstanceConfig: (config?: InstanceConfig) => void;
  setInstanceConfigList: (configs?: InstanceConfig[]) => void;
  getConfigByBackend: (backend: string) => InstanceConfig | undefined;
}>((set, get) => {
  return {
    currentInstanceConfig: undefined,
    instanceConfigList: [],
    setCurrentInstanceConfig: (config) => set({ currentInstanceConfig: config }),
    setInstanceConfigList: (configs) => set({ instanceConfigList: configs }),
    getConfigByBackend: (backend: string) => {
      const { instanceConfigList } = get();
      return instanceConfigList.find((config) => config.hostname === backend);
    },
  };
});
