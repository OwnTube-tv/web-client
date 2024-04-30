import { createContext, PropsWithChildren, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { readFromAsyncStorage, writeToAsyncStorage } from "../utils/storage";
import { SOURCES, STORAGE } from "../types";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
  source: SOURCES | undefined;
  switchSource: (source: SOURCES) => void;
  isSourceFetchedFromStorage: boolean;
}

const AppConfigContext = createContext<IAppConfigContext>({
  isDebugMode: false,
  setIsDebugMode: () => {},
  source: undefined,
  switchSource: () => {},
  isSourceFetchedFromStorage: false,
});

export const AppConfigContextProvider = ({ children }: PropsWithChildren) => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  const [source, setSource] = useState<SOURCES | undefined>();
  const [isSourceFetchedFromStorage, setIsSourceFetchedFromStorage] = useState(false);

  const switchSource = (source: SOURCES) => {
    writeToAsyncStorage(STORAGE.DATASOURCE, source);
    setSource(source);
  };

  useEffect(() => {
    (async () => {
      const storedSource = await readFromAsyncStorage(STORAGE.DATASOURCE);
      setSource(storedSource || SOURCES.PEERTUBE);
      setIsSourceFetchedFromStorage(true);
    })();
  }, []);

  return (
    <AppConfigContext.Provider
      value={{
        isDebugMode,
        setIsDebugMode,
        source,
        switchSource,
        isSourceFetchedFromStorage,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
