import { createContext, PropsWithChildren, useContext, useState, Dispatch, SetStateAction } from "react";
import { DeviceCapabilities, useDeviceCapabilities, useFeaturedInstancesData } from "../hooks";

import { InstanceConfig } from "../instanceConfigs";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
  deviceCapabilities: DeviceCapabilities;
  setPlayerImplementation: Dispatch<SetStateAction<string>>;
  featuredInstances?: InstanceConfig[];
}

const AppConfigContext = createContext<IAppConfigContext>({
  isDebugMode: false,
  setIsDebugMode: () => {},
  deviceCapabilities: {} as DeviceCapabilities,
  setPlayerImplementation: () => {},
});

export const AppConfigContextProvider = ({ children }: PropsWithChildren) => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const { deviceCapabilities, setPlayerImplementation } = useDeviceCapabilities();
  const { featuredInstances } = useFeaturedInstancesData();

  return (
    <AppConfigContext.Provider
      value={{
        isDebugMode,
        setIsDebugMode,
        deviceCapabilities,
        setPlayerImplementation,
        featuredInstances,
      }}
    >
      {!featuredInstances?.length ? null : children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
