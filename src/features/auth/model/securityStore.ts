import { create } from "zustand";
import * as ExpoCrypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { setupVaultKey, changeVaultKey, deleteVaultKeys, ensureDirectKey } from "@/shared/lib/encryption";
import { setSessionPin } from "@/shared/lib/sessionPin";

import { AppError, createAppError } from "../../../shared/utils/error";

const getPinHashKey = (userId: string) => `passandi_pin_hash_${userId}`;
const getHasPinKey = (userId: string) => `passandi_has_pin_${userId}`;

const hashPin = async (pin: string): Promise<string> => {
  const salt = process.env.EXPO_PUBLIC_PIN_SALT ?? "dev_fallback_salt";
  const input = pin + salt;
  return await ExpoCrypto.digestStringAsync(
    ExpoCrypto.CryptoDigestAlgorithm.SHA256,
    input
  );
};

type SecurityState = {
  hasPin: boolean;
  loading: boolean;
  error: AppError | null;

  checkHasPin: (userId: string) => Promise<boolean>;
  setupPin: (userId: string, pin: string) => Promise<void>;
  verifyPin: (userId: string, pin: string) => Promise<boolean>;
  clearPin: (userId: string) => Promise<void>;
  clearError: () => void;
  changePin: (userId: string, oldPin: string, newPin: string) => Promise<void>;
};

export const useSecurityStore = create<SecurityState>((set) => ({
  hasPin: false,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  checkHasPin: async (userId) => {
    try {
      const val = await SecureStore.getItemAsync(getHasPinKey(userId));
      const hasPin = val === "true";
      set({ hasPin });
      return hasPin;
    } catch {
      return false;
    }
  },

  setupPin: async (userId, pin) => {
    set({ loading: true, error: null });
    try {
      const hashed = await hashPin(pin);
      await SecureStore.setItemAsync(getPinHashKey(userId), hashed);
      await SecureStore.setItemAsync(getHasPinKey(userId), "true");
      await setupVaultKey(pin);
      set({ hasPin: true });
    } catch {
      set({ error: createAppError("Gagal menyimpan PIN.") });
    }
    set({ loading: false });
  },

  verifyPin: async (userId, pin) => {
    try {
      const stored = await SecureStore.getItemAsync(getPinHashKey(userId));
      if (!stored) return false;
      const hashed = await hashPin(pin);
      const valid = hashed === stored;
      if (valid) {
        setSessionPin(pin);
        await ensureDirectKey(pin).catch(() => {});
      }
      return valid;
    } catch {
      return false;
    }
  },

  changePin: async (userId, oldPin, newPin) => {
    set({ loading: true, error: null });
    try {
      const hashed = await hashPin(newPin);
      await SecureStore.setItemAsync(getPinHashKey(userId), hashed);
      await SecureStore.setItemAsync(getHasPinKey(userId), "true");
      await changeVaultKey(oldPin, newPin);
      set({ hasPin: true });
    } catch {
      set({ error: createAppError("Gagal mengubah PIN.") });
    }
    set({ loading: false });
  },

  clearPin: async (userId) => {
    try {
      await SecureStore.deleteItemAsync(getPinHashKey(userId));
      await SecureStore.deleteItemAsync(getHasPinKey(userId));
      await deleteVaultKeys();
    } catch {
      // best-effort — item mungkin sudah tidak ada
    }
    set({ hasPin: false });
    setSessionPin(null);
  },
}));
