import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { supabase } from "@/shared/lib/supabase";
import { useSecurityStore } from "./securityStore";
import { AppError, createAppError } from "../../../shared/utils/error";
import { Result } from "../../../shared/utils/result";

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<Result<void>>;
  signUpEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<Result<void>>;
  signInGoogle: () => Promise<Result<void>>;
  signOut: () => Promise<void>;
  wipeData: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,
  error: null,

  initialize: async () => {
    try {
      const { GoogleSignin } = await import("@react-native-google-signin/google-signin");
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      });
    } catch {
      // Native module not available — Google Sign-In disabled
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, initialized: true });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signInEmail: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    set({ loading: false });
    if (error) {
      return { success: false, error: createAppError(error.message) };
    }
    return { success: true, data: undefined };
  },

  signUpEmail: async (email, password, name) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    set({ loading: false });
    if (error) {
      return { success: false, error: createAppError(error.message) };
    }
    return { success: true, data: undefined };
  },

  signInGoogle: async () => {
    set({ loading: true });
    try {
      const { GoogleSignin, statusCodes } = await import("@react-native-google-signin/google-signin");
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type === "cancelled") {
        set({ loading: false });
        return { success: false, error: createAppError("google_signin_cancelled") };
      }
      const idToken = signInResult.data.idToken;
      if (!idToken) {
        set({ loading: false });
        return { success: false, error: createAppError("google_signin_no_token") };
      }
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) {
        set({ loading: false });
        return { success: false, error: createAppError(error.message) };
      }
      set({ loading: false });
      return { success: true, data: undefined };
    } catch (e: any) {
      set({ loading: false });
      try {
        const { statusCodes } = await import("@react-native-google-signin/google-signin");
        if (e?.code === statusCodes.SIGN_IN_CANCELLED) {
          return { success: false, error: createAppError("google_signin_cancelled") };
        }
      } catch {
        // ignore
      }
      return { success: false, error: createAppError(e?.message ?? "google_signin_failed") };
    }
  },

  // Kondisi 5 & 6 — Logout biasa, PIN tidak dihapus
  // Jika login akun sama → PIN masih ada (kondisi 5)
  // Jika login akun lain → PIN tidak ada untuk userId baru (kondisi 6)
  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ session: null, user: null, loading: false });
  },

  // Kondisi 7 — Wipe: hapus session + PIN userId ini + data vault lokal
  wipeData: async () => {
    set({ loading: true });
    const userId = get().user?.id;
    if (userId) {
      await useSecurityStore.getState().clearPin(userId);
      const { clearLocalVaultData } = await import("@/features/vault/api/vaultApi");
      await clearLocalVaultData(userId);
      const { clearRemoteVaultData } = await import("@/shared/lib/database/seeder");
      await clearRemoteVaultData(userId);
    }
    await supabase.auth.signOut();
    set({ session: null, user: null, loading: false });
  },

  // Kondisi 8 — Hapus akun: wipe lokal + hapus dari Supabase
  deleteAccount: async () => {
    set({ loading: true });
    const userId = get().user?.id;
    if (userId) {
      await useSecurityStore.getState().clearPin(userId);
      // Hapus semua data vault di Supabase milik userId ini
      await supabase.from("vault_items").delete().eq("user_id", userId);
      // Hapus user dari Supabase Auth via RPC
      await supabase.rpc("delete_user");
    }
    await supabase.auth.signOut();
    set({ session: null, user: null, loading: false });
  },
}));
