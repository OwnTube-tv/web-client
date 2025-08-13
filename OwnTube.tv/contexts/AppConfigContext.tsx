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
import {
  DeviceCapabilities,
  useDeviceCapabilities,
  useFeaturedInstancesData,
  useInstanceConfig,
  useRecentInstances,
  useSubtitlesSessionLocale,
} from "../hooks";
import { useNetInfo } from "@react-native-community/netinfo";
import { InstanceConfig } from "../instanceConfigs";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useGlobalSearchParams } from "expo-router";
import { readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";
import { Platform } from "react-native";
import uuid from "react-native-uuid";
import { useQueryClient } from "@tanstack/react-query";
import { GLOBAL_QUERY_STALE_TIME } from "../api";
import { useInstanceConfigStore } from "../store";
import { useCustomDiagnosticsEvents } from "../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents } from "../diagnostics/constants";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
  deviceCapabilities: DeviceCapabilities;
  featuredInstances?: InstanceConfig[];
  primaryBackend?: string;
  sessionId: string;
  sessionCCLocale: string;
  updateSessionCCLocale: (locale: string) => void;
  currentInstanceConfig?: InstanceConfig;
}

const AppConfigContext = createContext<IAppConfigContext>({
  isDebugMode: false,
  setIsDebugMode: () => {},
  deviceCapabilities: {} as DeviceCapabilities,
  sessionId: "",
  sessionCCLocale: "",
  updateSessionCCLocale: () => {},
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
  const { sessionCCLocale, updateSessionCCLocale } = useSubtitlesSessionLocale();
  const { currentInstanceConfig } = useInstanceConfig(featuredInstances);
  const queryClient = useQueryClient();
  const { setCurrentInstanceConfig, setInstanceConfigList } = useInstanceConfigStore();
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();

  useEffect(() => {
    setCurrentInstanceConfig(currentInstanceConfig);
  }, [currentInstanceConfig]);

  useEffect(() => {
    if (featuredInstances?.length) {
      setInstanceConfigList(featuredInstances);
    }
  }, [featuredInstances]);

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
    if (backend) {
      readFromAsyncStorage(STORAGE.DIAGNOSTICS_REPORTED_BACKEND).then((storedBackend) => {
        if (String(storedBackend) !== backend) {
          captureDiagnosticsEvent(CustomPostHogEvents.ChangeBackendServer, { backend });
          writeToAsyncStorage(STORAGE.DIAGNOSTICS_REPORTED_BACKEND, backend);
        }
      });
    }

    if (backend && !recentInstances?.length) {
      addRecentInstance(backend);
      writeToAsyncStorage(STORAGE.DATASOURCE, backend);
    }
  }, [backend]);

  useEffect(() => {
    queryClient.setDefaultOptions({
      queries: {
        staleTime: currentInstanceConfig?.customizations?.refreshQueriesStaleTimeMs || GLOBAL_QUERY_STALE_TIME,
      },
    });
  }, [currentInstanceConfig, queryClient]);

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

  useEffect(() => {
    readFromAsyncStorage(STORAGE.DEBUG_MODE).then((debugMode) => {
      setIsDebugMode(debugMode === "true");
    });
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
        sessionCCLocale,
        updateSessionCCLocale,
        currentInstanceConfig,
      }}
    >
      {!featuredInstances?.length ? null : children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
