import { createContext, PropsWithChildren, useContext, useState, Dispatch, SetStateAction, useEffect } from "react";
import { DeviceCapabilities, useDeviceCapabilities, useFeaturedInstancesData } from "../hooks";
import { useNetInfo } from "@react-native-community/netinfo";

import { InstanceConfig } from "../instanceConfigs";
import Toast from "react-native-toast-message";

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
  const { isConnected } = useNetInfo();

  useEffect(() => {
    if (!isConnected) {
      Toast.show({ type: "offline", autoHide: false });
    } else {
      Toast.show({ type: "online", autoHide: true });
    }
  }, [isConnected]);

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
