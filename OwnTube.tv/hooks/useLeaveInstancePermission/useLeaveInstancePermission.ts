import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

const useLeaveInstancePermission = ({ state }: DrawerContentComponentProps) => {
  const { backend } = useGlobalSearchParams<{ backend: string }>();
  const [instanceSessionEntrypoints, setInstanceSessionEntrypoints] = useState<Record<string, "landing" | "other">>({});
  const [isLeaveInstanceAllowed, setIsLeaveInstanceAllowed] = useState(false);

  useEffect(() => {
    if (!backend) return;
    const isOpeningFromLandingPage = state.history.some(
      (entry) => "key" in entry && entry.key.includes("(home)/index"),
    );

    const currentBackendEntrypoint = instanceSessionEntrypoints[backend];

    if (currentBackendEntrypoint) {
      setIsLeaveInstanceAllowed(currentBackendEntrypoint === "landing");
    } else {
      setInstanceSessionEntrypoints((prev) => ({ ...prev, [backend]: isOpeningFromLandingPage ? "landing" : "other" }));

      setIsLeaveInstanceAllowed(isOpeningFromLandingPage);
    }
  }, [backend]);

  return { isLeaveInstanceAllowed };
};

export default useLeaveInstancePermission;
