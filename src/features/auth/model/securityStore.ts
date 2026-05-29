import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";
import { AppError, createAppError } from "../../../shared/utils/error";

const KEYS = {
  masterHash: "passandi_master_hash",
  pinHash: "passandi_pin_hash",
  isSetup: "passandi_is_setup",
} as const;

type SecurityState = {
  isSetup: boolean;
  loading: boolean;
  error: AppError | null;

  checkIsSetup: () => Promise<boolean>;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => Promise<void>;
};

// Hash password dengan SHA256 + salt
const hashValue = (value: string): string => {
  const salt = "passandi_secure_salt_v1";
  return CryptoJS.SHA256(value + salt).toString();
};

export const useSecurityStore = create<SecurityState>((set) => ({
  isSetup: false,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  checkIsSetup: async () => {
    const val = await SecureStore.getItemAsync(KEYS.isSetup);
    const isSetup = val === "true";
    set({ isSetup });
    return isSetup;
  },

  setupPin: async (pin) => {
    set({ loading: true, error: null });
    try {
      const hashed = hashValue(pin);
      await SecureStore.setItemAsync(KEYS.pinHash, hashed);
      await SecureStore.setItemAsync(KEYS.isSetup, "true");
      set({ isSetup: true });
    } catch (e) {
      set({ error: createAppError("Gagal menyimpan PIN.") });
    }
    set({ loading: false });
  },

  verifyPin: async (pin) => {
    const stored = await SecureStore.getItemAsync(KEYS.pinHash);
    if (!stored) return false;
    return hashValue(pin) === stored;
  },

  reset: async () => {
    await SecureStore.deleteItemAsync(KEYS.masterHash);
    await SecureStore.deleteItemAsync(KEYS.pinHash);
    await SecureStore.deleteItemAsync(KEYS.isSetup);
    set({ isSetup: false });
  },
}));
