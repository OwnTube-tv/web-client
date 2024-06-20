import { createContext, PropsWithChildren, useContext, useState, Dispatch, SetStateAction } from "react";
import { DeviceCapabilities, useDeviceCapabilities } from "../hooks";

interface IAppConfigContext {
  isDebugMode: boolean;
  setIsDebugMode: Dispatch<SetStateAction<boolean>>;
  deviceCapabilities: DeviceCapabilities;
  setPlayerImplementation: Dispatch<SetStateAction<string>>;
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

  return (
    <AppConfigContext.Provider value={{ isDebugMode, setIsDebugMode, deviceCapabilities, setPlayerImplementation }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
