import { create } from "zustand";
import { User } from "@peertube/peertube-types";
import { readFromAsyncStorage, writeToAsyncStorage, deleteFromAsyncStorage } from "../utils";

export interface AuthSession {
  backend: string;
  basePath: string;
  email: string;
  twoFactorEnabled: boolean;
  sessionCreatedAt: string;
  sessionUpdatedAt: string;
  sessionExpired: boolean;
  tokenType: string;
  refreshToken: string;
  refreshTokenIssuedAt: string;
  refreshTokenExpiresIn: number;
  accessToken: string;
  accessTokenIssuedAt: string;
  accessTokenExpiresIn: number;
  userInfoResponse: User;
  userInfoUpdatedAt: string;
  authTokenRefreshInitiatedAt?: string;
  authTokenRefreshExpiresIn?: number;
}

interface AuthSessionStore {
  session?: AuthSession;
  addSession: (backend: string, session: Partial<AuthSession>) => Promise<void>;
  updateSession: (backend: string, session: Partial<AuthSession>) => Promise<void>;
  removeSession: (backend: string) => Promise<void>;
  selectSession: (backend: string) => Promise<void>;
  clearSession: () => void;
}

export const useAuthSessionStore = create<AuthSessionStore>((set, get) => ({
  session: undefined,

  addSession: async (backend, session) => {
    await writeToAsyncStorage(`${backend}/auth`, session);
  },

  updateSession: async (backend, updatedSession) => {
    const current = await readFromAsyncStorage(`${backend}/auth`);
    const merged = { ...current, ...updatedSession };
    await writeToAsyncStorage(`${backend}/auth`, merged);

    if (get().session?.backend === backend) {
      set({ session: merged });
    }
  },

  removeSession: async (backend) => {
    await deleteFromAsyncStorage([`${backend}/auth`]);
    if (get().session?.backend === backend) {
      set({ session: undefined });
    }
  },

  selectSession: async (backend) => {
    const loaded = await readFromAsyncStorage(`${backend}/auth`);
    if (loaded) {
      set({ session: loaded });
    }
  },

  clearSession: () => {
    set({ session: undefined });
  },
}));
