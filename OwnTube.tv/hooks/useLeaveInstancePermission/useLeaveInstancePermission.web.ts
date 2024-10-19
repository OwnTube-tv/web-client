import { useEffect, useState } from "react";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { STORAGE } from "../../types";
import { useGlobalSearchParams } from "expo-router";

const useLeaveInstancePermission = ({ state }: DrawerContentComponentProps) => {
  const { backend } = useGlobalSearchParams<{ backend: string }>();
  const [isLeaveInstanceAllowed, setIsLeaveInstanceAllowed] = useState(false);

  useEffect(() => {
    if (!backend) return;

    const entrypoints = JSON.parse(window?.sessionStorage?.getItem(STORAGE.INSTANCE_ENTRYPOINTS) || "{}");

    if (entrypoints?.[backend] !== null && entrypoints?.[backend] !== undefined) {
      setIsLeaveInstanceAllowed(entrypoints[backend] === 0);
    } else {
      window.sessionStorage.setItem(
        STORAGE.INSTANCE_ENTRYPOINTS,
        JSON.stringify({ ...entrypoints, [backend]: state.index }),
      );

      setIsLeaveInstanceAllowed(state.index === 0);
    }
  }, [backend]);

  return { isLeaveInstanceAllowed };
};

export default useLeaveInstancePermission;
