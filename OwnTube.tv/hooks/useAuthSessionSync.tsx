import { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import { useAuthSessionStore } from "../store";
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
    if (session?.sessionExpired) {
      toggleModal(true);
      setContent(<SignedOutModal handleClose={() => toggleModal(false)} />);
    }

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.myUserInfo] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.myChannelSubscription] });
  }, [session]);

  useEffect(() => {
    if (backend) {
      selectSession(backend);
    } else {
      clearSession();
    }
    setIsSessionDataLoaded(true);
  }, [backend]);

  return { isSessionDataLoaded };
};
