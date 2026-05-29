import { create } from "zustand";
import i18n, { Language } from "@/shared/lib/i18n";

type SettingsState = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  language: i18n.language as Language,

  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
}));
