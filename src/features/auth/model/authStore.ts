import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/shared/lib/supabase";
import { AppError, createAppError } from "../../../shared/utils/error";

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, name: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: AppError | null;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, initialized: true });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signInEmail: async (email, password) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) set({ error: createAppError(error.message) });
    set({ loading: false });
  },

  signUpEmail: async (email, password, name) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) set({ error: createAppError(error.message) });
    set({ loading: false });
  },

  signInGoogle: async () => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "passandi://auth/callback",
      },
    });
    if (error) set({ error: createAppError(error.message) });
    set({ loading: false });
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ session: null, user: null, loading: false });
  },
}));
