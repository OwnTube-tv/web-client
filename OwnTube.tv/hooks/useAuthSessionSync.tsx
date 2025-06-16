import { useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { useAuthSessionStore } from "../store";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { useFullScreenModalContext } from "../contexts";
import { SignedOutModal } from "../components";

export const useAuthSessionSync = () => {
  const { backend } = useGlobalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { session, selectSession, clearSession, removeSession } = useAuthSessionStore();
  const { setContent, toggleModal, setHandleModalClose } = useFullScreenModalContext();
  const handleClose = async () => {
    await removeSession(backend);
    toggleModal(false);
  };

  useEffect(() => {
    if (session?.sessionExpired) {
      toggleModal(true);
      setContent(<SignedOutModal handleClose={handleClose} />);
      setHandleModalClose?.(() => handleClose);
    }
  }, [session]);

  useEffect(() => {
    if (backend) {
      selectSession(backend);
    } else {
      clearSession();
    }
  }, [backend]);
};
