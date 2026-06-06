import { create } from "zustand";
import * as ExpoCrypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

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
      return hashed === stored;
    } catch {
      return false;
    }
  },

  clearPin: async (userId) => {
    try {
      await SecureStore.deleteItemAsync(getPinHashKey(userId));
      await SecureStore.deleteItemAsync(getHasPinKey(userId));
    } catch { }
    set({ hasPin: false });
  },
}));
