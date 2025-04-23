import { Platform } from "react-native";
import { STORAGE } from "../types";
import { useState } from "react";

export const useSubtitlesSessionLocale = () => {
  const [sessionCCLocale, setSessionCCLocale] = useState("");
  const updateSessionCCLocale = (locale: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem(STORAGE.CC_LOCALE, locale);
      return;
    }
    setSessionCCLocale(locale);
  };

  return { sessionCCLocale, updateSessionCCLocale };
};
