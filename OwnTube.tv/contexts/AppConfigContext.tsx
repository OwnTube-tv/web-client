import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { DeviceCapabilities, useDeviceCapabilities, useFeaturedInstancesData } from "../hooks";
import { useNetInfo } from "@react-native-community/netinfo";

import { InstanceConfig } from "../instanceConfigs";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
  deviceCapabilities: DeviceCapabilities;
  setPlayerImplementation: Dispatch<SetStateAction<string>>;
  featuredInstances?: InstanceConfig[];
  primaryBackend?: string;
}

const AppConfigContext = createContext<IAppConfigContext>({
  isDebugMode: false,
  setIsDebugMode: () => {},
  deviceCapabilities: {} as DeviceCapabilities,
  setPlayerImplementation: () => {},
});

export const AppConfigContextProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const [isDebugMode, setIsDebugMode] = useState(false);
  const { deviceCapabilities, setPlayerImplementation } = useDeviceCapabilities();
  const { featuredInstances } = useFeaturedInstancesData();
  const { isConnected } = useNetInfo();
  const lastRecordedConnectionState = useRef<boolean | undefined | null>();

  useEffect(() => {
    if (lastRecordedConnectionState.current === true && !isConnected) {
      Toast.show({ type: "info", text1: t("noNetworkConnection"), props: { isError: true }, autoHide: false });
    }

    if (lastRecordedConnectionState.current === false && isConnected) {
      Toast.show({ type: "info", text1: t("networkConnectionRestored"), autoHide: true });
    }

    lastRecordedConnectionState.current = isConnected;
  }, [isConnected]);

  const primaryBackend = process.env.EXPO_PUBLIC_PRIMARY_BACKEND;

  return (
    <AppConfigContext.Provider
      value={{
        isDebugMode,
        setIsDebugMode,
        deviceCapabilities,
        setPlayerImplementation,
        featuredInstances,
        primaryBackend,
      }}
    >
      {!featuredInstances?.length ? null : children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
