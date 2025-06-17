import { create } from "zustand";
import { InstanceConfig } from "../instanceConfigs";

export const useInstanceConfigStore = create<{
  currentInstanceConfig?: InstanceConfig;
  setCurrentInstanceConfig: (config?: InstanceConfig) => void;
}>((set) => {
  return {
    currentInstanceConfig: undefined,
    setCurrentInstanceConfig: (config) => set({ currentInstanceConfig: config }),
  };
});
