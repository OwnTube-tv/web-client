import { useCallback, useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import { AUTH_SESSION_OBJECT_LENGTH, useAuthSessionStore } from "../store";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { useFullScreenModalContext } from "../contexts";
import { SignedOutModal } from "../components";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../api";

export const useAuthSessionSync = () => {
  const { backend } = useGlobalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { session, selectSession, clearSession } = useAuthSessionStore();
  const { setContent, toggleModal } = useFullScreenModalContext();
  const [isSessionDataLoaded, setIsSessionDataLoaded] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // clear invalid session data if present
    if (session && Object.keys(session).length < AUTH_SESSION_OBJECT_LENGTH) {
      console.info("Clearing invalid auth session data");
      clearSession(backend);
      return;
    }

    if (session?.sessionExpired) {
      toggleModal(true);
      setContent(<SignedOutModal handleClose={() => toggleModal(false)} />);
    }

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.myUserInfo] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.myChannelSubscription] });
  }, [session]);

  const handleCheckSessionExistence = useCallback(async () => {
    if (backend) {
      await selectSession(backend);
    } else {
      clearSession(backend);
    }
  }, [backend]);

  useEffect(() => {
    handleCheckSessionExistence().then(() => {
      setIsSessionDataLoaded(true);
    });
  }, [handleCheckSessionExistence]);

  return { isSessionDataLoaded };
};
