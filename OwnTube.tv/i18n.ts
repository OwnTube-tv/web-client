import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, uk, ru, sv } from "./locales";
import { getLocales } from "expo-localization";
import { enUS as enDateLocale, uk as ukDateLocale, ru as ruDateLocale, sv as svDateLocale } from "date-fns/locale";
import "intl-pluralrules";

export const FALLBACK_LANG = "en";

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: FALLBACK_LANG,
  defaultNS: "translation",
  lng: process.env.EXPO_PUBLIC_LANGUAGE_OVERRIDE || getLocales()[0]?.languageCode || undefined,
  pluralSeparator: "_",
});

i18n.addResourceBundle("en", "translation", en);
i18n.addResourceBundle("uk", "translation", uk);
i18n.addResourceBundle("ru", "translation", ru);
i18n.addResourceBundle("sv", "translation", sv);

export const LANGUAGE_OPTIONS = [
  {
    label: "English",
    value: "en",
    dateLocale: enDateLocale,
  },
  {
    label: "Українська",
    value: "uk",
    dateLocale: ukDateLocale,
  },
  {
    label: "Русский",
    value: "ru",
    dateLocale: ruDateLocale,
  },
  {
    label: "Svenska",
    value: "sv",
    dateLocale: svDateLocale,
  },
];

export default i18n;
