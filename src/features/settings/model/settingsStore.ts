import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import i18n from "@/shared/lib/i18n";

type ThemeMode = "dark" | "light" | "system";
type AutoLock = "immediately" | "1min" | "5min" | "15min" | "never";
type ClearClip = "15s" | "30s" | "60s" | "never";
type Language = "id" | "en";

type SettingsState = {
  themeMode: ThemeMode;
  language: Language;
  biometricEnabled: boolean;
  notifEnabled: boolean;
  autoLock: AutoLock;
  clearClipboard: ClearClip;
  initialized: boolean;

  init: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setBiometric: (val: boolean) => Promise<void>;
  setNotif: (val: boolean) => Promise<void>;
  setAutoLock: (val: AutoLock) => Promise<void>;
  setClearClipboard: (val: ClearClip) => Promise<void>;
};

const KEY = "passandi_settings";

const DEFAULT: Omit<SettingsState,
  "initialized" | "init" | "setThemeMode" | "setLanguage" |
  "setBiometric" | "setNotif" | "setAutoLock" | "setClearClipboard"
> = {
  themeMode: "dark",
  language: "id",
  biometricEnabled: false,
  notifEnabled: true,
  autoLock: "1min",
  clearClipboard: "30s",
};

const save = async (state: Partial<typeof DEFAULT>) => {
  await SecureStore.setItemAsync(KEY, JSON.stringify(state));
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT,
  initialized: false,

  init: async () => {
    try {
      const raw = await SecureStore.getItemAsync(KEY);
      const data = raw ? JSON.parse(raw) : {};
      set({ ...DEFAULT, ...data, initialized: true });
      if (data.language) i18n.changeLanguage(data.language);
    } catch {
      set({ initialized: true });
    }
  },

  setThemeMode: async (themeMode) => {
    set({ themeMode });
    await save({ ...get(), themeMode });
  },

  setLanguage: async (language) => {
    i18n.changeLanguage(language);
    set({ language });
    await save({ ...get(), language });
  },

  setBiometric: async (biometricEnabled) => {
    set({ biometricEnabled });
    await save({ ...get(), biometricEnabled });
  },

  setNotif: async (notifEnabled) => {
    set({ notifEnabled });
    await save({ ...get(), notifEnabled });
  },

  setAutoLock: async (autoLock) => {
    set({ autoLock });
    await save({ ...get(), autoLock });
  },

  setClearClipboard: async (clearClipboard) => {
    set({ clearClipboard });
    await save({ ...get(), clearClipboard });
  },
}));