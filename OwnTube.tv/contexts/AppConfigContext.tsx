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
import { DeviceCapabilities, useDeviceCapabilities, useFeaturedInstancesData, useRecentInstances } from "../hooks";
import { useNetInfo } from "@react-native-community/netinfo";

import { InstanceConfig } from "../instanceConfigs";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useGlobalSearchParams } from "expo-router";
import { writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";
import { Platform } from "react-native";
import uuid from "react-native-uuid";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
  deviceCapabilities: DeviceCapabilities;
  featuredInstances?: InstanceConfig[];
  primaryBackend?: string;
  sessionId: string;
}

const AppConfigContext = createContext<IAppConfigContext>({
  isDebugMode: false,
  setIsDebugMode: () => {},
  deviceCapabilities: {} as DeviceCapabilities,
  sessionId: "",
});

export const AppConfigContextProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const [isDebugMode, setIsDebugMode] = useState(false);
  const { deviceCapabilities } = useDeviceCapabilities();
  const { featuredInstances } = useFeaturedInstancesData();
  const { isConnected } = useNetInfo();
  const lastRecordedConnectionState = useRef<boolean | undefined | null>();
  const { recentInstances, addRecentInstance } = useRecentInstances();
  const { backend } = useGlobalSearchParams<{ backend: string }>();

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

  useEffect(() => {
    if (backend && !recentInstances?.length) {
      addRecentInstance(backend);
      writeToAsyncStorage(STORAGE.DATASOURCE, backend);
    }
  }, [backend]);

  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.sessionStorage) {
      let storedSessionId = window.sessionStorage.getItem("owntube_session_id");

      if (!storedSessionId) {
        storedSessionId = uuid.v4();
        window.sessionStorage.setItem("owntube_session_id", storedSessionId);
      }

      setSessionId(storedSessionId);
    } else {
      setSessionId(uuid.v4());
    }
  }, []);

  return (
    <AppConfigContext.Provider
      value={{
        isDebugMode,
        setIsDebugMode,
        deviceCapabilities,
        featuredInstances,
        primaryBackend,
        sessionId,
      }}
    >
      {!featuredInstances?.length ? null : children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
