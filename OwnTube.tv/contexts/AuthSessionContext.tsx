import { User } from "@peertube/peertube-types";
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import { deleteFromAsyncStorage, readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { axiosInstance } from "../api/axiosInstance";

export interface AuthSession {
  backend: string;
  basePath: string;
  email: string;
  twoFactorEnabled: boolean; // false if we can login without OTP
  sessionCreatedAt: string; // ISO-format
  sessionUpdatedAt: string; // ISO-format
  sessionExpired: boolean;
  tokenType: string;
  refreshToken: string;
  refreshTokenIssuedAt: string; // ISO-format
  refreshTokenExpiresIn: number; // 2 weeks by default, in seconds
  accessToken: string;
  accessTokenIssuedAt: string; // ISO-format
  accessTokenExpiresIn: number; // 1 day by default, in seconds
  userInfoResponse: User; // Response from https://<backend>/api/v1/users/me
  userInfoUpdatedAt: string;
}

interface AuthSessionContext {
  session?: Partial<AuthSession>;
  addSession: (backend: string, session: Partial<AuthSession>) => Promise<void>;
  updateSession: (backend: string, session: Partial<AuthSession>) => Promise<void>;
  removeSession: (backend: string) => Promise<void>;
  selectSession: (backend: string) => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContext>({
  addSession: async () => {},
  removeSession: async () => {},
  updateSession: async () => {},
  selectSession: async () => {},
});

export const AuthSessionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { backend } = useGlobalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const [session, setSession] = useState<AuthSession>();

  const addSession = async (instance: string, session: Partial<AuthSession>) => {
    await writeToAsyncStorage(`${instance}/auth`, session);
  };

  const selectSession = async (instance: string) => {
    const instanceAuthSession = await readFromAsyncStorage(`${instance}/auth`);

    if (instanceAuthSession) {
      setSession(instanceAuthSession);
      axiosInstance.defaults.headers.common["Authorization"] =
        `${instanceAuthSession.tokenType} ${instanceAuthSession.accessToken}`;
    }
  };

  const updateSession = async (instance: string, updatedSession: Partial<AuthSession>) => {
    const currentData = await readFromAsyncStorage(`${instance}/auth`);
    await writeToAsyncStorage(`${instance}/auth`, { ...currentData, ...updatedSession });
    if (session?.backend === instance) {
      setSession({ ...currentData, ...updatedSession });
    }
  };

  const removeSession = async (instance: string) => {
    await deleteFromAsyncStorage([`${instance}/auth`]);
    if (session?.backend === instance) {
      setSession(undefined);
      axiosInstance.defaults.headers.common["Authorization"] = null;
    }
  };

  useEffect(() => {
    if (backend) {
      selectSession(backend);
    } else {
      setSession(undefined);
      axiosInstance.defaults.headers.common["Authorization"] = null;
    }
  }, [backend]);

  return (
    <AuthSessionContext.Provider value={{ addSession, session, selectSession, updateSession, removeSession }}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSessionContext = () => useContext(AuthSessionContext);
