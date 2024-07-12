import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, uk, ru, sv } from "./locales";
import { getLocales } from "expo-localization";

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: "en",
  defaultNS: "translation",
  lng: getLocales()[0]?.languageCode || undefined,
});

i18n.addResourceBundle("en", "translation", en);
i18n.addResourceBundle("uk", "translation", uk);
i18n.addResourceBundle("ru", "translation", ru);
i18n.addResourceBundle("sv", "translation", sv);

export const LANGUAGE_OPTIONS = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Українська",
    value: "uk",
  },
  {
    label: "Русский",
    value: "ru",
  },
  {
    label: "Svenska",
    value: "sv",
  },
];

export default i18n;
