import { createContext, PropsWithChildren, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { SOURCES, STORAGE } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../api";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
  source: SOURCES | undefined;
  switchSource: (source: SOURCES) => void;
}

const AppConfigContext = createContext<IAppConfigContext>({
  isDebugMode: false,
  setIsDebugMode: () => {},
  source: undefined,
  switchSource: () => {},
});

export const AppConfigContextProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [isDebugMode, setIsDebugMode] = useState(false);

  const [source, setSource] = useState<SOURCES | undefined>();

  const switchSource = async (source: SOURCES) => {
    setSource(source);
    await writeToAsyncStorage(STORAGE.DATASOURCE, source);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.videos], refetchType: "all" });
  };

  useEffect(() => {
    (async () => {
      const storedSource = await readFromAsyncStorage(STORAGE.DATASOURCE);
      setSource(storedSource || SOURCES.PEERTUBE);
    })();
  }, []);

  return (
    <AppConfigContext.Provider
      value={{
        isDebugMode,
        setIsDebugMode,
        source,
        switchSource,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
