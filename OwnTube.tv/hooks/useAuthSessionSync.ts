import { useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { useAuthSessionStore } from "../store";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";

export const useAuthSessionSync = () => {
  const { backend } = useGlobalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { selectSession, clearSession } = useAuthSessionStore();

  useEffect(() => {
    if (backend) {
      selectSession(backend);
    } else {
      clearSession();
    }
  }, [backend]);
};
