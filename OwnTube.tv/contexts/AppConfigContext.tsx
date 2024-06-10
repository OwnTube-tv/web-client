import { createContext, PropsWithChildren, useContext, useState, Dispatch, SetStateAction } from "react";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
}

const AppConfigContext = createContext<IAppConfigContext>({
  isDebugMode: false,
  setIsDebugMode: () => {},
});

export const AppConfigContextProvider = ({ children }: PropsWithChildren) => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  return <AppConfigContext.Provider value={{ isDebugMode, setIsDebugMode }}>{children}</AppConfigContext.Provider>;
};

export const useAppConfigContext = () => useContext(AppConfigContext);
