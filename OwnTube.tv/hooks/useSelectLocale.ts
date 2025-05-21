import { useTranslation } from "react-i18next";
import { readFromAsyncStorage, writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FALLBACK_LANG } from "../i18n";
import { useMemo } from "react";
import { getLocales } from "expo-localization";

const QUERY_KEY = "selectedLang";

export const useSelectLocale = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { data: selectedLang } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      return await readFromAsyncStorage(STORAGE.LOCALE);
    },
    staleTime: 0,
  });

  const handleChangeLang = async (langCode: string) => {
    i18n.changeLanguage(langCode);
    await writeToAsyncStorage(STORAGE.LOCALE, langCode);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  };

  const deviceLocales = useMemo(() => {
    return getLocales();
  }, []);

  const handleResetLang = async () => {
    await i18n.changeLanguage(
      process.env.EXPO_PUBLIC_LANGUAGE_OVERRIDE || deviceLocales[0].languageCode || FALLBACK_LANG,
    );
    await writeToAsyncStorage(STORAGE.LOCALE, "");
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  };

  return {
    t,
    handleChangeLang,
    currentLang: i18n.language,
    selectedLang,
    handleResetLang,
    defaultLang: deviceLocales?.[0].languageCode,
  };
};
