import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

const useLeaveInstancePermission = ({ state }: DrawerContentComponentProps) => {
  const { backend } = useGlobalSearchParams<{ backend: string }>();
  const [instanceSessionEntrypoints, setInstanceSessionEntrypoints] = useState<Record<string, number>>({});
  const [isLeaveInstanceAllowed, setIsLeaveInstanceAllowed] = useState(false);

  useEffect(() => {
    if (!backend) return;

    const currentBackendEntrypoint = instanceSessionEntrypoints[backend];

    if (currentBackendEntrypoint !== null && currentBackendEntrypoint !== undefined) {
      setIsLeaveInstanceAllowed(currentBackendEntrypoint === 0);
    } else {
      setInstanceSessionEntrypoints((prev) => ({ ...prev, [backend]: state.index }));

      setIsLeaveInstanceAllowed(state.index === 0);
    }
  }, [backend]);

  return { isLeaveInstanceAllowed };
};

export default useLeaveInstancePermission;
