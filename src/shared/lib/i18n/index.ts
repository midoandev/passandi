import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import id from "./locales/id";
import en from "./locales/en";

export type Language = "id" | "en";

export const resources = { id: { translation: id }, en: { translation: en } };

const deviceLang = Localization.getLocales()[0]?.languageCode ?? "id";

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLang === "id" ? "id" : "en",
  fallbackLng: "id",
  interpolation: { escapeValue: false },
});

export default i18n;
