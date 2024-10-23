import { useEffect, useState } from "react";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { STORAGE } from "../../types";
import { useGlobalSearchParams } from "expo-router";

const useLeaveInstancePermission = ({ state }: DrawerContentComponentProps) => {
  const { backend } = useGlobalSearchParams<{ backend: string }>();
  const [isLeaveInstanceAllowed, setIsLeaveInstanceAllowed] = useState(false);

  useEffect(() => {
    if (!backend) return;
    const isOpeningFromLandingPage = state.history.some(
      (entry) => "key" in entry && entry.key.includes("(home)/index"),
    );

    const entrypoints = JSON.parse(window?.sessionStorage?.getItem(STORAGE.INSTANCE_ENTRYPOINTS) || "{}");

    if (entrypoints?.[backend]) {
      setIsLeaveInstanceAllowed(entrypoints[backend] === "landing");
    } else {
      window.sessionStorage.setItem(
        STORAGE.INSTANCE_ENTRYPOINTS,
        JSON.stringify({ ...entrypoints, [backend]: isOpeningFromLandingPage ? "landing" : "other" }),
      );

      setIsLeaveInstanceAllowed(isOpeningFromLandingPage);
    }
  }, [backend]);

  return { isLeaveInstanceAllowed };
};

export default useLeaveInstancePermission;
